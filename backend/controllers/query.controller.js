const Query = require("../models/query.model");
const StudentDetails = require("../models/details/student-details.model");
const FacultyDetails = require("../models/details/faculty-details.model");
const ApiResponse = require("../utils/ApiResponse");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "media/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

const submitQueryController = async (req, res) => {
  try {
    const { facultyId, subject, message, priority = "medium" } = req.body;
    const studentId = req.userId;

    if (!facultyId || !subject || !message) {
      return ApiResponse.badRequest("Faculty ID, subject, and message are required").send(res);
    }

    // Check if student exists
    const student = await StudentDetails.findById(studentId);
    if (!student) {
      return ApiResponse.notFound("Student not found").send(res);
    }

    // Check if faculty exists
    const faculty = await FacultyDetails.findById(facultyId);
    if (!faculty) {
      return ApiResponse.notFound("Faculty not found").send(res);
    }

    // Handle file attachments
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
      }));
    }

    const query = await Query.create({
      studentId,
      facultyId,
      subject,
      message,
      priority,
      attachments,
    });

    const populatedQuery = await Query.findById(query._id)
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName email");

    return ApiResponse.created(populatedQuery, "Query submitted successfully").send(res);
  } catch (error) {
    console.error("Submit Query Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getStudentQueriesController = async (req, res) => {
  try {
    const studentId = req.userId;
    const { status, facultyId } = req.query;

    let query = { studentId };
    if (status) query.status = status;
    if (facultyId) query.facultyId = facultyId;

    const queries = await Query.find(query)
      .populate("facultyId", "firstName lastName email")
      .sort({ createdAt: -1 });

    return ApiResponse.success(queries, "Student queries retrieved successfully").send(res);
  } catch (error) {
    console.error("Get Student Queries Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const getFacultyQueriesController = async (req, res) => {
  try {
    const facultyId = req.userId;
    const { status, studentId, priority } = req.query;

    let query = { facultyId };
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;
    if (priority) query.priority = priority;

    const queries = await Query.find(query)
      .populate("studentId", "firstName lastName enrollmentNo email phone")
      .sort({ createdAt: -1 });

    return ApiResponse.success(queries, "Faculty queries retrieved successfully").send(res);
  } catch (error) {
    console.error("Get Faculty Queries Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const respondToQueryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const facultyId = req.userId;

    if (!message) {
      return ApiResponse.badRequest("Response message is required").send(res);
    }

    const query = await Query.findOneAndUpdate(
      { _id: id, facultyId },
      {
        facultyResponse: {
          message,
          respondedAt: new Date(),
        },
        status: "answered",
        isReadByStudent: false,
      },
      { new: true }
    )
      .populate("studentId", "firstName lastName enrollmentNo email")
      .populate("facultyId", "firstName lastName email");

    if (!query) {
      return ApiResponse.notFound("Query not found or unauthorized").send(res);
    }

    return ApiResponse.success(query, "Query responded successfully").send(res);
  } catch (error) {
    console.error("Respond to Query Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const updateQueryStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    const query = await Query.findById(id);
    if (!query) {
      return ApiResponse.notFound("Query not found").send(res);
    }

    // Check if user is authorized to update this query
    if (query.studentId.toString() !== userId && query.facultyId.toString() !== userId) {
      return ApiResponse.forbidden("Unauthorized to update this query").send(res);
    }

    query.status = status;
    await query.save();

    const updatedQuery = await Query.findById(id)
      .populate("studentId", "firstName lastName enrollmentNo")
      .populate("facultyId", "firstName lastName email");

    return ApiResponse.success(updatedQuery, "Query status updated successfully").send(res);
  } catch (error) {
    console.error("Update Query Status Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

const markQueryAsReadController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const query = await Query.findById(id);
    if (!query) {
      return ApiResponse.notFound("Query not found").send(res);
    }

    // Update read status based on user type
    if (query.studentId.toString() === userId) {
      query.isReadByStudent = true;
    } else if (query.facultyId.toString() === userId) {
      query.isReadByFaculty = true;
    } else {
      return ApiResponse.forbidden("Unauthorized to mark this query as read").send(res);
    }

    await query.save();

    return ApiResponse.success(null, "Query marked as read").send(res);
  } catch (error) {
    console.error("Mark Query Read Error: ", error);
    return ApiResponse.internalServerError().send(res);
  }
};

module.exports = {
  submitQueryController,
  getStudentQueriesController,
  getFacultyQueriesController,
  respondToQueryController,
  updateQueryStatusController,
  markQueryAsReadController,
  upload: upload.array("attachments", 5), // Allow up to 5 files
};
