import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import './styles/professional-theme.css'; // Import professional theme
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
import Landing from './components/Landing/Landing.jsx';
import Profile from './components/Profile/Profile.jsx';
import Messages from './components/Messages/Messages.jsx';
import Apply from './components/Apply/Apply.jsx';

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/landing' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/upload';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
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
