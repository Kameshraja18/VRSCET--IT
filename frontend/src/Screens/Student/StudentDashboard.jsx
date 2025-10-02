import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import {
  FiBookOpen,
  FiUserCheck,
  FiMessageSquare,
  FiCalendar,
  FiFileText,
  FiBarChart3,
  FiClipboard,
  FiTrendingUp,
  FiUserPlus
} from "react-icons/fi";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    if (activeTab === "overview") {
      fetchStudentData();
    }
  }, [activeTab]);

  const fetchStudentData = async () => {
    setIsLoading(true);
    try {
      const [subjectsRes, attendanceRes] = await Promise.all([
        axiosWrapper.get("/student-assignment/student", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/attendance/summary", { headers: { Authorization: `Bearer ${userToken}` } })
      ]);

      setSubjects(subjectsRes.data.data || []);

      // Calculate basic stats
      const totalSubjects = subjectsRes.data.data?.length || 0;
      const attendanceData = attendanceRes.data.data || [];

      // Calculate overall attendance percentage
      let totalClasses = 0;
      let totalPresent = 0;

      attendanceData.forEach(subject => {
        totalClasses += subject.totalClasses;
        totalPresent += subject.presentCount + (subject.lateCount * 0.5);
      });

      const overallAttendance = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

      setStats({
        totalSubjects,
        overallAttendance,
        attendanceData
      });
    } catch (error) {
      toast.error("Failed to load student data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart3 },
    { id: "subjects", label: "My Subjects", icon: FiBookOpen },
    { id: "attendance", label: "Attendance", icon: FiUserCheck },
    { id: "mentorship", label: "My Mentor", icon: FiUserPlus },
    { id: "queries", label: "My Queries", icon: FiMessageSquare },
    { id: "materials", label: "Materials", icon: FiFileText },
    { id: "timetable", label: "Timetable", icon: FiCalendar },
    { id: "grades", label: "Grades", icon: FiTrendingUp }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Student Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">My Subjects</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalSubjects || 0}</p>
            </div>
            <FiBookOpen className="text-blue-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Attendance</p>
              <p className="text-3xl font-bold text-green-600">{stats.overallAttendance || 0}%</p>
            </div>
            <FiUserCheck className="text-green-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Queries</p>
              <p className="text-3xl font-bold text-orange-600">0</p>
            </div>
            <FiMessageSquare className="text-orange-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Classes</p>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
            <FiCalendar className="text-purple-600 text-3xl" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomButton
            onClick={() => setActiveTab("attendance")}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiUserCheck className="text-lg" />
            View Attendance
          </CustomButton>
          <CustomButton
            onClick={() => setActiveTab("queries")}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiMessageSquare className="text-lg" />
            Ask Questions
          </CustomButton>
          <CustomButton
            onClick={() => setActiveTab("materials")}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiFileText className="text-lg" />
            Study Materials
          </CustomButton>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Subject-wise Attendance</h3>
        {stats.attendanceData && stats.attendanceData.length > 0 ? (
          <div className="space-y-3">
            {stats.attendanceData.map((subject) => (
              <div key={subject.subjectName} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{subject.subjectName}</h4>
                  <p className="text-sm text-gray-600">{subject.totalClasses} classes</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{subject.attendancePercentage}%</p>
                  <p className="text-sm text-gray-600">
                    {subject.presentCount} present, {subject.absentCount} absent
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No attendance data available.</p>
        )}
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Subjects</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((assignment) => (
              <div key={assignment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">{assignment.subjectId?.name}</h3>
                <p className="text-sm text-gray-600">Code: {assignment.subjectId?.code}</p>
                <p className="text-sm text-gray-600">Faculty: {assignment.facultyId?.firstName} {assignment.facultyId?.lastName}</p>
                <p className="text-sm text-gray-600">Semester: {assignment.subjectId?.semester}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No subjects assigned yet.</p>
        )}
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Attendance</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">View your attendance records and statistics.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Monthly view, Subject breakdown, Trends, Reports</p>
      </div>
    </div>
  );

  const renderQueries = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Queries</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Ask questions to your faculty and track responses.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Submit queries, File attachments, Response tracking, Query history</p>
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Study Materials</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Access course materials and resources from your faculty.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Download materials, Subject-wise organization, Search functionality</p>
      </div>
    </div>
  );

  const renderTimetable = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Timetable</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">View your class schedule and timetable.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Weekly schedule, Class details, Room assignments, Reminders</p>
      </div>
    </div>
  );

  const renderGrades = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Grades</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">View your academic performance and grades.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Grade reports, GPA calculation, Subject-wise breakdown, Progress tracking</p>
      </div>
    </div>
  );

  const renderMentorship = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Mentor</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">View your assigned mentor and track your growth progress.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Mentor contact info, Meeting schedule, Progress goals, Growth tracking</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return renderOverview();
      case "subjects": return renderSubjects();
      case "attendance": return renderAttendance();
      case "mentorship": return renderMentorship();
      case "queries": return renderQueries();
      case "materials": return renderMaterials();
      case "timetable": return renderTimetable();
      case "grades": return renderGrades();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-center" />

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
        </div>

        <nav className="mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 ${
                  activeTab === tab.id ? "bg-blue-50 border-r-4 border-blue-600 text-blue-600" : "text-gray-700"
                }`}
              >
                <Icon className="mr-3 text-lg" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
