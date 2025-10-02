const StudentAssignment = require("../models/student-assignment.model");
const StudentDetails = require("../models/details/student-details.model");
const FacultyDetails = require("../models/details/faculty-details.model");
const ApiResponse = require("../utils/ApiResponse");

const assignStudentToFacultyController = async (req, res) => {
  try {
    const { studentId, facultyId, subjectId, semester, branchId } = req.body;

    if (!studentId || !facultyId || !subjectId || !semester || !branchId) {
      return ApiResponse.badRequest("All fields are required").send(res);
    }

    // Check if student exists
    const student = await StudentDetails.findById(studentId);
    if (!student) {
      return ApiResponse.notFound("Student not found").send(res);
    }

    // Check if faculty exists
    const faculty = await FacultyDetails.findById(facultyId);
    if (!faculty) {
      return ApiResponse.notFound("Faculty not found").send(res);
    }

    // Check if assignment already exists
    const existingAssignment = await StudentAssignment.findOne({
      studentId,
      facultyId,
      subjectId,
    });

    if (existingAssignment) {
      return ApiResponse.conflict("Student is already assigned to this faculty for this subject").send(res);
    }

    const assignment = await StudentAssignment.create({
      studentId,
      facultyId,
      subjectId,
      semester,
      branchId,
    });

    const populatedAssignment = await StudentAssignment.findById(assignment._id)
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName email")
      .populate("subjectId", "name code")
      .populate("branchId", "name code");

    return ApiResponse.created(populatedAssignment, "Student assigned to faculty successfully").send(res);
  } catch (error) {
    console.error("Assign Student Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getStudentAssignmentsController = async (req, res) => {
  try {
    const { facultyId, studentId, semester, branchId } = req.query;
    let query = {};

    if (facultyId) query.facultyId = facultyId;
    if (studentId) query.studentId = studentId;
    if (semester) query.semester = semester;
    if (branchId) query.branchId = branchId;

    const assignments = await StudentAssignment.find(query)
      .populate("studentId", "firstName lastName enrollmentNo email phone semester")
      .populate("facultyId", "firstName lastName email phone")
      .populate("subjectId", "name code")
      .populate("branchId", "name code")
      .sort({ createdAt: -1 });

    return ApiResponse.success(assignments, "Student assignments retrieved successfully").send(res);
  } catch (error) {
    console.error("Get Assignments Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const updateStudentAssignmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const assignment = await StudentAssignment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName email")
      .populate("subjectId", "name code")
      .populate("branchId", "name code");

    if (!assignment) {
      return ApiResponse.notFound("Assignment not found").send(res);
    }

    return ApiResponse.success(assignment, "Assignment updated successfully").send(res);
  } catch (error) {
    console.error("Update Assignment Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const deleteStudentAssignmentController = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await StudentAssignment.findByIdAndDelete(id);

    if (!assignment) {
      return ApiResponse.notFound("Assignment not found").send(res);
    }

    return ApiResponse.success(null, "Assignment deleted successfully").send(res);
  } catch (error) {
    console.error("Delete Assignment Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getMyAssignedStudentsController = async (req, res) => {
  try {
    const facultyId = req.userId;

    const assignments = await StudentAssignment.find({
      facultyId,
      isActive: true,
    })
      .populate("studentId", "firstName lastName enrollmentNo email phone semester profile")
      .populate("subjectId", "name code")
      .populate("branchId", "name code")
      .sort({ createdAt: -1 });

    return ApiResponse.success(assignments, "Assigned students retrieved successfully").send(res);
  } catch (error) {
    console.error("Get My Students Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

module.exports = {
  assignStudentToFacultyController,
  getStudentAssignmentsController,
  updateStudentAssignmentController,
  deleteStudentAssignmentController,
  getMyAssignedStudentsController,
};
