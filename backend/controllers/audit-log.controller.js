const AuditLog = require("../models/audit-log.model");
const ApiResponse = require("../utils/ApiResponse");

const createAuditLog = async (userId, userModel, action, resource, resourceId, description, req, status = "SUCCESS", metadata = {}) => {
  try {
    const auditLog = new AuditLog({
      userId,
      userModel,
      action,
      resource,
      resourceId,
      description,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get?.("User-Agent"),
      metadata,
      status,
    });

    await auditLog.save();
  } catch (error) {
    console.error("Audit Log Error:", error);
  }
};

const getAuditLogsController = async (req, res) => {
  try {
    const {
      userId,
      action,
      resource,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    let query = {};

    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (status) query.status = status;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const auditLogs = await AuditLog.find(query)
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    const result = {
      auditLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRecords: total,
        hasNext: parseInt(page) * parseInt(limit) < total,
        hasPrev: parseInt(page) > 1,
      },
    };

    return ApiResponse.success(result, "Audit logs retrieved successfully").send(res);
  } catch (error) {
    console.error("Get Audit Logs Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getAuditLogStatsController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get action statistics
    const actionStats = await AuditLog.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$action", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get resource statistics
    const resourceStats = await AuditLog.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$resource", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get status statistics
    const statusStats = await AuditLog.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Get daily activity for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyActivity = await AuditLog.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          ...dateFilter.createdAt
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const stats = {
      actionStats,
      resourceStats,
      statusStats,
      dailyActivity,
      totalLogs: await AuditLog.countDocuments(dateFilter),
    };

    return ApiResponse.success(stats, "Audit log statistics retrieved successfully").send(res);
  } catch (error) {
    console.error("Get Audit Log Stats Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const deleteOldAuditLogsController = async (req, res) => {
  try {
    const { daysOld = 90 } = req.body; // Default to 90 days

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysOld));

    const result = await AuditLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    return ApiResponse.success(
      { deletedCount: result.deletedCount },
      `${result.deletedCount} old audit logs deleted successfully`
    ).send(res);
  } catch (error) {
    console.error("Delete Old Audit Logs Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

module.exports = {
  createAuditLog,
  getAuditLogsController,
  getAuditLogStatsController,
  deleteOldAuditLogsController,
};
