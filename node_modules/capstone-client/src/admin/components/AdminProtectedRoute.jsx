import React from 'react';

const AdminProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  // Check if admin is logged in
  if (!isAdminLoggedIn || !adminUser.isAdmin) {
    // Clear any invalid data
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUser');
    return null; // This will show the login form since App.js handles the redirect
  }

  return children;
};

export default AdminProtectedRoute;
