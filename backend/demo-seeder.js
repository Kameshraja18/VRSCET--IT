require("dotenv").config();
const connectToMongo = require("./database/db");
const mongoose = require("mongoose");

// Import models
const Branch = require("./models/branch.model");
const Subject = require("./models/subject.model");
const StudentDetails = require("./models/details/student-details.model");
const FacultyDetails = require("./models/details/faculty-details.model");
const Exam = require("./models/exam.model");
const Marks = require("./models/marks.model");
const Notice = require("./models/notice.model");
const Material = require("./models/material.model");
const Attendance = require("./models/attendance.model");
const Timetable = require("./models/timetable.model");

const seedDemoData = async () => {
  try {
    await connectToMongo();
    console.log("Connected to MongoDB\n");

    // Clear existing data
    console.log("Clearing existing data...");
    await Branch.deleteMany({});
    await Subject.deleteMany({});
    await StudentDetails.deleteMany({});
    await FacultyDetails.deleteMany({});
    await Exam.deleteMany({});
    await Marks.deleteMany({});
    await Notice.deleteMany({});
    await Material.deleteMany({});
    await Attendance.deleteMany({});
    await Timetable.deleteMany({});

    // ============ SEED BRANCHES ============
    console.log("Seeding Branches...");
    const branchesData = [
      { branchId: "CSE", name: "Computer Science & Engineering" },
      { branchId: "ECE", name: "Electronics & Communication Engineering" },
      { branchId: "MECH", name: "Mechanical Engineering" },
      { branchId: "CIVIL", name: "Civil Engineering" },
      { branchId: "EEE", name: "Electrical & Electronics Engineering" },
    ];
    const branches = await Branch.insertMany(branchesData);
    console.log(`✓ Added ${branches.length} branches`);

    // ============ SEED SUBJECTS ============
    console.log("Seeding Subjects...");
    const subjectsData = [
      {
        name: "Data Structures",
        code: "CS101",
        branch: branches[0]._id,
        semester: 1,
        credits: 4,
      },
      {
        name: "Database Management",
        code: "CS102",
        branch: branches[0]._id,
        semester: 2,
        credits: 4,
      },
      {
        name: "Web Development",
        code: "CS103",
        branch: branches[0]._id,
        semester: 3,
        credits: 3,
      },
      {
        name: "Circuits & Systems",
        code: "EC101",
        branch: branches[1]._id,
        semester: 1,
        credits: 4,
      },
      {
        name: "Digital Electronics",
        code: "EC102",
        branch: branches[1]._id,
        semester: 2,
        credits: 4,
      },
      {
        name: "Thermodynamics",
        code: "ME101",
        branch: branches[2]._id,
        semester: 1,
        credits: 4,
      },
      {
        name: "Fluid Mechanics",
        code: "ME102",
        branch: branches[2]._id,
        semester: 2,
        credits: 4,
      },
    ];
    const subjects = await Subject.insertMany(subjectsData);
    console.log(`✓ Added ${subjects.length} subjects`);

    // ============ SEED FACULTY ============
    console.log("Seeding Faculty...");
    const facultyData = [
      {
        employeeId: 201001,
        firstName: "Rajesh",
        middleName: "K",
        lastName: "Kumar",
        email: "rajesh@college.edu",
        phone: "9876543210",
        profile: "Faculty_201001.jpg",
        address: "123 Teacher Lane",
        city: "College City",
        state: "State",
        pincode: "123456",
        country: "India",
        gender: "male",
        dob: new Date("1985-05-15"),
        designation: "Assistant Professor",
        department: "Computer Science",
        joiningDate: new Date("2015-06-01"),
        salary: 45000,
        status: "active",
        qualifications: "M.Tech, B.Tech",
        experience: 8,
        emergencyContact: { name: "Priya Kumar", relationship: "Spouse", phone: "9876543211" },
        bloodGroup: "B+",
        password: "faculty123",
      },
      {
        employeeId: 201002,
        firstName: "Priya",
        middleName: "S",
        lastName: "Sharma",
        email: "priya@college.edu",
        phone: "9876543212",
        profile: "Faculty_201002.jpg",
        address: "456 Faculty Road",
        city: "College City",
        state: "State",
        pincode: "123457",
        country: "India",
        gender: "female",
        dob: new Date("1987-08-22"),
        designation: "Associate Professor",
        department: "Electronics",
        joiningDate: new Date("2014-07-15"),
        salary: 55000,
        status: "active",
        qualifications: "Ph.D, M.Tech",
        experience: 10,
        emergencyContact: { name: "Rajesh Sharma", relationship: "Spouse", phone: "9876543213" },
        bloodGroup: "O+",
        password: "faculty123",
      },
      {
        employeeId: 201003,
        firstName: "Vikram",
        middleName: "V",
        lastName: "Singh",
        email: "vikram@college.edu",
        phone: "9876543214",
        profile: "Faculty_201003.jpg",
        address: "789 Professor Lane",
        city: "College City",
        state: "State",
        pincode: "123458",
        country: "India",
        gender: "male",
        dob: new Date("1982-03-10"),
        designation: "Professor",
        department: "Mechanical",
        joiningDate: new Date("2010-01-01"),
        salary: 70000,
        status: "active",
        qualifications: "Ph.D",
        experience: 15,
        emergencyContact: { name: "Anjali Singh", relationship: "Wife", phone: "9876543215" },
        bloodGroup: "AB+",
        password: "faculty123",
      },
    ];
// Transform faculty data to match FacultyDetails schema requirements
    const facultyInsertData = facultyData.map((f) => ({
      facultyId: String(f.employeeId),
      branchId: branches[Math.floor(Math.random() * branches.length)]._id,
      age: new Date().getFullYear() - f.dob.getFullYear(),
      name: [f.firstName, f.middleName, f.lastName].filter(Boolean).join(' '),
      qualification: f.qualifications,
      employeeId: f.employeeId,
      firstName: f.firstName,
      middleName: f.middleName,
      lastName: f.lastName,
      email: f.email,
      phone: f.phone,
      profile: f.profile,
      address: f.address,
      city: f.city,
      state: f.state,
      pincode: f.pincode,
      country: f.country,
      gender: f.gender,
      dob: f.dob,
      designation: f.designation,
      joiningDate: f.joiningDate,
      salary: f.salary,
      experience: f.experience,
      status: f.status,
      emergencyContact: f.emergencyContact,
      bloodGroup: f.bloodGroup,
      password: f.password,
    }));
    const faculty = await FacultyDetails.insertMany(facultyInsertData);
    console.log(`✓ Added ${faculty.length} faculty members`);

    // ============ SEED STUDENTS ============
    console.log("Seeding Students...");
    const studentNames = [
      { first: "Aarav", last: "Patel", father: "Rajesh Patel" },
      { first: "Ananya", last: "Gupta", father: "Vikram Gupta" },
      { first: "Arjun", last: "Sharma", father: "Ajay Sharma" },
      { first: "Divya", last: "Singh", father: "Ravi Singh" },
      { first: "Esha", last: "Verma", father: "Sanjay Verma" },
      { first: "Hardik", last: "Desai", father: "Mahesh Desai" },
      { first: "Isha", last: "Nair", father: "Prakash Nair" },
      { first: "Jiya", last: "Reddy", father: "Suresh Reddy" },
      { first: "Kabir", last: "Khan", father: "Salman Khan" },
      { first: "Kriti", last: "Chopra", father: "Anil Chopra" },
    ];

    const studentsData = [];
    for (let i = 0; i < studentNames.length; i++) {
      studentsData.push({
        enrollmentNo: 1001 + i,
        firstName: studentNames[i].first,
        middleName: "",
        lastName: studentNames[i].last,
        fatherName: studentNames[i].father,
        email: `student${1001 + i}@college.edu`,
        phone: `912345678${i}0`,
        mobile: `919876543${i}10`,
        semester: Math.floor(Math.random() * 4) + 1,
        branchId: branches[Math.floor(Math.random() * branches.length)]._id,
        gender: Math.random() > 0.5 ? "male" : "female",
        dob: new Date(2004 - Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        aadhaar: `${String(Math.floor(Math.random() * 1000000000000)).padStart(12, "0")}`,
        emis: `E${String(1001 + i)}`,
        address: `${i + 1}00, Student Street`,
        primaryAddress: `${i + 1}00, Student Street`,
        communicationAddress: `${i + 1}00, Student Street`,
        city: "College City",
        state: "State",
        pincode: "123456",
        country: "India",
        bloodGroup: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"][Math.floor(Math.random() * 8)],
        category: ["General", "OBC", "SC", "ST"][Math.floor(Math.random() * 4)],
        caste: "General",
        religion: ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist"][Math.floor(Math.random() * 5)],
        motherTongue: "English",
        password: "student123",
        status: "active",
        year: Math.floor(Math.random() * 4) + 1,
        tenthMarks: Math.floor(Math.random() * 101),
        twelfthMarks: Math.floor(Math.random() * 101),
        engineeringCutoff: Math.floor(Math.random() * 201),
        tneaId: `TNEA${1001 + i}`,
        rollNumber: `RN${1001 + i}`,
        registerNumber: `REG${1001 + i}`,
      });
    }
    const students = await StudentDetails.insertMany(studentsData);
    console.log(`✓ Added ${students.length} students`);

    // ============ SEED EXAMS ============
    console.log("Seeding Exams...");
    const examsData = [
      {
        name: "Slip Test 1",
        date: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        semester: 1,
        examType: "slip test1",
        timetableLink: "https://college.edu/timetable/slip1.pdf",
        totalMarks: 20,
      },
      {
        name: "CA Test 1",
        date: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
        semester: 1,
        examType: "ca test 1",
        timetableLink: "https://college.edu/timetable/ca1.pdf",
        totalMarks: 50,
      },
      {
        name: "Model Exam",
        date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        semester: 1,
        examType: "model exam",
        timetableLink: "https://college.edu/timetable/model.pdf",
        totalMarks: 100,
      },
    ];
    const exams = await Exam.insertMany(examsData);
    console.log(`✓ Added ${exams.length} exams`);

    // ============ SEED MARKS ============
    console.log("Seeding Marks...");
    const marksData = [];
    for (let i = 0; i < students.length; i++) {
      for (let j = 0; j < exams.length; j++) {
        marksData.push({
          studentId: students[i]._id,
          subjectId: subjects[Math.floor(Math.random() * subjects.length)]._id,
          marksObtained: Math.floor(Math.random() * (exams[j].totalMarks - 5)) + 5,
          semester: students[i].semester,
          examId: exams[j]._id,
        });
      }
    }
    const marks = await Marks.insertMany(marksData);
    console.log(`✓ Added ${marks.length} mark records`);

    // ============ SEED NOTICES ============
    console.log("Seeding Notices...");
    const noticesData = [
      {
        title: "Exam Schedule Released",
        description:
          "The final exam schedule for Semester 1 has been released. Please check the timetable link for detailed information.",
        type: "both",
        link: "https://college.edu/exams/schedule.pdf",
        createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Library Extended Hours",
        description: "The library will now remain open until 10 PM on weekdays during the exam season.",
        type: "student",
        link: "",
        createdAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Faculty Seminar on AI",
        description: "A special seminar on Artificial Intelligence will be conducted on Friday at 3 PM in the auditorium.",
        type: "both",
        link: "https://college.edu/seminars/ai.html",
        createdAt: new Date(),
      },
      {
        title: "Scholarship Application Deadline",
        description: "Students from economically weaker sections can apply for college scholarships. Last date: 15th July.",
        type: "student",
        link: "https://college.edu/scholarship/apply",
        createdAt: new Date(),
      },
      {
        title: "Mid-sem Break Announced",
        description: "Mid-semester break will be from July 10-15. Classes will resume on July 16.",
        type: "both",
        link: "",
        createdAt: new Date(),
      },
    ];
    const notices = await Notice.insertMany(noticesData);
    console.log(`✓ Added ${notices.length} notices`);

    // ============ SEED MATERIALS ============
    console.log("Seeding Materials...");
    const materialsData = [
      {
        title: "Data Structures Basics",
        description: "Introduction to fundamental data structures including arrays, linked lists, and trees.",
        subject: subjects[0]._id,
        faculty: faculty[0]._id,
        file: "https://college.edu/materials/ds-basics.pdf",
        semester: 1,
        branch: branches[Math.floor(Math.random() * branches.length)]._id,
        type: "notes",
        uploadedAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Database Concepts",
        description: "Complete guide to relational databases and SQL queries.",
        subject: subjects[1]._id,
        faculty: faculty[0]._id,
        file: "https://college.edu/materials/db-concepts.pdf",
        semester: 2,
        branch: branches[Math.floor(Math.random() * branches.length)]._id,
        type: "notes",
        uploadedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Web Development Tutorial",
        description: "Learn HTML, CSS, JavaScript, and React from scratch.",
        subject: subjects[2]._id,
        faculty: faculty[0]._id,
        file: "https://college.edu/materials/web-dev.zip",
        semester: 3,
        branch: branches[Math.floor(Math.random() * branches.length)]._id,
        type: "assignment",
        uploadedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Circuits and Kirchhoff Laws",
        description: "Understanding basic electrical circuits and Kirchhoff's laws.",
        subject: subjects[3]._id,
        faculty: faculty[1]._id,
        file: "https://college.edu/materials/circuits.pdf",
        semester: 1,
        branch: branches[Math.floor(Math.random() * branches.length)]._id,
        type: "notes",
        uploadedAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    ];
    const materials = await Material.insertMany(materialsData);
    console.log(`✓ Added ${materials.length} materials`);

    // ============ SEED ATTENDANCE ============
    console.log("Seeding Attendance...");
    const attendanceData = [];
    for (let i = 0; i < 10; i++) {
      const startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
      for (let d = 0; d < 20; d++) {
        const date = new Date(startDate.getTime() + d * 24 * 60 * 60 * 1000);
        attendanceData.push({
          studentId: students[i]._id,
          facultyId: faculty[Math.floor(Math.random() * faculty.length)]._id,
          branchId: branches[Math.floor(Math.random() * branches.length)]._id,
          subjectId: subjects[Math.floor(Math.random() * subjects.length)]._id,
          date: date,
          status: Math.random() > 0.2 ? "present" : "absent",
          semester: students[i].semester,
          markedBy: faculty[Math.floor(Math.random() * faculty.length)]._id,
        });
      }
    }
    const attendance = await Attendance.insertMany(attendanceData);
    console.log(`✓ Added ${attendance.length} attendance records`);

    // ============ SEED TIMETABLE ============
    console.log("Seeding Timetable...");
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM"];
    const timetableData = [];

    for (let sem = 1; sem <= 2; sem++) {
      for (let day = 0; day < daysOfWeek.length; day++) {
        for (let slot = 0; slot < timeSlots.length; slot++) {
          timetableData.push({
            semester: sem,
            dayOfWeek: daysOfWeek[day],
            timeSlot: timeSlots[slot],
            subject: subjects[Math.floor(Math.random() * subjects.length)]._id,
            faculty: faculty[Math.floor(Math.random() * faculty.length)]._id,
            room: `Room ${Math.floor(Math.random() * 10) + 101}`,
          });
        }
      }
    }
    const timetables = await Timetable.insertMany(timetableData);
    console.log(`✓ Added ${timetables.length} timetable entries`);

    console.log("\n" + "=".repeat(50));
    console.log("✅ DEMO DATA SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\nTest Credentials:");
    console.log("─────────────────");
    console.log("ADMIN:");
    console.log("  Email: admin@gmail.com");
    console.log("  Password: admin123");
    console.log("\nFACULTY:");
    console.log("  Email: rajesh@college.edu (or priya@college.edu, vikram@college.edu)");
    console.log("  Password: faculty123");
    console.log("\nSTUDENT:");
    console.log("  Email: student1001@college.edu (or student1002-1010@college.edu)");
    console.log("  Password: student123");
    console.log("─────────────────\n");

  } catch (error) {
    console.error("❌ Error while seeding demo data:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDemoData();
