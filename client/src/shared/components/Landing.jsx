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
    navigate('/user/login');
  };

  const handleUserRegister = () => {
    navigate('/user/register');
  };

  const handleAdminLogin = () => {
    navigate('/admin/login');
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
