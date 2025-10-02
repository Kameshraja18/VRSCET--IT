import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import {
  FiUsers,
  FiBookOpen,
  FiClipboard,
  FiMessageSquare,
  FiCalendar,
  FiFileText,
  FiUserCheck,
  FiBarChart3,
  FiUserPlus
} from "react-icons/fi";

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    if (activeTab === "overview") {
      fetchFacultyData();
    }
  }, [activeTab]);

  const fetchFacultyData = async () => {
    setIsLoading(true);
    try {
      const [subjectsRes] = await Promise.all([
        axiosWrapper.get("/subject/faculty", { headers: { Authorization: `Bearer ${userToken}` } })
      ]);

      setSubjects(subjectsRes.data.data || []);

      // Calculate basic stats
      const totalSubjects = subjectsRes.data.data?.length || 0;
      setStats({
        totalSubjects,
        // Add more stats as needed
      });
    } catch (error) {
      toast.error("Failed to load faculty data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart3 },
    { id: "subjects", label: "My Subjects", icon: FiBookOpen },
    { id: "attendance", label: "Attendance", icon: FiUserCheck },
    { id: "students", label: "Students", icon: FiUsers },
    { id: "mentorship", label: "My Mentees", icon: FiUserPlus },
    { id: "queries", label: "Student Queries", icon: FiMessageSquare },
    { id: "materials", label: "Materials", icon: FiFileText },
    { id: "timetable", label: "Timetable", icon: FiCalendar }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Faculty Dashboard</h2>

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
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <FiUsers className="text-green-600 text-3xl" />
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
            Mark Attendance
          </CustomButton>
          <CustomButton
            onClick={() => setActiveTab("queries")}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiMessageSquare className="text-lg" />
            View Queries
          </CustomButton>
          <CustomButton
            onClick={() => setActiveTab("materials")}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiFileText className="text-lg" />
            Upload Materials
          </CustomButton>
        </div>
      </div>

      {/* My Subjects */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">My Subjects</h3>
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <div key={subject._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <h4 className="font-medium text-gray-900">{subject.name}</h4>
                <p className="text-sm text-gray-600">Code: {subject.code}</p>
                <p className="text-sm text-gray-600">Semester: {subject.semester}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No subjects assigned yet.</p>
        )}
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Subjects</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {subjects.length > 0 ? (
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
                    <p className="text-sm text-gray-600">Code: {subject.code}</p>
                    <p className="text-sm text-gray-600">Semester: {subject.semester}</p>
                    <p className="text-sm text-gray-600">Branch: {subject.branchId?.name || 'N/A'}</p>
                  </div>
                  <div className="flex gap-2">
                    <CustomButton
                      onClick={() => setActiveTab("attendance")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm"
                    >
                      Mark Attendance
                    </CustomButton>
                    <CustomButton
                      onClick={() => setActiveTab("students")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                    >
                      View Students
                    </CustomButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No subjects assigned to you.</p>
        )}
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Mark attendance for your classes.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Bulk marking, Date selection, Student list, Export reports</p>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Students</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">View and manage students in your classes.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Student profiles, Contact info, Performance tracking</p>
      </div>
    </div>
  );

  const renderQueries = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Student Queries</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Respond to student questions and concerns.</p>
        <p className="text-sm text-gray-500 mt-2">Features: View queries, Send responses, File attachments, Query history</p>
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Study Materials</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Upload and manage course materials.</p>
        <p className="text-sm text-gray-500 mt-2">Features: File uploads, Organize by subject, Student access</p>
      </div>
    </div>
  );

  const renderTimetable = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Timetable</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">View your class schedule and timetable.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Weekly schedule, Class details, Room assignments</p>
      </div>
    </div>
  );

  const renderMentorship = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Mentees</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">View and manage your assigned mentees for student growth and development.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Mentee profiles, Progress tracking, Meeting records, Goal setting</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return renderOverview();
      case "subjects": return renderSubjects();
      case "attendance": return renderAttendance();
      case "students": return renderStudents();
      case "mentorship": return renderMentorship();
      case "queries": return renderQueries();
      case "materials": return renderMaterials();
      case "timetable": return renderTimetable();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-center" />

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Faculty Portal</h1>
        </div>

        <nav className="mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 ${
                  activeTab === tab.id ? "bg-green-50 border-r-4 border-green-600 text-green-600" : "text-gray-700"
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

export default FacultyDashboard;
