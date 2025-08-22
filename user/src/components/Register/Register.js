import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call backend API
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      // Optionally, auto-login after registration:
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ name, email }));
      navigate('/home');
    } else {
      const data = await res.json();
      alert(data.message || 'Registration failed!');
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

        <button class="upload-btn"
          type="button"
          className="register-btn"
          style={{ marginTop: '1rem', background: '#3ca55c' }}
          onClick={handleUploadClick}
        >
          Upload Credentials
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