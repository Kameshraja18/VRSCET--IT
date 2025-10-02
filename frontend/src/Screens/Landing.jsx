import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn, FiUserPlus, FiUsers, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaYoutube, FaBlogger, FaGooglePlusG, FaInstagram } from "react-icons/fa";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const loginOptions = [
    { type: 'admin', label: 'Admin Login', icon: FiLogIn },
    { type: 'student', label: 'Student Login', icon: FiUserPlus },
    { type: 'faculty', label: 'Staff Login', icon: FiUsers }
  ];

  const handleLoginSelect = (type) => {
    navigate(`/login?type=${type}`);
    setIsLoginMenuOpen(false);
  };

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar Dashboard */}
      <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 flex justify-between items-center p-4 shadow-xl relative z-50">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-indigo-200 transition duration-300"
          >
            {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
        
        <div className="hidden md:flex space-x-4">
          <div className="relative">
            <button
              onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl hover:text-white transition duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg font-semibold"
            >
              <FiLogIn className="text-sm" />
              Login Options
              <FiChevronDown className={`text-sm transition-transform duration-200 ${isLoginMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLoginMenuOpen && (
              <div className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                {loginOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => handleLoginSelect(option.type)}
                    className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition duration-200 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                  >
                    <option.icon className="text-indigo-600" />
                    <span className="font-medium text-gray-700">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-200 z-40">
            <div className="p-4 space-y-2">
              {loginOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => {
                    handleLoginSelect(option.type);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white transition duration-300 flex items-center gap-3 font-semibold"
                >
                  <option.icon className="text-sm" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Header */}
      <header className="bg-white p-6 flex flex-col md:flex-row justify-between items-center shadow-2xl m-4 rounded-2xl border border-gray-100">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <img
              src="http://vrscet.in/wp-content/uploads/2020/02/College-logo.png"
              alt="V.R.S. College of Engineering & Technology Logo"
              className="w-24 h-24 object-contain drop-shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">V.R.S. College of Engineering & Technology</h1>
            <p className="text-lg text-gray-600 mt-2 font-medium">Arasur-607 107, Villupuram District</p>
            <p className="text-sm text-gray-500 mt-1">Approved by AICTE and Affiliated to Anna University</p>
            <p className="text-sm text-gray-500 mt-1">(Reaccredited by NAAC and an ISO 9001:2008 Recertified Institution)</p>
            <p className="text-xl text-rose-600 font-semibold mt-2 bg-rose-50 px-3 py-1 rounded-lg inline-block">Counselling Code: 1421</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center p-2 shadow-lg">
            <img
              src="http://vrscet.in/wp-content/uploads/2020/02/College-logo.png"
              alt="V.R.S. College of Engineering & Technology Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex space-x-3">
            <a href="#" className="text-indigo-600 hover:text-purple-600 transition duration-300 transform hover:scale-110 bg-indigo-50 p-2 rounded-full hover:bg-indigo-100">
              <FaFacebookF className="text-xl" />
            </a>
            <a href="#" className="text-indigo-600 hover:text-purple-600 transition duration-300 transform hover:scale-110 bg-indigo-50 p-2 rounded-full hover:bg-indigo-100">
              <FaTwitter className="text-xl" />
            </a>
            <a href="#" className="text-indigo-600 hover:text-purple-600 transition duration-300 transform hover:scale-110 bg-indigo-50 p-2 rounded-full hover:bg-indigo-100">
              <FaYoutube className="text-xl" />
            </a>
            <a href="#" className="text-indigo-600 hover:text-purple-600 transition duration-300 transform hover:scale-110 bg-indigo-50 p-2 rounded-full hover:bg-indigo-100">
              <FaBlogger className="text-xl" />
            </a>
            <a href="#" className="text-indigo-600 hover:text-purple-600 transition duration-300 transform hover:scale-110 bg-indigo-50 p-2 rounded-full hover:bg-indigo-100">
              <FaGooglePlusG className="text-xl" />
            </a>
            <a href="#" className="text-indigo-600 hover:text-purple-600 transition duration-300 transform hover:scale-110 bg-indigo-50 p-2 rounded-full hover:bg-indigo-100">
              <FaInstagram className="text-xl" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white text-center py-24 overflow-hidden m-4 rounded-2xl shadow-2xl"
               style={{
                 backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('http://vrscet.in/wp-content/uploads/2024/08/home_clg-2048x1356.jpg')`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat'
               }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-purple-900/30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center space-y-8 p-6 max-w-4xl mx-auto">
          <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text animate-pulse drop-shadow-lg">
            GOLD INSTITUTE
          </div>
          <p className="text-lg md:text-xl text-blue-100 font-medium">
            AICTE - CII Survey of Industry Linked Technical Institutes 2016
          </p>
          <p className="text-2xl md:text-3xl font-semibold text-white">
            Explore IT Excellence at VRS
          </p>
          <p className="text-xl md:text-2xl font-semibold text-blue-100">
            Join the IT Department for 2025-26{" "}
            <span className="text-yellow-400 font-bold bg-yellow-400/20 px-3 py-1 rounded-full">Apply Now</span>
          </p>
          <p className="text-lg md:text-xl text-blue-200">
            Offering B.E. in IT with cutting-edge labs, mentorship programs, and industry-ready skills
          </p>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 mt-6">
            <p className="text-yellow-300 font-semibold text-center">
              🎯 New Feature: Admin can assign multiple students to faculty mentors for personalized growth tracking!
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 pt-4">
            <button
              onClick={() => handleLoginSelect('student')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl font-bold text-white transform hover:scale-105 transition duration-300 shadow-xl hover:shadow-2xl"
            >
              Student Login
            </button>
            <button
              onClick={() => handleLoginSelect('faculty')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 rounded-xl font-bold text-white transform hover:scale-105 transition duration-300 shadow-xl hover:shadow-2xl"
            >
              Staff Login
            </button>
            <button
              onClick={() => handleLoginSelect('admin')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-bold text-white transform hover:scale-105 transition duration-300 shadow-xl hover:shadow-2xl"
            >
              Admin Login
            </button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="container mx-auto py-20 flex flex-col md:flex-row items-center space-y-12 md:space-y-0 md:space-x-16 m-4 bg-white rounded-2xl shadow-xl p-8">
        <div className="md:w-1/2 relative">
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 rounded-2xl shadow-2xl overflow-hidden">
              <img
                src="http://vrscet.in/wp-content/uploads/2024/08/home_clg-2048x1356.jpg"
                alt="V.R.S. College of Engineering & Technology Campus"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-lg">2025</span>
            </div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-sm">AICTE</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 p-6">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-8">
            Welcome to VRS College of Engineering
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            VRS College of Engineering and Technology was established in the year 1994. The college is functioning with the trust of Government of Tamil Nadu and all India Council for Technical Education and affiliation of Anna University, Chennai.
          </p>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Our institution is committed to providing quality education and fostering innovation in engineering and technology. Join us to be part of a legacy of excellence in technical education.
          </p>
          <button className="text-indigo-600 text-xl hover:underline font-semibold hover:text-purple-600 transition duration-300 bg-indigo-50 px-6 py-3 rounded-xl hover:bg-indigo-100">
            Read More...
          </button>
        </div>
      </section>

      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-800 p-8 m-4 rounded-2xl shadow-2xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 p-6 rounded-2xl transition duration-300 transform hover:scale-105 cursor-pointer shadow-xl hover:shadow-2xl">
              <span className="text-white font-bold text-lg">Home</span>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 p-6 rounded-2xl transition duration-300 transform hover:scale-105 cursor-pointer shadow-xl hover:shadow-2xl">
              <span className="text-white font-bold text-lg">About Us</span>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 p-6 rounded-2xl transition duration-300 transform hover:scale-105 cursor-pointer shadow-xl hover:shadow-2xl">
              <span className="text-white font-bold text-lg">Courses</span>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 p-6 rounded-2xl transition duration-300 transform hover:scale-105 cursor-pointer shadow-xl hover:shadow-2xl">
              <span className="text-white font-bold text-lg">Facilities</span>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 p-6 rounded-2xl transition duration-300 transform hover:scale-105 cursor-pointer shadow-xl hover:shadow-2xl">
              <span className="text-white font-bold text-lg">Placement</span>
            </div>
            <div className="bg-gradient-to-br from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 p-6 rounded-2xl transition duration-300 transform hover:scale-105 cursor-pointer shadow-xl hover:shadow-2xl">
              <span className="text-white font-bold text-lg">Activities</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-20 m-4 rounded-2xl shadow-xl">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-16">
            College Management System Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-gray-100">
              <div className="text-6xl text-indigo-600 mb-6">👨‍�</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Mentorship Program</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Admins can assign students to faculty mentors for personalized growth and development tracking</p>
              <ul className="text-left mt-4 space-y-2">
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Multiple students per mentor</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Progress tracking & goals</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Meeting records</li>
              </ul>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-gray-100">
              <div className="text-6xl text-emerald-600 mb-6">�</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Advanced Attendance</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Comprehensive attendance management with analytics and reporting</p>
              <ul className="text-left mt-4 space-y-2">
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Real-time tracking</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Subject-wise reports</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> CSV export functionality</li>
              </ul>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-gray-100">
              <div className="text-6xl text-purple-600 mb-6">🔐</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Role-Based Access</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Secure access control with dedicated dashboards for each user type</p>
              <ul className="text-left mt-4 space-y-2">
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Admin dashboard</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Faculty dashboard</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Student dashboard</li>
              </ul>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-gray-100">
              <div className="text-6xl text-blue-600 mb-6">📚</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Study Materials</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Organized access to course materials and resources</p>
              <ul className="text-left mt-4 space-y-2">
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Subject-wise organization</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> File upload system</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Student access portal</li>
              </ul>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-gray-100">
              <div className="text-6xl text-orange-600 mb-6">�</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Query Management</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Efficient communication between students and faculty</p>
              <ul className="text-left mt-4 space-y-2">
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Student queries</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Faculty responses</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Query tracking</li>
              </ul>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-gray-100">
              <div className="text-6xl text-red-600 mb-6">📅</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Timetable Management</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Organized class schedules and academic planning</p>
              <ul className="text-left mt-4 space-y-2">
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Weekly schedules</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Room assignments</li>
                <li className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✓</span> Faculty timetables</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* User Dashboards Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 py-20 m-4 rounded-2xl shadow-xl">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-white mb-16">
            Access Your Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-white/20">
              <div className="text-6xl text-yellow-400 mb-6">👑</div>
              <h3 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">Complete system management and oversight</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> Manage students & faculty</li>
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> Assign mentorship programs</li>
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> System analytics & reports</li>
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> Configure subjects & branches</li>
              </ul>
              <button
                onClick={() => handleLoginSelect('admin')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl font-bold text-white transform hover:scale-105 transition duration-300 shadow-xl hover:shadow-2xl"
              >
                Admin Login
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-white/20">
              <div className="text-6xl text-emerald-400 mb-6">👨‍🏫</div>
              <h3 className="text-3xl font-bold text-white mb-6">Faculty Dashboard</h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">Manage classes, students, and academic activities</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> View assigned students</li>
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> Mark attendance</li>
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> Upload study materials</li>
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> Respond to student queries</li>
              </ul>
              <button
                onClick={() => handleLoginSelect('faculty')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl font-bold text-white transform hover:scale-105 transition duration-300 shadow-xl hover:shadow-2xl"
              >
                Faculty Login
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-white/20">
              <div className="text-6xl text-blue-400 mb-6">🎓</div>
              <h3 className="text-3xl font-bold text-white mb-6">Student Dashboard</h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">Access your academic information and resources</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> View attendance records</li>
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> Access study materials</li>
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> Submit queries to faculty</li>
                <li className="flex items-center text-white"><span className="text-green-400 mr-3">✓</span> View mentor information</li>
              </ul>
              <button
                onClick={() => handleLoginSelect('student')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 rounded-xl font-bold text-white transform hover:scale-105 transition duration-300 shadow-xl hover:shadow-2xl"
              >
                Student Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* System Stats Section */}
      <section className="bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-20 m-4 rounded-2xl shadow-xl">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-16">
            System Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-gray-100">
              <div className="text-5xl text-indigo-600 mb-4">👥</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">500+</div>
              <p className="text-gray-600 font-medium">Students Enrolled</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-gray-100">
              <div className="text-5xl text-emerald-600 mb-4">👨‍🏫</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">50+</div>
              <p className="text-gray-600 font-medium">Faculty Members</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-gray-100">
              <div className="text-5xl text-purple-600 mb-4">📚</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">25+</div>
              <p className="text-gray-600 font-medium">Subjects Offered</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-2xl border border-gray-100">
              <div className="text-5xl text-orange-600 mb-4">🏆</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">95%</div>
              <p className="text-gray-600 font-medium">Average Attendance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-800 text-white p-12 m-4 rounded-2xl shadow-2xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">About Us</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-blue-200 hover:text-emerald-400 transition duration-300 hover:translate-x-2 inline-block">History</a></li>
                <li><a href="#" className="text-blue-200 hover:text-emerald-400 transition duration-300 hover:translate-x-2 inline-block">Vision & Mission</a></li>
                <li><a href="#" className="text-blue-200 hover:text-emerald-400 transition duration-300 hover:translate-x-2 inline-block">Core Values</a></li>
                <li><a href="#" className="text-blue-200 hover:text-emerald-400 transition duration-300 hover:translate-x-2 inline-block">Leadership</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">Academic</h3>
              <ul className="space-y-3">
                <li><span className="text-blue-200">Department of CSE</span></li>
                <li><span className="text-blue-200">Department of ECE</span></li>
                <li><span className="text-blue-200">Department of Civil</span></li>
                <li><span className="text-blue-200">Department of Mechanical</span></li>
                <li><span className="text-blue-200">Department of EEE</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">Facilities</h3>
              <ul className="space-y-3">
                <li><span className="text-blue-200">Modern Infrastructure</span></li>
                <li><span className="text-blue-200">Well-equipped Library</span></li>
                <li><span className="text-blue-200">Advanced Laboratories</span></li>
                <li><span className="text-blue-200">Sports Facilities</span></li>
                <li><span className="text-blue-200">Hostel Accommodation</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">Connect With Us</h3>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-blue-200 hover:text-emerald-400 transition duration-300 transform hover:scale-110 bg-indigo-800 p-3 rounded-full hover:bg-indigo-700">
                  <FaFacebookF className="text-xl" />
                </a>
                <a href="#" className="text-blue-200 hover:text-emerald-400 transition duration-300 transform hover:scale-110 bg-indigo-800 p-3 rounded-full hover:bg-indigo-700">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-blue-200 hover:text-emerald-400 transition duration-300 transform hover:scale-110 bg-indigo-800 p-3 rounded-full hover:bg-indigo-700">
                  <FaYoutube className="text-xl" />
                </a>
                <a href="#" className="text-blue-200 hover:text-emerald-400 transition duration-300 transform hover:scale-110 bg-indigo-800 p-3 rounded-full hover:bg-indigo-700">
                  <FaInstagram className="text-xl" />
                </a>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center p-2 shadow-xl">
                <img
                  src="http://vrscet.in/wp-content/uploads/2020/02/College-logo.png"
                  alt="V.R.S. College of Engineering & Technology Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8 text-center m-4 rounded-2xl shadow-xl">
        <p className="text-xl">
          © 2025 V.R.S. College of Engineering & Technology. All rights reserved. |
          <a href="#" className="text-blue-200 hover:text-emerald-400 ml-2 transition duration-300 font-semibold">LinkedIn</a> |
          <a href="mailto:info@vrsengg.ac.in" className="text-blue-200 hover:text-emerald-400 ml-2 transition duration-300 font-semibold">Contact Us</a>
        </p>
      </div>
    </div>
  );
};

export default Landing;
