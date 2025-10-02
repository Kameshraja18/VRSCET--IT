import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import { FiMessageSquare, FiSend, FiPaperclip, FiEye, FiEyeOff } from "react-icons/fi";

const StudentQuery = () => {
  const [queries, setQueries] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    facultyId: "",
    subject: "",
    message: "",
    priority: "medium",
  });
  const [attachments, setAttachments] = useState([]);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [facultyRes, queriesRes] = await Promise.all([
        axiosWrapper.get("/faculty/", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/query/student", { headers: { Authorization: `Bearer ${userToken}` } }),
      ]);

      setFaculty(facultyRes.data.data || []);
      setQueries(queriesRes.data.data || []);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.facultyId || !formData.subject || !formData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    const submitData = new FormData();
    submitData.append("facultyId", formData.facultyId);
    submitData.append("subject", formData.subject);
    submitData.append("message", formData.message);
    submitData.append("priority", formData.priority);

    attachments.forEach((file, index) => {
      submitData.append("attachments", file);
    });

    try {
      const response = await axiosWrapper.post("/query/", submitData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Query submitted successfully");
        setFormData({
          facultyId: "",
          subject: "",
          message: "",
          priority: "medium",
        });
        setAttachments([]);
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit query");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid file type`);
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }

      return true;
    });

    setAttachments(validFiles);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "answered": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Queries</h2>
        <CustomButton
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiMessageSquare className="text-sm" />
          {showForm ? "Cancel" : "New Query"}
        </CustomButton>
      </div>

      {/* Query Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Submit New Query</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Faculty</label>
              <select
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose Faculty</option>
                {faculty.map((fac) => (
                  <option key={fac._id} value={fac._id}>
                    {fac.firstName} {fac.lastName} - {fac.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief subject of your query"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                placeholder="Describe your query in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Max 5 files, 10MB each. Supported: JPG, PNG, PDF, DOC, DOCX</p>

              {attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <CustomButton
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <FiSend className="text-sm" />
                Submit Query
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

      {/* Queries List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">My Queries ({queries.length})</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading queries...</p>
          </div>
        ) : queries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiMessageSquare className="mx-auto h-12 w-12 mb-4" />
            <p>No queries found</p>
            <p className="text-sm">Submit your first query to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {queries.map((query) => (
              <div key={query._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">{query.subject}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      To: {query.facultyId?.firstName} {query.facultyId?.lastName}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(query.status)}`}>
                        {query.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(query.priority)}`}>
                        {query.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(query.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{query.message}</p>

                {query.attachments && query.attachments.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {query.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={`http://localhost:4000/media/${attachment.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-2 py-1 rounded"
                        >
                          <FiPaperclip className="text-xs" />
                          {attachment.originalName}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {query.facultyResponse && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-green-800">Faculty Response</h5>
                      <span className="text-xs text-green-600">
                        {new Date(query.facultyResponse.respondedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-green-700">{query.facultyResponse.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQuery;
