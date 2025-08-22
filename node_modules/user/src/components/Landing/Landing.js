import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to Barangay Mangan-vaca Job Portal</h1>
        <p>Find job opportunities in your community</p>
        <div className="landing-buttons">
          <button 
            className="landing-btn login"
            onClick={() => navigate('/login')}
          >
            Log in
          </button>
          <button 
            className="landing-btn register"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;