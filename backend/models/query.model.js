const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
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
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "answered", "closed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    facultyResponse: {
      message: String,
      respondedAt: Date,
    },
    attachments: [{
      filename: String,
      originalName: String,
      path: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    isReadByStudent: {
      type: Boolean,
      default: false,
    },
    isReadByFaculty: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
querySchema.index({ studentId: 1, createdAt: -1 });
querySchema.index({ facultyId: 1, createdAt: -1 });
querySchema.index({ status: 1 });

module.exports = mongoose.model("Query", querySchema);
