import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import {
  FiUsers,
  FiBookOpen,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart3,
  FiCalendar,
  FiMessageSquare,
  FiDownload
} from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, activityRes, attendanceRes] = await Promise.all([
        axiosWrapper.get("/admin-dashboard/stats", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/admin-dashboard/activity", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get(`/admin-dashboard/attendance-trends?period=${selectedPeriod}`, { headers: { Authorization: `Bearer ${userToken}` } }),
      ]);

      setStats(statsRes.data.data || {});
      setRecentActivity(activityRes.data.data || []);
      setAttendanceTrends(attendanceRes.data.data || []);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const response = await axiosWrapper.get("/admin-dashboard/export", {
        headers: { Authorization: `Bearer ${userToken}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report exported successfully");
    } catch (error) {
      toast.error("Failed to export report");
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className={`text-sm flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <FiTrendingUp className="text-xs" /> : <FiTrendingDown className="text-xs" />}
              {Math.abs(trend)}% from last {selectedPeriod}
            </p>
          )}
        </div>
        <Icon className={`text-3xl ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Analytics</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <CustomButton
            onClick={exportReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiDownload className="text-sm" />
            Export Report
          </CustomButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          icon={FiUsers}
          color="text-blue-600"
          trend={stats.studentTrend}
        />
        <StatCard
          title="Total Faculty"
          value={stats.totalFaculty || 0}
          icon={FiBookOpen}
          color="text-green-600"
          trend={stats.facultyTrend}
        />
        <StatCard
          title="Active Subjects"
          value={stats.totalSubjects || 0}
          icon={FiBarChart3}
          color="text-purple-600"
          trend={stats.subjectTrend}
        />
        <StatCard
          title="Avg Attendance"
          value={`${stats.averageAttendance || 0}%`}
          icon={FiTrendingUp}
          color="text-orange-600"
          trend={stats.attendanceTrend}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Attendance Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Attendance Trends</h3>
          {attendanceTrends.length > 0 ? (
            <div className="space-y-3">
              {attendanceTrends.slice(0, 7).map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{trend.date}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${trend.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{trend.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No attendance data available</p>
          )}
        </div>

        {/* Subject Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Subject-wise Attendance</h3>
          {stats.subjectAttendance && stats.subjectAttendance.length > 0 ? (
            <div className="space-y-3">
              {stats.subjectAttendance.slice(0, 5).map((subject, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{subject.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${subject.attendance}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{subject.attendance}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No subject data available</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading activity...</p>
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiCalendar className="mx-auto h-12 w-12 mb-4" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <div key={activity._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    activity.type === "student" ? "bg-blue-500" :
                    activity.type === "faculty" ? "bg-green-500" :
                    activity.type === "query" ? "bg-yellow-500" : "bg-purple-500"
                  }`}>
                    {activity.type === "student" ? <FiUsers className="text-sm" /> :
                     activity.type === "faculty" ? <FiBookOpen className="text-sm" /> :
                     activity.type === "query" ? <FiMessageSquare className="text-sm" /> :
                     <FiBarChart3 className="text-sm" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomButton
            onClick={() => window.location.href = '/admin/students'}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiUsers className="text-lg" />
            Manage Students
          </CustomButton>
          <CustomButton
            onClick={() => window.location.href = '/admin/faculty'}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiBookOpen className="text-lg" />
            Manage Faculty
          </CustomButton>
          <CustomButton
            onClick={() => window.location.href = '/admin/subjects'}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center gap-2"
          >
            <FiBarChart3 className="text-lg" />
            Manage Subjects
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
