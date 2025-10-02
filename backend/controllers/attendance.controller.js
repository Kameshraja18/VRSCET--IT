const Attendance = require("../models/attendance.model");
const StudentDetails = require("../models/details/student-details.model");
const FacultyDetails = require("../models/details/faculty-details.model");
const ApiResponse = require("../utils/ApiResponse");

const markAttendanceController = async (req, res) => {
  try {
    const { studentId, subjectId, date, status, classType = "lecture", remarks } = req.body;
    const facultyId = req.userId;

    if (!studentId || !subjectId || !date || !status) {
      return ApiResponse.badRequest("Student ID, subject ID, date, and status are required").send(res);
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

    // Check if attendance already exists for this student-subject-date combination
    const existingAttendance = await Attendance.findOne({
      studentId,
      subjectId,
      date: new Date(date),
    });

    if (existingAttendance) {
      return ApiResponse.conflict("Attendance already marked for this student on this date").send(res);
    }

    const attendance = await Attendance.create({
      studentId,
      facultyId,
      subjectId,
      semester: student.semester,
      branchId: student.branchId,
      date: new Date(date),
      status,
      classType,
      remarks,
      markedBy: facultyId,
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName")
      .populate("subjectId", "name code")
      .populate("branchId", "name code")
      .populate("markedBy", "firstName lastName");

    return ApiResponse.created(populatedAttendance, "Attendance marked successfully").send(res);
  } catch (error) {
    console.error("Mark Attendance Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const bulkMarkAttendanceController = async (req, res) => {
  try {
    const { attendances } = req.body; // Array of attendance records
    const facultyId = req.userId;

    if (!Array.isArray(attendances) || attendances.length === 0) {
      return ApiResponse.badRequest("Attendance data array is required").send(res);
    }

    const savedAttendances = [];

    for (const attendanceData of attendances) {
      const { studentId, subjectId, date, status, classType = "lecture", remarks } = attendanceData;

      // Check if attendance already exists
      const existingAttendance = await Attendance.findOne({
        studentId,
        subjectId,
        date: new Date(date),
      });

      if (!existingAttendance) {
        const attendance = await Attendance.create({
          studentId,
          facultyId,
          subjectId,
          date: new Date(date),
          status,
          classType,
          remarks,
          markedBy: facultyId,
        });
        savedAttendances.push(attendance);
      }
    }

    const populatedAttendances = await Attendance.find({
      _id: { $in: savedAttendances.map(a => a._id) }
    })
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName")
      .populate("subjectId", "name code")
      .populate("branchId", "name code");

    return ApiResponse.created(populatedAttendances, "Bulk attendance marked successfully").send(res);
  } catch (error) {
    console.error("Bulk Mark Attendance Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getAttendanceController = async (req, res) => {
  try {
    const { studentId, facultyId, subjectId, date, semester, branchId, classType } = req.query;
    let query = {};

    if (studentId) query.studentId = studentId;
    if (facultyId) query.facultyId = facultyId;
    if (subjectId) query.subjectId = subjectId;
    if (date) query.date = new Date(date);
    if (semester) query.semester = parseInt(semester);
    if (branchId) query.branchId = branchId;
    if (classType) query.classType = classType;

    const attendance = await Attendance.find(query)
      .populate("studentId", "firstName lastName enrollmentNo email")
      .populate("facultyId", "firstName lastName email")
      .populate("subjectId", "name code")
      .populate("branchId", "name code")
      .populate("markedBy", "firstName lastName")
      .sort({ date: -1, createdAt: -1 });

    return ApiResponse.success(attendance, "Attendance records retrieved successfully").send(res);
  } catch (error) {
    console.error("Get Attendance Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getStudentAttendanceController = async (req, res) => {
  try {
    const studentId = req.userId;
    const { subjectId, semester, month, year } = req.query;

    let query = { studentId };

    if (subjectId) query.subjectId = subjectId;
    if (semester) query.semester = parseInt(semester);

    // Filter by month/year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate("facultyId", "firstName lastName")
      .populate("subjectId", "name code")
      .populate("branchId", "name code")
      .sort({ date: -1 });

    // Calculate attendance statistics
    const totalClasses = attendance.length;
    const presentCount = attendance.filter(a => a.status === "present").length;
    const absentCount = attendance.filter(a => a.status === "absent").length;
    const lateCount = attendance.filter(a => a.status === "late").length;
    const excusedCount = attendance.filter(a => a.status === "excused").length;

    const attendancePercentage = totalClasses > 0 ? ((presentCount + excusedCount) / totalClasses * 100).toFixed(2) : 0;

    const result = {
      attendance,
      statistics: {
        totalClasses,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        attendancePercentage: parseFloat(attendancePercentage),
      },
    };

    return ApiResponse.success(result, "Student attendance retrieved successfully").send(res);
  } catch (error) {
    console.error("Get Student Attendance Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const updateAttendanceController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const facultyId = req.userId;

    const attendance = await Attendance.findOneAndUpdate(
      { _id: id, markedBy: facultyId },
      { status, remarks },
      { new: true }
    )
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName")
      .populate("subjectId", "name code")
      .populate("branchId", "name code");

    if (!attendance) {
      return ApiResponse.notFound("Attendance record not found or unauthorized").send(res);
    }

    return ApiResponse.success(attendance, "Attendance updated successfully").send(res);
  } catch (error) {
    console.error("Update Attendance Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const deleteAttendanceController = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.userId;

    const attendance = await Attendance.findOneAndDelete({
      _id: id,
      markedBy: facultyId,
    });

    if (!attendance) {
      return ApiResponse.notFound("Attendance record not found or unauthorized").send(res);
    }

    return ApiResponse.success(null, "Attendance record deleted successfully").send(res);
  } catch (error) {
    console.error("Delete Attendance Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getAttendanceReportController = async (req, res) => {
  try {
    const { semester, branchId, subjectId, month, year } = req.query;
    let query = {};

    if (semester) query.semester = parseInt(semester);
    if (branchId) query.branchId = branchId;
    if (subjectId) query.subjectId = subjectId;

    // Filter by month/year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("subjectId", "name code")
      .populate("facultyId", "firstName lastName")
      .sort({ date: -1 });

    // Group by student for report
    const studentReport = {};

    attendanceRecords.forEach(record => {
      const studentId = record.studentId._id.toString();
      if (!studentReport[studentId]) {
        studentReport[studentId] = {
          student: record.studentId,
          totalClasses: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          attendanceRecords: [],
        };
      }

      studentReport[studentId].totalClasses++;
      studentReport[studentId][record.status]++;
      studentReport[studentId].attendanceRecords.push(record);
    });

    // Calculate percentages
    const report = Object.values(studentReport).map(student => ({
      ...student,
      attendancePercentage: ((student.present + student.excused) / student.totalClasses * 100).toFixed(2),
    }));

    return ApiResponse.success(report, "Attendance report generated successfully").send(res);
  } catch (error) {
    console.error("Get Attendance Report Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Get attendance summary for a student
const getStudentAttendanceSummaryController = async (req, res) => {
  try {
    const { studentId } = req.query;
    const userId = req.userId;

    // If no studentId provided, use the logged-in user's ID
    const targetStudentId = studentId || userId;

    const summary = await Attendance.aggregate([
      { $match: { studentId: targetStudentId } },
      {
        $group: {
          _id: "$subjectId",
          totalClasses: { $sum: 1 },
          presentCount: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absentCount: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
          lateCount: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: "subjects",
          localField: "_id",
          foreignField: "_id",
          as: "subject"
        }
      },
      {
        $unwind: "$subject"
      },
      {
        $project: {
          subjectName: "$subject.name",
          subjectCode: "$subject.code",
          totalClasses: 1,
          presentCount: 1,
          absentCount: 1,
          lateCount: 1,
          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: [{ $add: ["$presentCount", { $multiply: ["$lateCount", 0.5] }] }, "$totalClasses"] },
                  100
                ]
              },
              1
            ]
          }
        }
      },
      { $sort: { attendancePercentage: -1 } }
    ]);

    return ApiResponse.success(summary, "Student attendance summary retrieved successfully").send(res);
  } catch (error) {
    console.error("Get Student Attendance Summary Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Get attendance trends for a subject
const getSubjectAttendanceTrendsController = async (req, res) => {
  try {
    const { subjectId, days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await Attendance.aggregate([
      {
        $match: {
          subjectId: subjectId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          totalStudents: { $sum: 1 },
          presentCount: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absentCount: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
          lateCount: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } }
        }
      },
      {
        $project: {
          date: "$_id",
          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: [{ $add: ["$presentCount", { $multiply: ["$lateCount", 0.5] }] }, "$totalStudents"] },
                  100
                ]
              },
              1
            ]
          },
          presentCount: 1,
          absentCount: 1,
          lateCount: 1
        }
      },
      { $sort: { date: 1 } }
    ]);

    return ApiResponse.success(trends, "Subject attendance trends retrieved successfully").send(res);
  } catch (error) {
    console.error("Get Subject Attendance Trends Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

// Export attendance data
const exportAttendanceController = async (req, res) => {
  try {
    const { subjectId, startDate, endDate, format = "csv" } = req.query;

    let query = {};
    if (subjectId) query.subjectId = subjectId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate("studentId", "firstName lastName email")
      .populate("subjectId", "name code")
      .populate("facultyId", "firstName lastName")
      .sort({ date: -1 });

    if (format === "csv") {
      const csvHeaders = "Date,Student Name,Student Email,Subject,Faculty,Status\n";
      const csvRows = attendance.map(record => {
        return `"${record.date.toISOString().split('T')[0]}","${record.studentId.firstName} ${record.studentId.lastName}","${record.studentId.email}","${record.subjectId.name}","${record.facultyId.firstName} ${record.facultyId.lastName}","${record.status}"`;
      }).join("\n");

      const csvContent = csvHeaders + csvRows;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="attendance-report.csv"');
      res.status(200).send(csvContent);
    } else {
      return ApiResponse.success(attendance, "Attendance data retrieved successfully").send(res);
    }
  } catch (error) {
    console.error("Export Attendance Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

module.exports = {
  markAttendanceController,
  bulkMarkAttendanceController,
  getAttendanceController,
  getStudentAttendanceController,
  updateAttendanceController,
  deleteAttendanceController,
  getAttendanceReportController,
  getStudentAttendanceSummaryController,
  getSubjectAttendanceTrendsController,
  exportAttendanceController,
};
