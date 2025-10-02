const AdminDetails = require("../models/details/admin-details.model");
const StudentDetails = require("../models/details/student-details.model");
const FacultyDetails = require("../models/details/faculty-details.model");
const Subject = require("../models/subject.model");
const Attendance = require("../models/attendance.model");
const AuditLog = require("../models/audit-log.model");
const ApiResponse = require("../utils/ApiResponse");
const { default: mongoose } = require("mongoose");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Get total counts
    const [totalStudents, totalFaculty, totalSubjects] = await Promise.all([
      StudentDetails.countDocuments(),
      FacultyDetails.countDocuments(),
      Subject.countDocuments()
    ]);

    // Get previous month counts for trends
    const [prevStudents, prevFaculty, prevSubjects] = await Promise.all([
      StudentDetails.countDocuments({ createdAt: { $lt: lastMonth } }),
      FacultyDetails.countDocuments({ createdAt: { $lt: lastMonth } }),
      Subject.countDocuments({ createdAt: { $lt: lastMonth } })
    ]);

    // Calculate trends
    const studentTrend = prevStudents > 0 ? Math.round(((totalStudents - prevStudents) / prevStudents) * 100) : 0;
    const facultyTrend = prevFaculty > 0 ? Math.round(((totalFaculty - prevFaculty) / prevFaculty) * 100) : 0;
    const subjectTrend = prevSubjects > 0 ? Math.round(((totalSubjects - prevSubjects) / prevSubjects) * 100) : 0;

    // Get attendance statistics
    const attendanceStats = await Attendance.aggregate([
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
          },
          lateCount: {
            $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] }
          }
        }
      }
    ]);

    const attendanceData = attendanceStats[0] || { totalRecords: 0, presentCount: 0, lateCount: 0 };
    const averageAttendance = attendanceData.totalRecords > 0
      ? Math.round(((attendanceData.presentCount + attendanceData.lateCount * 0.5) / attendanceData.totalRecords) * 100)
      : 0;

    // Get subject-wise attendance
    const subjectAttendance = await Attendance.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      {
        $unwind: "$subject"
      },
      {
        $group: {
          _id: "$subjectId",
          name: { $first: "$subject.name" },
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
          },
          lateCount: {
            $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          name: 1,
          attendance: {
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
      { $sort: { attendance: -1 } },
      { $limit: 10 }
    ]);

    const stats = {
      totalStudents,
      totalFaculty,
      totalSubjects,
      averageAttendance,
      studentTrend,
      facultyTrend,
      subjectTrend,
      attendanceTrend: 0, // Calculate based on last month
      subjectAttendance
    };

    res.status(200).json(new ApiResponse(200, stats, "Dashboard stats retrieved successfully"));
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json(new ApiResponse(500, null, "Failed to retrieve dashboard stats"));
  }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
  try {
    const activities = await AuditLog.find()
      .populate("userId", "firstName lastName email")
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();

    const formattedActivities = activities.map(activity => ({
      _id: activity._id,
      type: activity.resource.toLowerCase().includes("student") ? "student" :
            activity.resource.toLowerCase().includes("faculty") ? "faculty" :
            activity.resource.toLowerCase().includes("query") ? "query" : "system",
      description: `${activity.userId?.firstName} ${activity.userId?.lastName} ${activity.action.toLowerCase()}d ${activity.resource}`,
      timestamp: activity.timestamp
    }));

    res.status(200).json(new ApiResponse(200, formattedActivities, "Recent activity retrieved successfully"));
  } catch (error) {
    console.error("Recent activity error:", error);
    res.status(500).json(new ApiResponse(500, null, "Failed to retrieve recent activity"));
  }
};

// Get attendance trends
const getAttendanceTrends = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const now = new Date();

    let dateRange;
    switch (period) {
      case "week":
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        dateRange = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case "quarter":
        dateRange = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case "year":
        dateRange = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        dateRange = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }

    const trends = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
          },
          lateCount: {
            $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          date: "$_id",
          percentage: {
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
      { $sort: { date: 1 } }
    ]);

    res.status(200).json(new ApiResponse(200, trends, "Attendance trends retrieved successfully"));
  } catch (error) {
    console.error("Attendance trends error:", error);
    res.status(500).json(new ApiResponse(500, null, "Failed to retrieve attendance trends"));
  }
};

// Export dashboard report
const exportDashboardReport = async (req, res) => {
  try {
    // This would typically generate a PDF report
    // For now, we'll return a simple JSON response
    const reportData = {
      generatedAt: new Date(),
      reportType: "Dashboard Analytics",
      data: {
        // Include all the dashboard data here
      }
    };

    res.status(200).json(new ApiResponse(200, reportData, "Report generated successfully"));
  } catch (error) {
    console.error("Export report error:", error);
    res.status(500).json(new ApiResponse(500, null, "Failed to export report"));
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getAttendanceTrends,
  exportDashboardReport
};
