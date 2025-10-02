const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const { requireFaculty, requireStudent, requireAdmin, requireFacultyOrAdmin } = require("../middlewares/role.middleware");
const {
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
} = require("../controllers/attendance.controller");

// Faculty only routes
router.post("/", auth, requireFaculty, markAttendanceController);
router.post("/bulk", auth, requireFaculty, bulkMarkAttendanceController);
router.patch("/:id", auth, requireFaculty, updateAttendanceController);
router.delete("/:id", auth, requireFaculty, deleteAttendanceController);

// Faculty and Admin routes
router.get("/trends", auth, requireFacultyOrAdmin, getSubjectAttendanceTrendsController);

// Student routes
router.get("/student", auth, requireStudent, getStudentAttendanceController);
router.get("/summary", auth, requireStudent, getStudentAttendanceSummaryController);

// Admin routes
router.get("/report", auth, requireAdmin, getAttendanceReportController);
router.get("/export", auth, requireAdmin, exportAttendanceController);

// General routes (authenticated users)
router.get("/", auth, getAttendanceController);

module.exports = router;
