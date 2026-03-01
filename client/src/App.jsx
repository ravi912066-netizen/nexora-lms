import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './components/Layout/MainLayout';

import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentCourses from './pages/StudentCourses';
import CourseView from './pages/CourseView';
import Leaderboard from './pages/Leaderboard';
import LiveClass from './pages/LiveClass';
import Profile from './pages/Profile';

// Admin Pages
import AdminCourses from './pages/AdminCourses';
import AdminAssignments from './pages/AdminAssignments';
import AdminStudentProfile from './pages/AdminStudentProfile';
import AdminEnrollments from './pages/AdminEnrollments';
import AdminDoubts from './pages/AdminDoubts'; // Added
import OneOnOneCall from './pages/OneOnOneCall'; // Added 1-on-1 Call

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Student Routes */}
        <Route path="/courses" element={<StudentCourses />} />
        <Route path="/courses/:id" element={<CourseView />} />
        <Route path="/live/:courseId" element={<LiveClass />} />
        <Route path="/call/:roomId/:studentId?" element={<OneOnOneCall />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* Admin Routes */}
        <Route path="/admin/courses" element={<ProtectedRoute requiredRole="admin"><AdminCourses /></ProtectedRoute>} />
        <Route path="/admin/enrollments" element={<ProtectedRoute requiredRole="admin"><AdminEnrollments /></ProtectedRoute>} />
        <Route path="/admin/assignments" element={<ProtectedRoute requiredRole="admin"><AdminAssignments /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute requiredRole="admin"><AdminStudentProfile /></ProtectedRoute>} />
        <Route path="/admin/doubts" element={<ProtectedRoute requiredRole="admin"><AdminDoubts /></ProtectedRoute>} /> {/* Added */}
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
