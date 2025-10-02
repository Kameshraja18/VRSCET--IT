import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import { FiCalendar, FiTrendingUp, FiTrendingDown, FiBarChart3 } from "react-icons/fi";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [subjectFilter, setSubjectFilter] = useState("all");

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, subjectFilter]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const response = await axiosWrapper.get(
        `/attendance/student?month=${selectedMonth}&subject=${subjectFilter}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      const data = response.data.data || [];
      setAttendance(data);

      // Calculate stats
      const totalClasses = data.length;
      const presentCount = data.filter(record => record.status === "present").length;
      const absentCount = data.filter(record => record.status === "absent").length;
      const lateCount = data.filter(record => record.status === "late").length;

      const attendancePercentage = totalClasses > 0 ? ((presentCount + lateCount * 0.5) / totalClasses * 100).toFixed(1) : 0;

      setStats({
        totalClasses,
        presentCount,
        absentCount,
        lateCount,
        attendancePercentage: parseFloat(attendancePercentage)
      });
    } catch (error) {
      toast.error("Failed to load attendance");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800";
      case "absent": return "bg-red-100 text-red-800";
      case "late": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present": return "✓";
      case "absent": return "✗";
      case "late": return "●";
      default: return "?";
    }
  };

  const getUniqueSubjects = () => {
    const subjects = [...new Set(attendance.map(record => record.subjectId?.name).filter(Boolean))];
    return subjects;
  };

  const filteredAttendance = attendance.filter(record => {
    if (subjectFilter === "all") return true;
    return record.subjectId?.name === subjectFilter;
  });

  return (
    <div className="p-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Attendance</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-600" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Subjects</option>
            {getUniqueSubjects().map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClasses}</p>
            </div>
            <FiBarChart3 className="text-blue-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.presentCount}</p>
            </div>
            <FiTrendingUp className="text-green-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absentCount}</p>
            </div>
            <FiTrendingDown className="text-red-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance %</p>
              <p className={`text-2xl font-bold ${stats.attendancePercentage >= 75 ? 'text-green-600' : stats.attendancePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {stats.attendancePercentage}%
              </p>
            </div>
            <div className={`text-2xl ${stats.attendancePercentage >= 75 ? 'text-green-600' : stats.attendancePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {stats.attendancePercentage >= 75 ? "↑" : stats.attendancePercentage >= 60 ? "→" : "↓"}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Attendance Records ({filteredAttendance.length})</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading attendance records...</p>
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiCalendar className="mx-auto h-12 w-12 mb-4" />
            <p>No attendance records found</p>
            <p className="text-sm">No classes recorded for the selected period</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAttendance.map((record) => (
              <div key={record._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      record.status === "present" ? "bg-green-500" :
                      record.status === "absent" ? "bg-red-500" : "bg-yellow-500"
                    }`}>
                      {getStatusIcon(record.status)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {record.subjectId?.name || "Unknown Subject"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {record.subjectId?.code || ""} - {record.facultyId?.firstName} {record.facultyId?.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Summary */}
      {stats.totalClasses > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.attendancePercentage}%</div>
              <p className="text-sm text-gray-600">Overall Attendance</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.presentCount}</div>
              <p className="text-sm text-gray-600">Days Present</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.absentCount}</div>
              <p className="text-sm text-gray-600">Days Absent</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Attendance Progress</span>
              <span>{stats.attendancePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  stats.attendancePercentage >= 75 ? 'bg-green-500' :
                  stats.attendancePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(stats.attendancePercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>75% (Good)</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
