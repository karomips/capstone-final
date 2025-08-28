import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  // Add body class for landing page and remove on cleanup
  useEffect(() => {
    document.body.classList.add('landing-page');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  const handleUserLogin = () => {
    // If we're already on user port (3000), navigate normally
    if (window.location.port === '3000' || window.location.port === '') {
      navigate('/login');
    } else {
      // If we're on admin port, redirect to user port
      window.location.href = 'http://localhost:3000/login';
    }
  };

  const handleUserRegister = () => {
    if (window.location.port === '3000' || window.location.port === '') {
      navigate('/register');
    } else {
      window.location.href = 'http://localhost:3000/register';
    }
  };

  const handleAdminLogin = () => {
    // If we're already on admin port (3001), navigate normally
    if (window.location.port === '3001') {
      navigate('/login');
    } else {
      // If we're on user port, redirect to admin port
      window.location.href = 'http://localhost:3001/login';
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to Barangay Mangan-vaca Job Portal</h1>
        <p>Find job opportunities in your community</p>
        
        <div className="user-section">
          <h3>For Job Seekers & Employers</h3>
          <div className="landing-buttons">
            <button 
              className="landing-btn user-login"
              onClick={handleUserLogin}
            >
              User Login
            </button>
            <button 
              className="landing-btn register"
              onClick={handleUserRegister}
            >
              Register
            </button>
          </div>
        </div>

        <div className="admin-section">
          <h3>For Administrators</h3>
          <div className="landing-buttons">
            <button 
              className="landing-btn admin-login"
              onClick={handleAdminLogin}
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;