const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      required: true,
      enum: ["StudentDetails", "FacultyDetails", "AdminDetails"],
    },
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGOUT",
        "CREATE",
        "UPDATE",
        "DELETE",
        "VIEW",
        "EXPORT",
        "UPLOAD",
        "ASSIGN",
        "MARK_ATTENDANCE",
        "SUBMIT_QUERY",
        "RESPOND_QUERY",
        "CHANGE_PASSWORD",
        "RESET_PASSWORD",
      ],
    },
    resource: {
      type: String,
      required: true,
      enum: [
        "USER",
        "STUDENT",
        "FACULTY",
        "ADMIN",
        "SUBJECT",
        "BRANCH",
        "NOTICE",
        "MATERIAL",
        "EXAM",
        "MARKS",
        "ATTENDANCE",
        "QUERY",
        "TIMETABLE",
        "ASSIGNMENT",
      ],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "WARNING"],
      default: "SUCCESS",
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
