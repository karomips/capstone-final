import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  // Check if admin is logged in
  if (!isAdminLoggedIn || !adminUser.isAdmin) {
    // Clear any invalid data
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUser');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
