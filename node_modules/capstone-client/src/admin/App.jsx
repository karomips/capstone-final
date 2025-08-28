import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import AdminNavbar from './components/AdminNavbar/AdminNavbar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Approval from './components/Approval/Approval.jsx';
import JobManagement from './components/JobManagement/JobManagement.jsx';
import UserManagement from './components/UserManagement/UserManagement.jsx';
import Reports from './components/Reports/Reports.jsx';
import Profile from './components/Profile/Profile.jsx';
import AdminLogin from './components/AdminLogin/AdminLogin.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';

function AdminApp() {
  const location = useLocation();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    localStorage.getItem('isAdminLoggedIn') === 'true'
  );

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdminLoggedIn(localStorage.getItem('isAdminLoggedIn') === 'true');
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Check immediately and then periodically for same-tab changes
    handleStorageChange();
    const interval = setInterval(handleStorageChange, 50); // More frequent check

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Hide navbar on login pages
  const hideNavbar = location.pathname.includes('/login');

  return (
    <>
      {!hideNavbar && isAdminLoggedIn && <AdminNavbar />}
      <div className={isAdminLoggedIn && !hideNavbar ? "admin-main-content" : ""}>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/approve" element={
            <AdminProtectedRoute>
              <Approval />
            </AdminProtectedRoute>
          } />
          <Route path="/jobs" element={
            <AdminProtectedRoute>
              <JobManagement />
            </AdminProtectedRoute>
          } />
          <Route path="/users" element={
            <AdminProtectedRoute>
              <UserManagement />
            </AdminProtectedRoute>
          } />
          <Route path="/reports" element={
            <AdminProtectedRoute>
              <Reports />
            </AdminProtectedRoute>
          } />
          <Route path="/profile" element={
            <AdminProtectedRoute>
              <Profile />
            </AdminProtectedRoute>
          } />
          {/* Default route for admin section */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

export default AdminApp;
