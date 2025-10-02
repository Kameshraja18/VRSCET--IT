import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import { FiCalendar, FiCheck, FiX, FiSave, FiUsers } from "react-icons/fi";

const FacultyAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
      fetchAttendanceRecords();
    }
  }, [selectedSubject, selectedDate]);

  const fetchSubjects = async () => {
    try {
      const response = await axiosWrapper.get("/subject/faculty", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setSubjects(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedSubject(response.data.data[0]._id);
      }
    } catch (error) {
      toast.error("Failed to load subjects");
      console.error(error);
    }
  };

  const fetchStudents = async () => {
    if (!selectedSubject) return;

    try {
      const response = await axiosWrapper.get(`/student-assignment/subject/${selectedSubject}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      const studentList = response.data.data || [];
      setStudents(studentList);

      // Initialize attendance state
      const initialAttendance = {};
      studentList.forEach(student => {
        initialAttendance[student.studentId._id] = "present";
      });
      setAttendance(initialAttendance);
    } catch (error) {
      toast.error("Failed to load students");
      console.error(error);
    }
  };

  const fetchAttendanceRecords = async () => {
    if (!selectedSubject) return;

    try {
      const response = await axiosWrapper.get(
        `/attendance/subject/${selectedSubject}?date=${selectedDate}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      const records = response.data.data || [];
      setAttendanceRecords(records);

      // Update attendance state with existing records
      const existingAttendance = {};
      records.forEach(record => {
        existingAttendance[record.studentId._id] = record.status;
      });
      setAttendance(prev => ({ ...prev, ...existingAttendance }));
    } catch (error) {
      console.error("Failed to load attendance records:", error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllPresent = () => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.studentId._id] = "present";
    });
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.studentId._id] = "absent";
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    if (!selectedSubject || !selectedDate) {
      toast.error("Please select subject and date");
      return;
    }

    setIsLoading(true);
    try {
      const attendanceData = students.map(student => ({
        studentId: student.studentId._id,
        subjectId: selectedSubject,
        date: selectedDate,
        status: attendance[student.studentId._id] || "absent"
      }));

      const response = await axiosWrapper.post("/attendance/bulk", {
        attendanceData
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      if (response.data.success) {
        toast.success("Attendance marked successfully");
        fetchAttendanceRecords();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
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

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Object.values(attendance).filter(status => status === "present").length;
    const absent = Object.values(attendance).filter(status => status === "absent").length;
    const late = Object.values(attendance).filter(status => status === "late").length;

    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
    <div className="p-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mark Attendance</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <FiUsers className="text-blue-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
            <FiCheck className="text-green-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
            <FiX className="text-red-600 text-2xl" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
            </div>
            <FiCalendar className="text-yellow-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-2">
          <CustomButton
            onClick={markAllPresent}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiCheck className="text-sm" />
            Mark All Present
          </CustomButton>
          <CustomButton
            onClick={markAllAbsent}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiX className="text-sm" />
            Mark All Absent
          </CustomButton>
          <CustomButton
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <FiSave className="text-sm" />
            {isLoading ? "Saving..." : "Save Attendance"}
          </CustomButton>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Students ({students.length})</h3>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiUsers className="mx-auto h-12 w-12 mb-4" />
            <p>No students assigned to this subject</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {students.map((assignment, index) => (
              <div key={assignment.studentId._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {assignment.studentId.firstName} {assignment.studentId.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{assignment.studentId.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={attendance[assignment.studentId._id] || "present"}
                      onChange={(e) => handleAttendanceChange(assignment.studentId._id, e.target.value)}
                      className={`px-3 py-1 border rounded-lg text-sm font-medium ${getStatusColor(attendance[assignment.studentId._id] || "present")}`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance History */}
      {attendanceRecords.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Today's Records ({attendanceRecords.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {attendanceRecords.map((record) => (
              <div key={record._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {record.studentId.firstName} {record.studentId.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{record.studentId.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAttendance;
