import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call backend API
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/home');
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-animated">
        <div className="login-bg-bubble b1"></div>
        <div className="login-bg-bubble b2"></div>
        <div className="login-bg-bubble b3"></div>
        <div className="login-bg-bubble b4"></div>
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
        <button className="login-btn" type="submit">Login</button>
        <div className="login-footer">
          <span>Don't have an account?</span>
          <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
}

export default Login;