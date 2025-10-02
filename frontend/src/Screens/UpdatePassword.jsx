import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosWrapper from "../utils/AxiosWrapper";
import CustomButton from "../components/CustomButton";
import { FiLock, FiShield, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { resetId, type } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!resetId) {
      toast.error("Invalid or expired reset link.");
      navigate("/");
    }
  }, [resetId, navigate]);

  useEffect(() => {
    if (!resetId) {
      toast.error("Invalid or expired reset link.");
      navigate("/");
    }
  }, [resetId, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!type) {
      toast.error("Invalid Reset Password Link.");
      return;
    }
    setIsLoading(true);
    toast.loading("Resetting your password...");

    try {
      const response = await axiosWrapper.post(
        `/${type}/update-password/${resetId}`,
        { password: newPassword, resetId }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success("Password reset successfully.");
        navigate("/");
      } else {
        toast.error(response.data.message || "Error resetting password.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error resetting password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-200/30 to-teal-200/30 rounded-full -mr-48 -mb-48"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-pink-200/20 to-rose-200/20 rounded-full"></div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl mb-4">
            <FiShield className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            Create a new secure password for your account
          </p>
        </div>

        {/* Reset Form */}
        <form
          className="w-full p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden"
          onSubmit={onSubmit}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-100 to-transparent rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10">
            {/* New Password Field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 text-lg" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  required
                  className="w-full pl-12 pr-12 py-4 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <FiEyeOff className="text-gray-400 text-lg hover:text-gray-600 transition duration-200" />
                  ) : (
                    <FiEye className="text-gray-400 text-lg hover:text-gray-600 transition duration-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiCheck className="text-gray-400 text-lg" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                  className="w-full pl-12 pr-12 py-4 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="text-gray-400 text-lg hover:text-gray-600 transition duration-200" />
                  ) : (
                    <FiEye className="text-gray-400 text-lg hover:text-gray-600 transition duration-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <CustomButton
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition duration-300 flex justify-center items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiLock className="text-lg" />
              {isLoading ? "Resetting..." : "Reset Password"}
            </CustomButton>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2025 V.R.S. College of Engineering & Technology
          </p>
        </div>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
};

export default UpdatePassword;
