const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentDetails",
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyDetails",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: true,
    },
    classType: {
      type: String,
      enum: ["lecture", "practical", "tutorial"],
      default: "lecture",
    },
    remarks: {
      type: String,
      trim: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyDetails",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique attendance record per student per subject per date
attendanceSchema.index(
  { studentId: 1, subjectId: 1, date: 1 },
  { unique: true }
);

// Additional indexes for better query performance
attendanceSchema.index({ facultyId: 1, date: -1 });
attendanceSchema.index({ studentId: 1, date: -1 });
attendanceSchema.index({ subjectId: 1, date: -1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
