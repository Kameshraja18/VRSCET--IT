const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  getAuditLogsController,
  getAuditLogStatsController,
  deleteOldAuditLogsController,
} = require("../controllers/audit-log.controller");

// Get audit logs with advanced filtering
router.get("/", auth, getAuditLogsController);

// Get audit log statistics
router.get("/stats", auth, getAuditLogStatsController);

// Export audit logs to CSV
router.get("/export", auth, (req, res) => {
  // This would be implemented in the controller
  res.status(501).json({ message: "Export functionality not implemented yet" });
});

// Delete old audit logs (cleanup)
router.delete("/cleanup", auth, deleteOldAuditLogsController);

// Get specific audit log by ID
router.get("/:id", auth, (req, res) => {
  // This would be implemented in the controller
  res.status(501).json({ message: "Get by ID functionality not implemented yet" });
});

module.exports = router;
