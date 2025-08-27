// Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

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
    <aside className="sidenav">
      <div className="sidenav-brand">
        <div className="brand-container">
          <img 
            src="/barangay_logo.png" 
            alt="Barangay Mangan-vaca Logo"
            className="sidenav-logo"
          />
          <h1 className="brand-text">Mangan-vaca Job Portal</h1>
        </div>
      </div>

      <ul className="sidenav-links">
        <li><NavLink to="/user/home" activeClassName="active">Home</NavLink></li>
        
        {/* Jobs Dropdown */}
        <li className="dropdown-container" ref={dropdownRef}>
          <div 
            className={`dropdown-toggle ${isJobsDropdownOpen ? 'active' : ''}`}
            onClick={toggleJobsDropdown}
          >
            <span>Jobs</span>
            <i className={`dropdown-arrow ${isJobsDropdownOpen ? 'rotated' : ''}`}>▼</i>
          </div>
          <ul className={`dropdown-menu ${isJobsDropdownOpen ? 'open' : ''}`}>
            <li>
              <NavLink 
                to="/user/jobs" 
                activeClassName="active"
                onClick={() => setIsJobsDropdownOpen(false)}
              >
                View Jobs
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/user/post-job" 
                activeClassName="active"
                onClick={() => setIsJobsDropdownOpen(false)}
              >
                Post a Job
              </NavLink>
            </li>
          </ul>
        </li>
        
        <li><NavLink to="/user/contact" activeClassName="active">Contact</NavLink></li>
        <li><NavLink to="/user/messages" activeClassName="active">Messages</NavLink></li>
        <li><NavLink to="/user/profile" activeClassName="active">Profile</NavLink></li>
      </ul>

      <div className="sidenav-actions">
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {/* Signout Confirmation Modal */}
      {showSignoutModal && (
        <div className="signout-modal-backdrop" onClick={cancelSignOut}>
          <div className="signout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="signout-modal-header">
              <h3>Confirm Sign Out</h3>
              <button className="signout-modal-close" onClick={cancelSignOut}>
                ×
              </button>
            </div>
            <div className="signout-modal-body">
              <div className="signout-modal-icon">
                🚪
              </div>
              <p>Are you sure you want to sign out?</p>
              <p className="signout-modal-subtitle">You will need to log in again to access your account.</p>
            </div>
            <div className="signout-modal-footer">
              <button className="signout-cancel-btn" onClick={cancelSignOut}>
                Cancel
              </button>
              <button className="signout-confirm-btn" onClick={confirmSignOut}>
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
