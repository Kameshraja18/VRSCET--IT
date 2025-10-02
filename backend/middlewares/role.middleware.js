const AdminDetails = require("../models/details/admin-details.model");
const StudentDetails = require("../models/details/student-details.model");
const FacultyDetails = require("../models/details/faculty-details.model");
const ApiResponse = require("../utils/ApiResponse");

// Middleware to check if user has required role
const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return ApiResponse.unauthorized("User not authenticated").send(res);
      }

      let userRole = null;
      let userData = null;

      // Check each role in order of priority
      if (allowedRoles.includes("admin")) {
        userData = await AdminDetails.findById(userId);
        if (userData) {
          userRole = "admin";
        }
      }

      if (!userRole && allowedRoles.includes("faculty")) {
        userData = await FacultyDetails.findById(userId);
        if (userData) {
          userRole = "faculty";
        }
      }

      if (!userRole && allowedRoles.includes("student")) {
        userData = await StudentDetails.findById(userId);
        if (userData) {
          userRole = "student";
        }
      }

      if (!userRole) {
        return ApiResponse.forbidden("Access denied. Insufficient privileges.").send(res);
      }

      // Attach user data to request
      req.user = {
        id: userId,
        role: userRole,
        data: userData
      };

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return ApiResponse.internalServerError("Authorization failed").send(res);
    }
  };
};

// Middleware to check if user is admin
const requireAdmin = authorizeRoles("admin");

// Middleware to check if user is faculty
const requireFaculty = authorizeRoles("faculty");

// Middleware to check if user is student
const requireStudent = authorizeRoles("student");

// Middleware to check if user is faculty or admin
const requireFacultyOrAdmin = authorizeRoles("faculty", "admin");

// Middleware to check if user is student or admin
const requireStudentOrAdmin = authorizeRoles("student", "admin");

// Middleware to allow any authenticated user
const requireAnyRole = authorizeRoles("admin", "faculty", "student");

module.exports = {
  authorizeRoles,
  requireAdmin,
  requireFaculty,
  requireStudent,
  requireFacultyOrAdmin,
  requireStudentOrAdmin,
  requireAnyRole
};
