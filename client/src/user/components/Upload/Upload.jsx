import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Upload.css';
import '../../../shared/styles/unified-design-system.css';

function Upload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate file size (5MB limit)
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setError('Please upload only JPG, PNG or PDF files');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create preview for images
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a file.');
      return;
    }
    if (registrationData.password !== registrationData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', registrationData.name);
    formData.append('email', registrationData.email);
    formData.append('password', registrationData.password);

    setUploading(true);
    setError(null);

    try {
// ...existing code...
const response = await axios.post('http://localhost:5000/api/admin/register', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
// ...existing code...

      if (response.data.success) {
        setSubmitted(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || 'Submission failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
      <div className="container" style={{ maxWidth: '32rem' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-secondary mb-4" 
            style={{ textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </button>
          <div className="flex flex-col items-center gap-4">
            <img src="/barangay_logo.png" alt="Barangay Logo" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
            <div>
              <h1 className="mb-2">Create Your Account</h1>
              <p>Register with credential verification for faster approval</p>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--primary-blue-light)', borderRadius: 'var(--radius-lg)', color: 'var(--primary-blue)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Credential Upload Required</span>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="mb-4" style={{ fontSize: '3rem', color: 'var(--success-color)' }}>✅</div>
              <h3 className="mb-2" style={{ color: 'var(--success-color)' }}>Successfully Submitted!</h3>
              <p className="text-sm mb-4">Your registration and credentials have been submitted for admin review.</p>
              <div className="flex items-center gap-2 justify-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                Redirecting to login...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Personal Information</h3>
                
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19A4 4 0 0 0 16 15H8A4 4 0 0 0 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Full Name
                    </div>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={registrationData.name}
                    onChange={handleRegistrationChange}
                    required
                    disabled={uploading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Email Address
                    </div>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={registrationData.email}
                    onChange={handleRegistrationChange}
                    required
                    disabled={uploading}
                  />
                </div>

                <div className="grid-layout grid-2">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Password
                      </div>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-input"
                      placeholder="Password (min 6 chars)"
                      value={registrationData.password}
                      onChange={handleRegistrationChange}
                      required
                      disabled={uploading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Confirm Password
                      </div>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input"
                      placeholder="Confirm password"
                      value={registrationData.confirmPassword}
                      onChange={handleRegistrationChange}
                      required
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              {/* Credential Upload */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Credential Upload</h3>
                
                <div className="form-group">
                  <label className="form-label">Upload Credentials</label>
                  <div 
                    className="upload-area"
                    style={{
                      border: `2px dashed ${file ? 'var(--success-color)' : 'var(--border-medium)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-6)',
                      textAlign: 'center',
                      backgroundColor: file ? 'var(--success-light)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      required
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                    
                    {file ? (
                      <div>
                        <div style={{ fontSize: '2rem', color: 'var(--success-color)', marginBottom: 'var(--space-2)' }}>✅</div>
                        <div style={{ fontWeight: '600', color: 'var(--success-color)', marginBottom: 'var(--space-1)' }}>
                          {file.name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setPreviewUrl(null);
                            setError(null);
                          }}
                        >
                          Change File
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '2rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>📄</div>
                        <div style={{ fontWeight: '600', marginBottom: 'var(--space-1)' }}>
                          Click to upload your credentials
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          PDF, JPG, or PNG • Max 5MB
                        </div>
                      </div>
                    )}
                  </div>

                  {previewUrl && file?.type.startsWith('image/') && (
                    <div className="mt-4">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '200px', 
                          borderRadius: 'var(--radius-md)', 
                          border: '1px solid var(--border-light)',
                          display: 'block',
                          margin: '0 auto'
                        }} 
                      />
                    </div>
                  )}
                </div>

                <div className="upload-info" style={{ 
                  padding: 'var(--space-3)', 
                  backgroundColor: 'var(--bg-primary)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-light)',
                  fontSize: '0.875rem'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: 'var(--space-1)', color: 'var(--text-primary)' }}>
                    📋 Acceptable Credentials:
                  </div>
                  <ul style={{ margin: '0', paddingLeft: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                    <li>Government-issued ID (Driver's License, Passport, etc.)</li>
                    <li>Professional licenses or certifications</li>
                    <li>Educational certificates or diplomas</li>
                    <li>Employment verification documents</li>
                  </ul>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger mb-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary w-full ${uploading ? 'loading' : ''}`}
                disabled={uploading}
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner"></div>
                    Submitting for Review...
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Submit Registration & Credentials
                  </div>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Info Notice */}
        <div className="flex items-center gap-2 mt-6 p-4" style={{ backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm text-muted">
            Registration with credentials typically receives faster approval. Your information and files are kept secure and confidential.
          </span>
        </div>

        {/* Alternative Registration */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted mb-2">
            Prefer to register without uploading credentials?
          </p>
          <button
            onClick={() => navigate('/user/register')}
            className="btn btn-outline btn-sm"
          >
            Register without credentials
          </button>
        </div>
      </div>
    </div>
  );
}

export default Upload;