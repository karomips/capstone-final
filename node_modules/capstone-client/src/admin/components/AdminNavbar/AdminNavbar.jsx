import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNavbar.css';
import '../../../shared/styles/unified-design-system.css';

function AdminNavbar() {
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  const handleSignOut = () => {
    setShowSignoutModal(true);
  };

  const confirmSignOut = () => {
    // Clear all admin data
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminRole');
    setShowSignoutModal(false);
    window.location.href = '/';
  };

  const cancelSignOut = () => {
    setShowSignoutModal(false);
  };

  // Close modal when pressing escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showSignoutModal) {
        setShowSignoutModal(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showSignoutModal]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img 
            src="/barangay_logo.png" 
            alt="Barangay Mangan-vaca Logo"
            className="sidebar-logo"
          />
          <div>
            <h1 className="sidebar-title">Admin Panel</h1>
            <span className="sidebar-subtitle">WorkNest: Mangan-vaca Portal</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon"></span>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/approve" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon"></span>
              User Approval
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/jobs" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon"></span>
              Job Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon"></span>
              User Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/reports" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon"></span>
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/profile" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon"></span>
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {localStorage.getItem('adminUser') 
              ? JSON.parse(localStorage.getItem('adminUser')).name?.charAt(0).toUpperCase() 
              : 'A'
            }
          </div>
          <div className="user-details">
            <span className="user-name">
              {localStorage.getItem('adminUser') 
                ? JSON.parse(localStorage.getItem('adminUser')).name || 'Admin'
                : 'Admin'
              }
            </span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleSignOut}>
          <span className="btn-icon"></span>
          Sign Out
        </button>
      </div>

      {/* Signout Confirmation Modal */}
      {showSignoutModal && (
        <div className="modal-overlay" onClick={cancelSignOut}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Sign Out</h3>
              <button className="modal-close-btn" onClick={cancelSignOut}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-icon-admin">
                <div className="signout-icon"></div>
              </div>
              <p>Are you sure you want to sign out?</p>
              <p className="text-muted">You will be redirected to the main page and need to log in again.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cancelSignOut}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default AdminNavbar;
