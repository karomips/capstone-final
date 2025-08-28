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
    navigate('/user/register');
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
            <img src="/barangay_logo.png" alt="Barangay Logo" style={{ width: '5rem', height: '5rem' }} />
            <div>
              <h1 style={{ color: 'var(--primary-blue)', marginBottom: 'var(--space-2)' }}>Barangay Mangan-vaca</h1>
              <h2 className="mb-2">Job Portal</h2>
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
              <h2 className="modal-title">Terms of Service</h2>
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
              <div>
                <section className="mb-6">
                  <h3 className="mb-2">1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using the Barangay Mangan-vaca Job Portal, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="mb-2">2. Use License</h3>
                  <p className="mb-2">
                    Permission is granted to temporarily use the Barangay Mangan-vaca Job Portal for personal, non-commercial transitory viewing only.
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="mb-2">3. User Responsibilities</h3>
                  <p>Users of the job portal agree to provide accurate information and use the portal lawfully.</p>
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
              <h2 className="modal-title">Privacy Policy</h2>
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
              <div>
                <section className="mb-6">
                  <h3 className="mb-2">Information We Collect</h3>
                  <p>
                    The Barangay Mangan-vaca Job Portal collects personal and professional information to facilitate job matching.
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="mb-2">How We Use Your Information</h3>
                  <p>We use collected information for job matching, communication, and improving our services.</p>
                </section>

                <section className="mb-6">
                  <h3 className="mb-2">Data Security</h3>
                  <p>We implement appropriate security measures to protect your personal information.</p>
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
