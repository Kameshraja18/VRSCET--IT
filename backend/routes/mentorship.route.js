const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/mentorship.controller");
const { requireAdmin, requireFaculty, requireStudent } = require("../middlewares/role.middleware");

// Admin routes
router.post("/assign", requireAdmin, assignStudentsToMentor);
router.get("/all", requireAdmin, getAllMentorships);
router.put("/:mentorshipId/status", requireAdmin, updateMentorshipStatus);
router.put("/:mentorshipId/reassign", requireAdmin, reassignMentor);

// Faculty routes
router.get("/faculty/:facultyId?", requireFaculty, getFacultyMentorships);
router.post("/:mentorshipId/goal", requireFaculty, addMentorshipGoal);
router.put("/:mentorshipId/goal/:goalId", requireFaculty, updateMentorshipGoal);
router.post("/:mentorshipId/meeting", requireFaculty, addMeetingRecord);
router.post("/:mentorshipId/progress", requireFaculty, addProgressReport);

// Student routes
router.get("/student/:studentId?", requireStudent, getStudentMentorship);

// General routes (accessible by all authenticated users)
router.get("/", getAllMentorships);

module.exports = router;
