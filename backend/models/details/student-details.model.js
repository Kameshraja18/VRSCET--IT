const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const studentDetailsSchema = new mongoose.Schema(
  {
    enrollmentNo: {
      type: Number,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: false,
      default: "",
    },
    lastName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
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
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    dob: {
      type: Date,
      required: true,
    },
    aadhaar: {
      type: String,
      required: true,
    },
    emis: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    primaryAddress: {
      type: String,
      required: true,
    },
    communicationAddress: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    tenthMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    twelfthMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    engineeringCutoff: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    tneaId: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    registerNumber: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

studentDetailsSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

const studentDetails = mongoose.model("StudentDetail", studentDetailsSchema);

module.exports = studentDetails;
