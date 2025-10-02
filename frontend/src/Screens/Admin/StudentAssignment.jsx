import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import { FiUserPlus, FiUsers, FiBookOpen, FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";

const StudentAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useState({
    studentId: "",
    facultyId: "",
    subjectId: "",
    semester: "",
    branchId: "",
  });
  const [formData, setFormData] = useState({
    studentId: "",
    facultyId: "",
    subjectId: "",
    semester: "",
    branchId: "",
  });

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, facultyRes, subjectsRes, branchesRes, assignmentsRes] = await Promise.all([
        axiosWrapper.get("/student/", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/faculty/", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/subject/", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/branch/", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/student-assignment/", { headers: { Authorization: `Bearer ${userToken}` } }),
      ]);

      setStudents(studentsRes.data.data || []);
      setFaculty(facultyRes.data.data || []);
      setSubjects(subjectsRes.data.data || []);
      setBranches(branchesRes.data.data || []);
      setAssignments(assignmentsRes.data.data || []);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.facultyId || !formData.subjectId || !formData.semester || !formData.branchId) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await axiosWrapper.post("/student-assignment/", formData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (response.data.success) {
        toast.success("Student assigned successfully");
        setFormData({
          studentId: "",
          facultyId: "",
          subjectId: "",
          semester: "",
          branchId: "",
        });
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign student");
    }
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axiosWrapper.get(`/student-assignment/?${queryParams}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setAssignments(response.data.data || []);
    } catch (error) {
      toast.error("Search failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await axiosWrapper.delete(`/student-assignment/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      toast.success("Assignment deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Student Assignments</h2>
        <CustomButton
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiUserPlus className="text-sm" />
          {showForm ? "Cancel" : "Assign Student"}
        </CustomButton>
      </div>

      {/* Assignment Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Assign Student to Faculty</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.firstName} {student.lastName} ({student.enrollmentNo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
              <select
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Faculty</option>
                {faculty.map((fac) => (
                  <option key={fac._id} value={fac._id}>
                    {fac.firstName} {fac.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} ({branch.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <CustomButton
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Assign Student
              </CustomButton>
              <CustomButton
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </CustomButton>
            </div>
          </form>
        </div>
      )}

      {/* Search Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Search Assignments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          <select
            value={searchParams.studentId}
            onChange={(e) => setSearchParams({ ...searchParams, studentId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Students</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>

          <select
            value={searchParams.facultyId}
            onChange={(e) => setSearchParams({ ...searchParams, facultyId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Faculty</option>
            {faculty.map((fac) => (
              <option key={fac._id} value={fac._id}>
                {fac.firstName} {fac.lastName}
              </option>
            ))}
          </select>

          <select
            value={searchParams.subjectId}
            onChange={(e) => setSearchParams({ ...searchParams, subjectId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>

          <select
            value={searchParams.semester}
            onChange={(e) => setSearchParams({ ...searchParams, semester: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>

          <CustomButton
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <FiSearch className="text-sm" />
            Search
          </CustomButton>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Current Assignments ({assignments.length})</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiUsers className="mx-auto h-12 w-12 mb-4" />
            <p>No assignments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faculty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {assignment.studentId?.firstName?.charAt(0)}
                              {assignment.studentId?.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.studentId?.firstName} {assignment.studentId?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assignment.studentId?.enrollmentNo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.facultyId?.firstName} {assignment.facultyId?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {assignment.facultyId?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.subjectId?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {assignment.subjectId?.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Semester {assignment.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(assignment._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Assignment"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignment;
