import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const handleSignOut = () => {
    // Clear all admin data
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminRole');
    alert('Signed out successfully!');
    window.location.href = '/';
  };

  return (
    <aside className="admin-sidenav">
      <div className="admin-sidenav-brand">
        <div className="admin-brand-container">
          <img 
            src="/favicon.ico" 
            alt="Barangay Mangan-vaca Logo"
            className="admin-sidenav-logo"
          />
          <h1 className="admin-brand-text">Admin Dashboard</h1>
          <span className="admin-brand-subtitle">Mangan-vaca Job Portal</span>
        </div>
      </div>

      <ul className="admin-sidenav-links">
        <li>
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span className="nav-icon">🏠</span>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/approve" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span className="nav-icon">✅</span>
            User Approval
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/jobs" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span className="nav-icon">💼</span>
            Job Management
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span className="nav-icon">👥</span>
            User Management
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/reports" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span className="nav-icon">📊</span>
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/profile" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span className="nav-icon">👤</span>
            Profile
          </NavLink>
        </li>
      </ul>

      <div className="admin-sidenav-actions">
        <div className="admin-user-info">
          <div className="admin-avatar">
            {localStorage.getItem('adminUser') 
              ? JSON.parse(localStorage.getItem('adminUser')).name?.charAt(0).toUpperCase() 
              : 'A'
            }
          </div>
          <div className="admin-user-details">
            <span className="admin-user-name">
              {localStorage.getItem('adminUser') 
                ? JSON.parse(localStorage.getItem('adminUser')).name || 'Admin'
                : 'Admin'
              }
            </span>
            <span className="admin-user-role">Administrator</span>
          </div>
        </div>
        <button className="admin-signout-btn" onClick={handleSignOut}>
          <span className="signout-icon">🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default AdminNavbar;
