const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  examType: {
    type: String,
    required: true,
    enum: ["slip test1", "slip test2", "ca test 1", "ca test 2", "model exam"],
  },
  timetableLink: {
    type: String,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Exam", examSchema);
