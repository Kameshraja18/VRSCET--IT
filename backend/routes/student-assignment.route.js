const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  assignStudentToFacultyController,
  getStudentAssignmentsController,
  updateStudentAssignmentController,
  deleteStudentAssignmentController,
  getMyAssignedStudentsController,
} = require("../controllers/student-assignment.controller");

router.post("/", auth, assignStudentToFacultyController);
router.get("/", auth, getStudentAssignmentsController);
router.get("/my-students", auth, getMyAssignedStudentsController);
router.patch("/:id", auth, updateStudentAssignmentController);
router.delete("/:id", auth, deleteStudentAssignmentController);

module.exports = router;
