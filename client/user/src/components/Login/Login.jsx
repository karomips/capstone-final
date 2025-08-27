import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.email) {
          navigate('/home');
          return;
        }
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem('user');
      }
    }

    // Load saved email if "Remember Me" was checked
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  // Test backend connectivity on component mount
  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/test');
        const data = await response.json();
        console.log('Backend test:', data);
      } catch (error) {
        console.error('Backend connection failed:', error);
        setError('Unable to connect to server. Please try again later.');
      }
    };
    testBackend();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Enhanced validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login for:', email);
      
      // Call the login API
      const userRes = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const userData = await userRes.json();
      console.log('Login response status:', userRes.status);
      console.log('Login response data:', userData);

      if (userRes.ok && userData.success) {
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Store user data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('userRole', 'user');
        
        // Show success message briefly before redirecting
        setError('');
        console.log('Login successful, redirecting to home...');
        
        // Small delay to show success state
        setTimeout(() => {
          navigate('/home');
        }, 500);
        
      } else {
        // Handle various error cases
        if (userRes.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (userRes.status === 403) {
          setError('Your account is pending approval or has been rejected.');
        } else if (userData.message) {
          setError(userData.message);
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    setError('Demo credentials loaded. Click Login to continue.');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
        
        {error && (
          <div className={`login-message ${error.includes('Demo') ? 'success' : 'error'}`}>
            {error}
          </div>
        )}

        <div className="login-field">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            autoComplete="username"
            onChange={e => setEmail(e.target.value)}
            className={error && !email.trim() ? 'error' : ''}
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
              className={error && !password.trim() ? 'error' : ''}
              required
            />
            <button
              type="button"
              className="login-showpass-btn"
              onClick={toggleShowPassword}
              tabIndex={-1}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <div className="login-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            className="demo-login-btn"
            onClick={handleDemoLogin}
          >
            Use Demo Account
          </button>
        </div>

        <button 
          className={`login-btn ${isLoading ? 'loading' : ''}`} 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="login-spinner"></div>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        <div className="login-footer">
          <span>Don't have an account?</span>
          <a href="/register">Register here</a>
        </div>
      </form>
    </div>
  );
}

export default Login;