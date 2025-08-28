import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Add body class for landing page and remove on cleanup
  useEffect(() => {
    document.body.classList.add('landing-page');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

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

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showTermsModal, showPrivacyModal]);

  const handleUserLogin = () => {
    navigate('/user/login');
  };

  const handleUserRegister = () => {
    navigate('/user/upload');
  };

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header Section */}
      <header style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex items-center gap-4">
              <img src="/barangay_logo.png" alt="Barangay Logo" style={{ width: '5rem', height: '5rem' }} />
              <img src="/worknest.png" alt="WorkNest Logo" style={{ width: '5rem', height: '5rem' }} />
            </div>
            <div>
              <h1 style={{ color: 'var(--primary-blue)', marginBottom: 'var(--space-2)' }}>WorkNest</h1>
              <h2 className="mb-2">Barangay Mangan-vaca Job Portal</h2>
              <p>Connecting opportunities within our community</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', gap: 'var(--space-8)', maxWidth: '60rem', margin: '0 auto' }}>
            {/* User Access Card */}
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--primary-blue)', marginBottom: 'var(--space-4)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="card-title mb-4">Job Seekers & Employers</h3>
              <p className="mb-6">
                Find your next opportunity or discover talented individuals in our community
              </p>
              <div className="mb-6" style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <div className="flex items-center gap-2">
                  <span>🔍</span>
                  <span className="text-sm">Browse Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📝</span>
                  <span className="text-sm">Apply Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💼</span>
                  <span className="text-sm">Post Opportunities</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📊</span>
                  <span className="text-sm">Track Applications</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleUserLogin}
                  className="btn btn-primary w-full"
                >
                  Sign In
                </button>
                <button
                  onClick={handleUserRegister}
                  className="btn btn-secondary w-full"
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Admin Access Card */}
            <div className="card" style={{ textAlign: 'center', borderColor: 'var(--primary-blue-light)', backgroundColor: 'var(--primary-blue-light)' }}>
              <div style={{ color: 'var(--primary-blue)', marginBottom: 'var(--space-4)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                  <path d="M12 1L3 5L12 9L21 5L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 17L12 21L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 12L12 16L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="card-title mb-4" style={{ color: 'var(--primary-blue)' }}>Administrator Panel</h3>
              <p className="mb-6" style={{ color: 'var(--primary-blue-dark)' }}>
                Secure access for system administrators to manage the job portal
              </p>
              <div className="mb-6" style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <div className="flex items-center gap-2" style={{ color: 'var(--primary-blue-dark)' }}>
                  <span>👥</span>
                  <span className="text-sm">Manage Users</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'var(--primary-blue-dark)' }}>
                  <span>📋</span>
                  <span className="text-sm">Review Applications</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'var(--primary-blue-dark)' }}>
                  <span>📈</span>
                  <span className="text-sm">Analytics & Reports</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'var(--primary-blue-dark)' }}>
                  <span>⚙️</span>
                  <span className="text-sm">System Settings</span>
                </div>
              </div>
              <button
                onClick={handleAdminLogin}
                className="btn btn-primary w-full"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-light)', padding: 'var(--space-8) 0' }}>
        <div className="container text-center">
          <p className="mb-4">
            By using this portal, you agree to our{' '}
            <button 
              onClick={() => setShowTermsModal(true)}
              style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button 
              onClick={() => setShowPrivacyModal(true)}
              style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Privacy Policy
            </button>
          </p>
          <p className="text-sm text-muted">
            © 2025 Barangay Mangan-vaca Job Portal. All rights reserved.
          </p>
        </div>
      </footer>

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

export default Landing;
