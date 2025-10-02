const Mentorship = require("../models/mentorship.model");
const StudentDetail = require("../models/details/student-details.model");
const FacultyDetail = require("../models/details/faculty-details.model");
const ApiResponse = require("../utils/ApiResponse");

// Assign students to faculty mentor
const assignStudentsToMentor = async (req, res) => {
  try {
    const { facultyId, studentIds, notes } = req.body;
    const assignedBy = req.user._id;

    if (!facultyId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json(new ApiResponse(400, "Faculty ID and student IDs are required"));
    }

    // Verify faculty exists and is active
    const faculty = await FacultyDetail.findById(facultyId);
    if (!faculty || faculty.status !== "active") {
      return res.status(404).json(new ApiResponse(404, "Faculty not found or inactive"));
    }

    // Verify all students exist and are active
    const students = await StudentDetail.find({
      _id: { $in: studentIds },
      status: "active"
    });

    if (students.length !== studentIds.length) {
      return res.status(404).json(new ApiResponse(404, "Some students not found or inactive"));
    }

    // Check for existing active mentorships
    const existingMentorships = await Mentorship.find({
      studentId: { $in: studentIds },
      status: "active"
    });

    if (existingMentorships.length > 0) {
      const existingStudentIds = existingMentorships.map(m => m.studentId.toString());
      return res.status(400).json(new ApiResponse(400, `Students already have active mentors: ${existingStudentIds.join(", ")}`));
    }

    // Create mentorship assignments
    const mentorships = studentIds.map(studentId => ({
      studentId,
      facultyId,
      assignedBy,
      notes: notes || "",
      assignmentDate: new Date()
    }));

    const createdMentorships = await Mentorship.insertMany(mentorships);

    res.status(201).json(new ApiResponse(201, "Students assigned to mentor successfully", createdMentorships));
  } catch (error) {
    console.error("Error assigning students to mentor:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
};

// Get all mentorship assignments
const getAllMentorships = async (req, res) => {
  try {
    const { status, facultyId, studentId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (facultyId) filter.facultyId = facultyId;
    if (studentId) filter.studentId = studentId;

    const mentorships = await Mentorship.find(filter)
      .populate("studentId", "firstName lastName enrollmentNo semester branchId")
      .populate("facultyId", "firstName lastName employeeId designation")
      .populate("assignedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, "Mentorships retrieved successfully", mentorships));
  } catch (error) {
    console.error("Error fetching mentorships:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
};

// Get mentorship assignments for a specific faculty
const getFacultyMentorships = async (req, res) => {
  try {
    const facultyId = req.params.facultyId || req.user._id;

    const mentorships = await Mentorship.find({
      facultyId,
      status: "active"
    })
      .populate("studentId", "firstName lastName enrollmentNo semester branchId email phone")
      .populate("assignedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, "Faculty mentorships retrieved successfully", mentorships));
  } catch (error) {
    console.error("Error fetching faculty mentorships:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
};

// Get mentorship assignment for a specific student
const getStudentMentorship = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user._id;

    const mentorship = await Mentorship.findOne({
      studentId,
      status: "active"
    })
      .populate("facultyId", "firstName lastName employeeId designation email phone")
      .populate("assignedBy", "firstName lastName");

    if (!mentorship) {
      return res.status(404).json(new ApiResponse(404, "No active mentorship found for this student"));
    }

    res.status(200).json(new ApiResponse(200, "Student mentorship retrieved successfully", mentorship));
  } catch (error) {
    console.error("Error fetching student mentorship:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
};

// Update mentorship status
const updateMentorshipStatus = async (req, res) => {
  try {
    const { mentorshipId } = req.params;
    const { status, notes } = req.body;

    if (!["active", "inactive", "completed"].includes(status)) {
      return res.status(400).json(new ApiResponse(400, "Invalid status"));
    }

    const mentorship = await Mentorship.findByIdAndUpdate(
      mentorshipId,
      { status, notes },
      { new: true }
    )
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName employeeId");

    if (!mentorship) {
      return res.status(404).json(new ApiResponse(404, "Mentorship not found"));
    }

    res.status(200).json(new ApiResponse(200, "Mentorship status updated successfully", mentorship));
  } catch (error) {
    console.error("Error updating mentorship status:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
};

// Reassign student to different mentor
const reassignMentor = async (req, res) => {
  try {
    const { mentorshipId } = req.params;
    const { newFacultyId, notes } = req.body;
    const reassignedBy = req.user._id;

    if (!newFacultyId) {
      return res.status(400).json(new ApiResponse(400, "New faculty ID is required"));
    }

    // Verify new faculty exists
    const newFaculty = await FacultyDetail.findById(newFacultyId);
    if (!newFaculty || newFaculty.status !== "active") {
      return res.status(404).json(new ApiResponse(404, "New faculty not found or inactive"));
    }

    const mentorship = await Mentorship.findById(mentorshipId);
    if (!mentorship) {
      return res.status(404).json(new ApiResponse(404, "Mentorship not found"));
    }

    // End current mentorship
    await Mentorship.findByIdAndUpdate(mentorshipId, {
      status: "completed",
      notes: notes || "Reassigned to new mentor"
    });

    // Create new mentorship
    const newMentorship = new Mentorship({
      studentId: mentorship.studentId,
      facultyId: newFacultyId,
      assignedBy: reassignedBy,
      notes: notes || "Reassigned from previous mentor",
      assignmentDate: new Date()
    });

    await newMentorship.save();

    const populatedMentorship = await Mentorship.findById(newMentorship._id)
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName employeeId")
      .populate("assignedBy", "firstName lastName");

    res.status(200).json(new ApiResponse(200, "Student reassigned to new mentor successfully", populatedMentorship));
  } catch (error) {
    console.error("Error reassigning mentor:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
};

// Add mentorship goal
const addMentorshipGoal = async (req, res) => {
  try {
    const { mentorshipId } = req.params;
    const { goal, targetDate } = req.body;

    if (!goal || !targetDate) {
      return res.status(400).json(new ApiResponse(400, "Goal and target date are required"));
    }

    const mentorship = await Mentorship.findByIdAndUpdate(
      mentorshipId,
      {
        $push: {
          mentorshipGoals: {
            goal,
            targetDate: new Date(targetDate),
            status: "pending"
          }
        }
      },
      { new: true }
    )
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName employeeId");

    if (!mentorship) {
      return res.status(404).json(new ApiResponse(404, "Mentorship not found"));
    }

    res.status(200).json(new ApiResponse(200, "Mentorship goal added successfully", mentorship));
  } catch (error) {
    console.error("Error adding mentorship goal:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
};

// Update mentorship goal status
const updateMentorshipGoal = async (req, res) => {
  try {
    const { mentorshipId, goalId } = req.params;
    const { status } = req.body;

    if (!["pending", "in_progress", "completed"].includes(status)) {
      return res.status(400).json(new ApiResponse(400, "Invalid goal status"));
    }

    const mentorship = await Mentorship.findOneAndUpdate(
      { _id: mentorshipId, "mentorshipGoals._id": goalId },
      {
        $set: {
          "mentorshipGoals.$.status": status
        }
      },
      { new: true }
    )
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName employeeId");

    if (!mentorship) {
      return res.status(404).json(new ApiResponse(404, "Mentorship or goal not found"));
    }

    res.status(200).json(new ApiResponse(200, "Mentorship goal updated successfully", mentorship));
  } catch (error) {
    console.error("Error updating mentorship goal:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
};

// Add meeting record
const addMeetingRecord = async (req, res) => {
  try {
    const { mentorshipId } = req.params;
    const { date, topic, notes, outcome } = req.body;

    if (!date || !topic) {
      return res.status(400).json(new ApiResponse(400, "Meeting date and topic are required"));
    }

    const mentorship = await Mentorship.findByIdAndUpdate(
      mentorshipId,
      {
        $push: {
          meetings: {
            date: new Date(date),
            topic,
            notes: notes || "",
            outcome: outcome || ""
          }
        }
      },
      { new: true }
    )
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName employeeId");

    if (!mentorship) {
      return res.status(404).json(new ApiResponse(404, "Mentorship not found"));
    }

    res.status(200).json(new ApiResponse(200, "Meeting record added successfully", mentorship));
  } catch (error) {
    console.error("Error adding meeting record:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
};

// Add progress report
const addProgressReport = async (req, res) => {
  try {
    const { mentorshipId } = req.params;
    const { academicProgress, behavioralProgress, concerns, recommendations } = req.body;

    const mentorship = await Mentorship.findByIdAndUpdate(
      mentorshipId,
      {
        $push: {
          progressReports: {
            reportDate: new Date(),
            academicProgress: academicProgress || "",
            behavioralProgress: behavioralProgress || "",
            concerns: concerns || "",
            recommendations: recommendations || ""
          }
        }
      },
      { new: true }
    )
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName employeeId");

    if (!mentorship) {
      return res.status(404).json(new ApiResponse(404, "Mentorship not found"));
    }

    res.status(200).json(new ApiResponse(200, "Progress report added successfully", mentorship));
  } catch (error) {
    console.error("Error adding progress report:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error"));
  }
};

module.exports = {
  assignStudentsToMentor,
  getAllMentorships,
  getFacultyMentorships,
  getStudentMentorship,
  updateMentorshipStatus,
  reassignMentor,
  addMentorshipGoal,
  updateMentorshipGoal,
  addMeetingRecord,
  addProgressReport
};
