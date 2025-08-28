// Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import '../../../shared/styles/unified-design-system.css';

function Navbar() {
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = () => {
    setShowSignoutModal(true);
  };

  const confirmSignOut = () => {
    // Clear all user data and role information
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setShowSignoutModal(false);
    window.location.href = '/user/login';
  };

  const cancelSignOut = () => {
    setShowSignoutModal(false);
  };

  const toggleJobsDropdown = () => {
    setIsJobsDropdownOpen(!isJobsDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsJobsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            src="/worknest.png" 
            alt="Barangay Mangan-vaca Logo"
            className="sidebar-logo"
          />
          <h1 className="sidebar-title">WorkNest: Job Portal</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li>
            <NavLink to="/user/home" className="nav-link">
              <span className="nav-icon"></span>
              Home
            </NavLink>
          </li>
          
          {/* Jobs Dropdown */}
          <li className="nav-dropdown" ref={dropdownRef}>
            <div 
              className={`nav-dropdown-toggle ${isJobsDropdownOpen ? 'active' : ''}`}
              onClick={toggleJobsDropdown}
            >
              <span className="nav-icon"></span>
              <span>Jobs</span>
              <span className={`dropdown-arrow ${isJobsDropdownOpen ? 'rotated' : ''}`}>▼</span>
            </div>
            <ul className={`nav-dropdown-menu ${isJobsDropdownOpen ? 'open' : ''}`}>
              <li>
                <NavLink 
                  to="/user/jobs" 
                  className="nav-link"
                  onClick={() => setIsJobsDropdownOpen(false)}
                >
                  <span className="nav-icon"></span>
                  View Jobs
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/user/post-job" 
                  className="nav-link"
                  onClick={() => setIsJobsDropdownOpen(false)}
                >
                  <span className="nav-icon"></span>
                  Post a Job
                </NavLink>
              </li>
            </ul>
          </li>
          
          <li>
            <NavLink to="/user/messages" className="nav-link">
              <span className="nav-icon"></span>
              Messages
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/profile" className="nav-link">
              <span className="nav-icon"></span>
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="btn btn-danger btn-sm" onClick={handleSignOut}>
          <span className="nav-icon"></span>
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
              <p className="text-muted">You will need to log in again to access your account.</p>
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

export default Navbar;
