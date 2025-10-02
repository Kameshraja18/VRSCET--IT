import React, { useState, useEffect } from "react";
import { FiLogIn, FiUser, FiShield, FiBookOpen, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGraduationCap, FaChalkboardTeacher, FaUserShield } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../redux/actions";
import { useDispatch } from "react-redux";
import CustomButton from "../components/CustomButton";
import axiosWrapper from "../utils/AxiosWrapper";

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const USER_CONFIG = {
  Student: {
    icon: FaGraduationCap,
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-50 to-teal-50",
    accentColor: "emerald",
    description: "Access your student dashboard"
  },
  Faculty: {
    icon: FaChalkboardTeacher,
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50",
    accentColor: "blue",
    description: "Manage your faculty portal"
  },
  Admin: {
    icon: FaUserShield,
    color: "from-purple-500 to-pink-600",
    bgColor: "from-purple-50 to-pink-50",
    accentColor: "purple",
    description: "Administrative control panel"
  }
};

const LoginForm = ({ selected, onSubmit, formData, setFormData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const config = USER_CONFIG[selected];

  return (
    <form
      className="w-full p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden"
      onSubmit={onSubmit}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-100 to-transparent rounded-full -ml-12 -mb-12"></div>

      <div className="relative z-10">
        {/* User Type Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center shadow-xl`}>
            <config.icon className="text-3xl text-white" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{selected} Login</h2>
          <p className="text-gray-600 text-sm">{config.description}</p>
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiMail className="text-gray-400 text-lg" />
            </div>
            <input
              type="email"
              id="email"
              required
              className="w-full pl-12 pr-4 py-4 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
              placeholder={`Enter your ${selected.toLowerCase()} email`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiLock className="text-gray-400 text-lg" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              className="w-full pl-12 pr-12 py-4 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-400 text-lg hover:text-gray-600 transition duration-200" />
              ) : (
                <FiEye className="text-gray-400 text-lg hover:text-gray-600 transition duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex items-center justify-end mb-8">
          <Link
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition duration-200"
            to="/forget-password"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <CustomButton
          type="submit"
          className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition duration-300 flex justify-center items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105`}
        >
          <FiLogIn className="text-lg" />
          Login to {selected} Portal
        </CustomButton>
      </div>
    </form>
  );
};

const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="flex justify-center gap-4 mb-8">
    {Object.values(USER_TYPES).map((type) => {
      const config = USER_CONFIG[type];
      const IconComponent = config.icon;
      const isSelected = selected === type;

      return (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`relative px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-2 min-w-[120px] ${
            isSelected
              ? `bg-gradient-to-br ${config.color} text-white shadow-xl scale-105`
              : `bg-white text-gray-700 hover:bg-gradient-to-br ${config.bgColor} shadow-lg hover:shadow-xl border-2 border-gray-100`
          }`}
        >
          <IconComponent className={`text-2xl ${isSelected ? 'text-white' : `text-${config.accentColor}-600`}`} />
          <span className="font-semibold text-sm">{type}</span>
          {isSelected && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
          )}
        </button>
      );
    })}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selected, setSelected] = useState(USER_TYPES.STUDENT);

  useEffect(() => {
    if (type) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      if (Object.values(USER_TYPES).includes(capitalizedType)) {
        setSelected(capitalizedType);
      }
    }
  }, [type]);

  const handleUserTypeSelect = (type) => {
    const userType = type.toLowerCase();
    setSelected(type);
    setSearchParams({ type: userType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosWrapper.post(
        `/${selected.toLowerCase()}/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token } = response.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", selected);
      dispatch(setUserToken(token));
      navigate(`/${selected.toLowerCase()}`);
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (type) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      setSelected(capitalizedType);
    }
  }, [type]);

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
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to access your {selected.toLowerCase()} portal
          </p>
        </div>

        {/* User Type Selector */}
        <UserTypeSelector selected={selected} onSelect={handleUserTypeSelect} />

        {/* Login Form */}
        <LoginForm
          selected={selected}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span className="text-indigo-600 font-medium hover:underline cursor-pointer">
              Contact Administrator
            </span>
          </p>
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

export default Login;
