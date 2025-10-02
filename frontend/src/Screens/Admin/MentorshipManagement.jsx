import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import {
  FiUserPlus,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter
} from "react-icons/fi";

const MentorshipManagement = () => {
  const [activeTab, setActiveTab] = useState("assign");
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, facultyRes, mentorshipsRes] = await Promise.all([
        axiosWrapper.get("/student", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/faculty", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/mentorship/all", { headers: { Authorization: `Bearer ${userToken}` } })
      ]);

      setStudents(studentsRes.data.data || []);
      setFaculty(facultyRes.data.data || []);
      setMentorships(mentorshipsRes.data.data || []);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignStudents = async () => {
    if (!selectedFaculty || selectedStudents.length === 0) {
      toast.error("Please select a faculty and at least one student");
      return;
    }

    try {
      const response = await axiosWrapper.post("/mentorship/assign", {
        facultyId: selectedFaculty,
        studentIds: selectedStudents
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      toast.success("Students assigned to mentor successfully");
      setSelectedStudents([]);
      setSelectedFaculty("");
      setShowAssignModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign students");
      console.error(error);
    }
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    const filteredStudents = students.filter(student =>
      !mentorships.some(m => m.studentId._id === student._id && m.status === "active")
    );
    setSelectedStudents(filteredStudents.map(s => s._id));
  };

  const getAvailableStudents = () => {
    return students.filter(student =>
      !mentorships.some(m => m.studentId._id === student._id && m.status === "active")
    );
  };

  const getMentoredStudents = () => {
    return mentorships.filter(m => m.status === "active");
  };

  const tabs = [
    { id: "assign", label: "Assign Students", icon: FiUserPlus },
    { id: "manage", label: "Manage Assignments", icon: FiUsers },
    { id: "overview", label: "Overview", icon: FiUserCheck }
  ];

  const renderAssignStudents = () => {
    const availableStudents = getAvailableStudents();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Assign Students to Mentors</h2>
          <CustomButton
            onClick={() => setShowAssignModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiUserPlus className="text-lg" />
            Assign Students
          </CustomButton>
        </div>

        {/* Faculty Selection */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Select Faculty Mentor</h3>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a faculty member...</option>
            {faculty.filter(f => f.status === "active").map(facultyMember => (
              <option key={facultyMember._id} value={facultyMember._id}>
                {facultyMember.firstName} {facultyMember.lastName} - {facultyMember.designation}
              </option>
            ))}
          </select>
        </div>

        {/* Available Students */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Available Students ({availableStudents.length})</h3>
            <CustomButton
              onClick={handleSelectAllStudents}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              Select All
            </CustomButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableStudents.map(student => (
              <div
                key={student._id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedStudents.includes(student._id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleStudentSelection(student._id)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => handleStudentSelection(student._id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">Enroll: {student.enrollmentNo}</p>
                    <p className="text-sm text-gray-600">Sem: {student.semester}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {availableStudents.length === 0 && (
            <p className="text-gray-600 text-center py-8">All students are already assigned to mentors.</p>
          )}
        </div>

        {/* Selected Students Summary */}
        {selectedStudents.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Selected Students ({selectedStudents.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedStudents.map(studentId => {
                const student = students.find(s => s._id === studentId);
                return (
                  <span
                    key={studentId}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {student?.firstName} {student?.lastName}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderManageAssignments = () => {
    const mentoredStudents = getMentoredStudents();

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Mentorship Assignments</h2>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Current Assignments ({mentoredStudents.length})</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {mentoredStudents
              .filter(m =>
                m.studentId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.studentId.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.facultyId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.facultyId.lastName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(mentorship => (
                <div key={mentorship._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {mentorship.studentId.firstName} {mentorship.studentId.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">Enroll: {mentorship.studentId.enrollmentNo}</p>
                      <p className="text-sm text-gray-600">
                        Mentor: {mentorship.facultyId.firstName} {mentorship.facultyId.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Assigned: {new Date(mentorship.assignmentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <CustomButton
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => {/* Handle view details */}}
                      >
                        View Details
                      </CustomButton>
                      <CustomButton
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => {/* Handle reassign */}}
                      >
                        Reassign
                      </CustomButton>
                      <CustomButton
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => {/* Handle remove */}}
                      >
                        Remove
                      </CustomButton>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {mentoredStudents.length === 0 && (
            <p className="text-gray-600 text-center py-8">No mentorship assignments found.</p>
          )}
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    const mentoredStudents = getMentoredStudents();
    const availableStudents = getAvailableStudents();

    // Group by faculty
    const facultyStats = faculty.map(facultyMember => {
      const assignedStudents = mentoredStudents.filter(m => m.facultyId._id === facultyMember._id);
      return {
        faculty: facultyMember,
        assignedCount: assignedStudents.length,
        students: assignedStudents
      };
    }).filter(stat => stat.assignedCount > 0);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Mentorship Overview</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">{students.length}</p>
              </div>
              <FiUsers className="text-blue-600 text-3xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mentored Students</p>
                <p className="text-3xl font-bold text-green-600">{mentoredStudents.length}</p>
              </div>
              <FiUserCheck className="text-green-600 text-3xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Students</p>
                <p className="text-3xl font-bold text-orange-600">{availableStudents.length}</p>
              </div>
              <FiUserX className="text-orange-600 text-3xl" />
            </div>
          </div>
        </div>

        {/* Faculty-wise Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Faculty-wise Distribution</h3>
          <div className="space-y-4">
            {facultyStats.map(stat => (
              <div key={stat.faculty._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">
                    {stat.faculty.firstName} {stat.faculty.lastName}
                  </h4>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {stat.assignedCount} students
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {stat.students.map(student => (
                    <span key={student._id} className="mr-2">
                      {student.studentId.firstName} {student.studentId.lastName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {facultyStats.length === 0 && (
            <p className="text-gray-600 text-center py-8">No mentorship assignments found.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-6 py-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="mr-2 text-lg" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "assign" && renderAssignStudents()}
      {activeTab === "manage" && renderManageAssignments()}
      {activeTab === "overview" && renderOverview()}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Assignment</h3>
            <p className="text-gray-600 mb-4">
              Assign {selectedStudents.length} student(s) to the selected mentor?
            </p>
            <div className="flex gap-3">
              <CustomButton
                onClick={handleAssignStudents}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              >
                Confirm
              </CustomButton>
              <CustomButton
                onClick={() => setShowAssignModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white flex-1"
              >
                Cancel
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipManagement;
