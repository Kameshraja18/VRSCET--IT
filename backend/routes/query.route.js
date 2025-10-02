const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const { requireStudent, requireFaculty, requireAdmin } = require("../middlewares/role.middleware");
const {
  submitQueryController,
  getStudentQueriesController,
  getFacultyQueriesController,
  respondToQueryController,
  updateQueryStatusController,
  markQueryAsReadController,
  upload,
} = require("../controllers/query.controller");

// Student routes
router.post("/", auth, requireStudent, upload, submitQueryController);
router.get("/student", auth, requireStudent, getStudentQueriesController);
router.patch("/:id/read", auth, requireStudent, markQueryAsReadController);

// Faculty routes
router.get("/faculty", auth, requireFaculty, getFacultyQueriesController);
router.post("/:id/respond", auth, requireFaculty, respondToQueryController);

// Admin routes
router.patch("/:id/status", auth, requireAdmin, updateQueryStatusController);

module.exports = router;
