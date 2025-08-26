import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import './styles/professional-theme.css'; // Import professional theme
import Navbar from './components/Navbar/Navbar';
import Homepage from './components/Homepage/Homepage';
import Login from './components/Login/Login';
import Postpage from './components/Postpage/Postpage';
import Contact from './components/Contact/Contact';
import Upload from './components/Upload/Upload';
import Register from './components/Register/Register';
import Jobspage from './components/Jobspage/Jobspage';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Landing from './components/Landing/Landing';
import Profile from './components/Profile/Profile';
import Messages from './components/Messages/Messages';
import Apply from './components/Apply/Apply';

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/upload';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/apply" element={<Apply />} />
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
          path="/admin/*" 
          element={
            <AdminRoute>
              {/* Your admin components */}
            </AdminRoute>
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
        {/* Add other routes here */}
      </Routes>
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

function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/login" />;
}
