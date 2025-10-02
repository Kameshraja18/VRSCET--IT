import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboard />} />
      {/* Add more student-specific routes here */}
    </Routes>
  );
};

export default StudentRoutes;
