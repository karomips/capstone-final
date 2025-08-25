import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting registration for:', email);
      
      // Call the register API
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok && data.success) {
        alert('Registration successful! Your account is pending approval. You will be able to login once an administrator approves your account.');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please check if the server is running and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    navigate('/upload');
  };

  return (
    <div className="register-container">
      <div className="register-bg-animated">
        <div className="register-bg-bubble b1"></div>
        <div className="register-bg-bubble b2"></div>
        <div className="register-bg-bubble b3"></div>
        <div className="register-bg-bubble b4"></div>
      </div>
      
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        
        <div className="register-field">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="register-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            autoComplete="username"
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="register-field">
          <label htmlFor="password">Password</label>
          <div className="register-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password (min 6 characters)"
              value={password}
              autoComplete="new-password"
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="register-showpass-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              disabled={isLoading}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="register-field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="register-password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={e => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="register-showpass-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              disabled={isLoading}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button className="register-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="register-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="register-btn secondary"
          onClick={handleUploadClick}
          disabled={isLoading}
        >
          Upload Credentials Instead
        </button>

        <div className="register-footer">
          <span>Already have an account?</span>
          <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}

export default Register;