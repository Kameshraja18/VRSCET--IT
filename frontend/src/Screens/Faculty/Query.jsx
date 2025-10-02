import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import { FiMessageSquare, FiSend, FiPaperclip, FiEye, FiEyeOff } from "react-icons/fi";

const FacultyQuery = () => {
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState("");
  const [filter, setFilter] = useState("all");

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchQueries();
  }, [filter]);

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const response = await axiosWrapper.get(`/query/faculty?status=${filter}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setQueries(response.data.data || []);
    } catch (error) {
      toast.error("Failed to load queries");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (queryId) => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      const res = await axiosWrapper.put(
        `/query/${queryId}/respond`,
        { message: response },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      if (res.data.success) {
        toast.success("Response sent successfully");
        setResponse("");
        setSelectedQuery(null);
        fetchQueries();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send response");
    }
  };

  const handleCloseQuery = async (queryId) => {
    try {
      const res = await axiosWrapper.put(
        `/query/${queryId}/close`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      if (res.data.success) {
        toast.success("Query closed successfully");
        fetchQueries();
      }
    } catch (error) {
      toast.error("Failed to close query");
    }
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

  const filteredQueries = queries.filter(query => {
    if (filter === "all") return true;
    return query.status === filter;
  });

  return (
    <div className="p-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Student Queries</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Queries</option>
            <option value="pending">Pending</option>
            <option value="answered">Answered</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Response Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Respond to Query</h3>
              <button
                onClick={() => setSelectedQuery(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedQuery.subject}</h4>
              <p className="text-sm text-gray-600 mb-2">
                From: {selectedQuery.studentId?.firstName} {selectedQuery.studentId?.lastName} ({selectedQuery.studentId?.email})
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedQuery.priority)}`}>
                  {selectedQuery.priority} priority
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(selectedQuery.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{selectedQuery.message}</p>

              {selectedQuery.attachments && selectedQuery.attachments.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedQuery.attachments.map((attachment, index) => (
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
            </div>

            {selectedQuery.facultyResponse ? (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <h5 className="text-sm font-medium text-green-800 mb-2">Your Previous Response</h5>
                <p className="text-green-700">{selectedQuery.facultyResponse.message}</p>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="Type your response here..."
                />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              {!selectedQuery.facultyResponse && (
                <CustomButton
                  onClick={() => handleRespond(selectedQuery._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FiSend className="text-sm" />
                  Send Response
                </CustomButton>
              )}
              {selectedQuery.status !== "closed" && (
                <CustomButton
                  onClick={() => handleCloseQuery(selectedQuery._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Close Query
                </CustomButton>
              )}
              <CustomButton
                onClick={() => setSelectedQuery(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </CustomButton>
            </div>
          </div>
        </div>
      )}

      {/* Queries List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Queries ({filteredQueries.length})</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading queries...</p>
          </div>
        ) : filteredQueries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiMessageSquare className="mx-auto h-12 w-12 mb-4" />
            <p>No queries found</p>
            <p className="text-sm">No queries match the selected filter</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredQueries.map((query) => (
              <div key={query._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">{query.subject}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      From: {query.studentId?.firstName} {query.studentId?.lastName} ({query.studentId?.email})
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

                <p className="text-gray-700 mb-3 line-clamp-2">{query.message}</p>

                {query.attachments && query.attachments.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FiPaperclip className="text-xs" />
                      {query.attachments.length} attachment{query.attachments.length > 1 ? 's' : ''}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {query.facultyResponse && (
                      <span className="text-sm text-green-600 font-medium">✓ Responded</span>
                    )}
                  </div>
                  <CustomButton
                    onClick={() => setSelectedQuery(query)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    {query.facultyResponse ? "View Response" : "Respond"}
                  </CustomButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyQuery;
