import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login for:', email);
      
      // Call the login API
      const userRes = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const userData = await userRes.json();
      console.log('Login response status:', userRes.status);
      console.log('Login response data:', userData);

      if (userRes.ok && userData.success) {
        // Store user information in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('userRole', 'user');
        
        console.log('User login successful, redirecting to user homepage');
        // Redirect to user homepage
        navigate('/home');
        return;
      } else {
        // Handle different types of errors with specific messages
        console.error('Login failed with status:', userRes.status);
        console.error('Error message:', userData.message);
        
        if (userData.message) {
          alert(`Login failed: ${userData.message}`);
        } else if (userRes.status === 401) {
          alert('Invalid email or password. Please check your credentials.');
        } else {
          alert('Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
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
        <h2>Login to Mangan-Vaca Job Portal</h2>
        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            autoComplete="username"
            onChange={e => setEmail(e.target.value)}
            required
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
            />
            <button
              type="button"
              className="login-showpass-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button className="login-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <div className="login-footer">
          <span>Don't have an account?</span>
          <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
}

export default Login;