import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'user';

  // Check if user is logged in
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on user's actual role
    if (userRole === 'admin') {
      window.location.href = 'http://localhost:3001'; // Admin app
      return null;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default RoleProtectedRoute;
