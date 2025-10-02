import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import MentorshipManagement from "./MentorshipManagement";
import {
  FiUsers,
  FiBookOpen,
  FiClipboard,
  FiSettings,
  FiBarChart3,
  FiShield,
  FiMessageSquare,
  FiCalendar,
  FiFileText,
  FiUserCheck,
  FiUserPlus
} from "react-icons/fi";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    if (activeTab === "overview") {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await axiosWrapper.get("/admin-dashboard/stats", {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setStats(response.data.data || {});
    } catch (error) {
      toast.error("Failed to load statistics");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart3 },
    { id: "students", label: "Students", icon: FiUsers },
    { id: "faculty", label: "Faculty", icon: FiBookOpen },
    { id: "subjects", label: "Subjects", icon: FiClipboard },
    { id: "mentorship", label: "Mentorship", icon: FiUserPlus },
    { id: "attendance", label: "Attendance", icon: FiUserCheck },
    { id: "queries", label: "Queries", icon: FiMessageSquare },
    { id: "timetable", label: "Timetable", icon: FiCalendar },
    { id: "materials", label: "Materials", icon: FiFileText },
    { id: "audit", label: "Audit Logs", icon: FiShield },
    { id: "settings", label: "Settings", icon: FiSettings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalStudents || 0}</p>
            </div>
            <FiUsers className="text-blue-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Faculty</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalFaculty || 0}</p>
            </div>
            <FiBookOpen className="text-green-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Subjects</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalSubjects || 0}</p>
            </div>
            <FiClipboard className="text-purple-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Attendance</p>
              <p className="text-3xl font-bold text-orange-600">{stats.averageAttendance || 0}%</p>
            </div>
            <FiUserCheck className="text-orange-600 text-3xl" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomButton
            onClick={() => setActiveTab("students")}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiUsers className="text-lg" />
            Manage Students
          </CustomButton>
          <CustomButton
            onClick={() => setActiveTab("faculty")}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiBookOpen className="text-lg" />
            Manage Faculty
          </CustomButton>
          <CustomButton
            onClick={() => setActiveTab("subjects")}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiClipboard className="text-lg" />
            Manage Subjects
          </CustomButton>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
        <CustomButton className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Add New Student
        </CustomButton>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Student management features will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Add, Edit, Delete students, View profiles, Manage enrollments</p>
      </div>
    </div>
  );

  const renderFaculty = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Faculty Management</h2>
        <CustomButton className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          Add New Faculty
        </CustomButton>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Faculty management features will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Add, Edit, Delete faculty, Assign subjects, View profiles</p>
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Subject Management</h2>
        <CustomButton className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
          Add New Subject
        </CustomButton>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Subject management features will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Create subjects, Assign to faculty, Manage curriculum</p>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Advanced attendance management features.</p>
        <p className="text-sm text-gray-500 mt-2">Features: View reports, Export data, Monitor trends, Bulk operations</p>
      </div>
    </div>
  );

  const renderQueries = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Query Management</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Student query management and monitoring.</p>
        <p className="text-sm text-gray-500 mt-2">Features: View all queries, Monitor responses, Generate reports</p>
      </div>
    </div>
  );

  const renderTimetable = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Timetable Management</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Class schedule and timetable management.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Create schedules, Assign classrooms, Conflict resolution</p>
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Study Materials</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Course materials and resources management.</p>
        <p className="text-sm text-gray-500 mt-2">Features: Upload materials, Organize by subject, Access control</p>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Audit Logs</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">System activity monitoring and audit trails.</p>
        <p className="text-sm text-gray-500 mt-2">Features: View logs, Search activities, Export reports, Security monitoring</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">System configuration and settings management.</p>
        <p className="text-sm text-gray-500 mt-2">Features: User roles, Permissions, System preferences, Backup settings</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return renderOverview();
      case "students": return renderStudents();
      case "faculty": return renderFaculty();
      case "subjects": return renderSubjects();
      case "mentorship": return <MentorshipManagement />;
      case "attendance": return renderAttendance();
      case "queries": return renderQueries();
      case "timetable": return renderTimetable();
      case "materials": return renderMaterials();
      case "audit": return renderAudit();
      case "settings": return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-center" />

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
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

export default AdminPanel;
