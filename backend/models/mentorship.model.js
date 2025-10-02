const mongoose = require("mongoose");

const mentorshipSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentDetail",
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyDetail",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminDetail",
      required: true,
    },
    assignmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },
    notes: {
      type: String,
      default: "",
    },
    mentorshipGoals: [{
      goal: String,
      targetDate: Date,
      status: {
        type: String,
        enum: ["pending", "in_progress", "completed"],
        default: "pending"
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    meetings: [{
      date: Date,
      topic: String,
      notes: String,
      outcome: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    progressReports: [{
      reportDate: Date,
      academicProgress: String,
      behavioralProgress: String,
      concerns: String,
      recommendations: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

// Compound index to ensure unique active mentorship per student
mentorshipSchema.index({ studentId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: "active" } });

// Index for efficient queries
mentorshipSchema.index({ facultyId: 1, status: 1 });
mentorshipSchema.index({ assignedBy: 1 });

const Mentorship = mongoose.model("Mentorship", mentorshipSchema);

module.exports = Mentorship;
