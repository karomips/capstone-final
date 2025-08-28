import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../shared/styles/unified-design-system.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (token && isLoggedIn) {
      navigate('/home');
    }
  }, [navigate]);

  // Close modals on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowTermsModal(false);
        setShowPrivacyModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Manage body scroll when modals are open
  useEffect(() => {
    if (showTermsModal || showPrivacyModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showTermsModal, showPrivacyModal]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true'); // Add this for ProtectedRoute
        
        if (formData.rememberMe) {
          localStorage.setItem('rememberUser', 'true');
        }
        
        // Navigate to home page (not dashboard)
        navigate('/home');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
      <div className="container" style={{ maxWidth: '28rem' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="btn btn-secondary mb-4" style={{ textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>
          <div className="flex flex-col items-center gap-4">
            <img src="/barangay_logo.png" alt="Barangay Logo" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
            <div>
              <h1 className="mb-2">Welcome Back</h1>
              <p>Sign in to your job portal account</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {error}
              </div>
            )}

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
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="form-checkbox" 
                />
                <span className="text-sm">Remember me</span>
              </label>
              <Link to="/user/forgot-password" style={{ color: 'var(--primary-blue)', textDecoration: 'none', fontSize: '0.875rem' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="spinner"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm">
              Don't have an account?{' '}
              <Link to="/user/upload" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted">
            By signing in, you agree to our{' '}
            <button 
              className="link-btn"
              onClick={() => setShowTermsModal(true)}
              style={{ color: 'var(--primary-blue)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button 
              className="link-btn"
              onClick={() => setShowPrivacyModal(true)}
              style={{ color: 'var(--primary-blue)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Terms of Service</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowTermsModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="terms-content">
                <section>
                  <h3>1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using the Barangay Mangan-vaca Job Portal, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section>
                  <h3>2. Use License</h3>
                  <p>
                    Permission is granted to temporarily use the Barangay Mangan-vaca Job Portal for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul>
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the portal</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </section>

                <section>
                  <h3>3. User Responsibilities</h3>
                  <p>Users of the job portal agree to:</p>
                  <ul>
                    <li>Provide accurate and truthful information</li>
                    <li>Maintain the confidentiality of their account credentials</li>
                    <li>Use the portal in a lawful and respectful manner</li>
                    <li>Report any inappropriate content or behavior</li>
                  </ul>
                </section>

                <section>
                  <h3>4. Job Postings and Applications</h3>
                  <p>
                    Employers are responsible for the accuracy of job postings. Job seekers are responsible for the accuracy of their application materials. The Barangay does not guarantee employment outcomes.
                  </p>
                </section>

                <section>
                  <h3>5. Privacy and Data Protection</h3>
                  <p>
                    Personal information collected through this portal will be used solely for employment matching purposes and community development. Please refer to our Privacy Policy for detailed information.
                  </p>
                </section>

                <section>
                  <h3>6. Limitation of Liability</h3>
                  <p>
                    Barangay Mangan-vaca shall not be liable for any damages arising from the use of this portal or any employment arrangements made through it.
                  </p>
                </section>

                <section>
                  <h3>7. Contact Information</h3>
                  <p>
                    For questions about these Terms of Service, please contact the Barangay Mangan-vaca office during regular business hours.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Privacy Policy</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowPrivacyModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="privacy-content">
                <section>
                  <h3>Information We Collect</h3>
                  <p>
                    The Barangay Mangan-vaca Job Portal collects the following types of information:
                  </p>
                  <ul>
                    <li><strong>Personal Information:</strong> Name, email address, phone number, and address</li>
                    <li><strong>Professional Information:</strong> Work experience, education, skills, and employment preferences</li>
                    <li><strong>Usage Data:</strong> How you interact with our portal, including pages visited and features used</li>
                  </ul>
                </section>

                <section>
                  <h3>How We Use Your Information</h3>
                  <p>We use the collected information for:</p>
                  <ul>
                    <li>Facilitating job matching between employers and job seekers</li>
                    <li>Improving our services and user experience</li>
                    <li>Communicating important updates about the portal</li>
                    <li>Ensuring the security and integrity of our platform</li>
                    <li>Generating anonymized reports for community development</li>
                  </ul>
                </section>

                <section>
                  <h3>Information Sharing</h3>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
                  </p>
                  <ul>
                    <li>When you apply for a job, relevant information is shared with the employer</li>
                    <li>When required by law or to protect our rights</li>
                    <li>With trusted service providers who assist in operating our portal</li>
                  </ul>
                </section>

                <section>
                  <h3>Data Security</h3>
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h3>Your Rights</h3>
                  <p>You have the right to:</p>
                  <ul>
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your account and data</li>
                    <li>Opt-out of non-essential communications</li>
                    <li>Request a copy of your data</li>
                  </ul>
                </section>

                <section>
                  <h3>Cookies and Tracking</h3>
                  <p>
                    Our portal uses cookies to enhance user experience, remember preferences, and analyze usage patterns. You can control cookie settings through your browser.
                  </p>
                </section>

                <section>
                  <h3>Contact Us</h3>
                  <p>
                    If you have questions about this Privacy Policy or how we handle your data, please contact the Barangay Mangan-vaca office or email us through the portal's contact form.
                  </p>
                </section>

                <section>
                  <h3>Policy Updates</h3>
                  <p>
                    This Privacy Policy may be updated periodically. We will notify users of significant changes through the portal or via email.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;