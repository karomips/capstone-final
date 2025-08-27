import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Test backend connectivity on component mount
  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/test');
        const data = await response.json();
        console.log('Backend test:', data);
      } catch (error) {
        console.error('Backend connection failed:', error);
      }
    };
    testBackend();
  }, []);

  const handleBackToLanding = () => {
    navigate('/landing');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Admin login attempt for:', email);
      
      // Call the dedicated admin login API
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Admin login response status:', response.status);
      console.log('Admin login response data:', data);

      if (response.ok && data.success) {
        // Store admin information in localStorage
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        localStorage.setItem('userRole', 'admin');
        
        console.log('Admin login successful, redirecting to approval page');
        
        // The App component will automatically detect the localStorage change
        // and re-render to show the approval page
        
      } else {
        // Handle different types of errors with specific messages
        console.error('Admin login failed with status:', response.status);
        console.error('Error message:', data.message);
        
        if (data.message) {
          alert(`Login failed: ${data.message}`);
        } else if (response.status === 401) {
          alert('Invalid admin email or password. Please check your credentials.');
        } else {
          alert('Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Admin login error:', error);
      alert('Network error. Please check if the server is running and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background-circle"></div>
      <div className="login-logo-circle">
        <img 
          src={process.env.PUBLIC_URL + '/barangay_logo.png'} 
          alt="Barangay Logo" 
        />
      </div>
      
      <div className="login-decorative-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-header">
          <button 
            type="button"
            className="back-to-landing-btn"
            onClick={handleBackToLanding}
            disabled={isLoading}
          >
            ← Back to Landing
          </button>
        </div>
        <h2>Admin Login - Mangan-Vaca Job Portal</h2>
        <div className="login-field">
          <label htmlFor="email">Admin Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter admin email"
            value={email}
            autoComplete="username"
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <div className="login-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="login-showpass-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              disabled={isLoading}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button className="login-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login as Admin'}
        </button>
        <div className="login-footer">
          <span>For regular user access,</span>
          <a href="http://localhost:3000">go to main portal</a>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
