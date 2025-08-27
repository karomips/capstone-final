import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import AdminNavbar from './components/AdminNavbar/AdminNavbar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Approval from './components/Approval/Approval.jsx';
import JobManagement from './components/JobManagement/JobManagement.jsx';
import UserManagement from './components/UserManagement/UserManagement.jsx';
import Reports from './components/Reports/Reports.jsx';
import Profile from './components/Profile/Profile.jsx';
import AdminLogin from './components/AdminLogin/AdminLogin.jsx';
import Landing from './components/Landing/Landing.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';

function AppLayout() {
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
    
    // Also check periodically for same-tab changes
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Hide navbar on landing and login pages
  const hideNavbar = location.pathname === '/' || location.pathname === '/landing' || location.pathname === '/login';

  // Show landing page for root path or if not logged in and on landing
  if (location.pathname === '/' || (location.pathname === '/landing' && !isAdminLoggedIn)) {
    return <Landing />;
  }

  // Show login page if not logged in and trying to access protected routes
  if (!isAdminLoggedIn && location.pathname !== '/login') {
    return <AdminLogin />;
  }

  return (
    <>
      {!hideNavbar && isAdminLoggedIn && <AdminNavbar />}
      <div className={isAdminLoggedIn && !hideNavbar ? "admin-main-content" : ""}>
        <Routes>
          <Route path="/landing" element={<Landing />} />
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

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
