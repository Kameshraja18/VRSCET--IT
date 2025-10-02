const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getRecentActivity,
  getAttendanceTrends,
  exportDashboardReport
} = require("../controllers/admin-dashboard.controller");
const auth = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/role.middleware");

// All routes require authentication and admin role
router.use(auth);
router.use(requireAdmin);

// Dashboard routes
router.get("/stats", getDashboardStats);
router.get("/activity", getRecentActivity);
router.get("/attendance-trends", getAttendanceTrends);
router.get("/export", exportDashboardReport);

module.exports = router;
