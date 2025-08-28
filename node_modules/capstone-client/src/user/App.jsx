import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar.jsx';
import Homepage from './components/Homepage/Homepage.jsx';
import Login from './components/Login/Login.jsx';
import Postpage from './components/Postpage/Postpage.jsx';
import Contact from './components/Contact/Contact.jsx';
import Upload from './components/Upload/Upload.jsx';
import Register from './components/Register/Register.jsx';
import Jobspage from './components/Jobspage/Jobspage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx';
import Profile from './components/Profile/Profile.jsx';
import Messages from './components/Messages/Messages.jsx';
import Apply from './components/Apply/Apply.jsx';

function UserApp() {
  const location = useLocation();
  const hideNavbar = location.pathname.includes('/login') || location.pathname.includes('/register') || location.pathname.includes('/upload');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/profile-protected"
          element={
            <RoleProtectedRoute requiredRole="user">
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <RoleProtectedRoute requiredRole="user">
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <RoleProtectedRoute requiredRole="user">
              <ProtectedRoute>
                <Jobspage />
              </ProtectedRoute>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <RoleProtectedRoute requiredRole="user">
              <ProtectedRoute>
                <Postpage />
              </ProtectedRoute>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <RoleProtectedRoute requiredRole="user">
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            </RoleProtectedRoute>
          }
        />
        <Route 
          path="/apply/:id" 
          element={
            <ProtectedRoute>
              <Apply />
            </ProtectedRoute>
          } 
        />
        {/* Default route for user section */}
        <Route path="/" element={<Navigate to="/user/home" replace />} />
        <Route path="*" element={<Navigate to="/user/home" replace />} />
      </Routes>
    </>
  );
}

export default UserApp;
