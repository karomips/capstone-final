import React, { useState, useEffect } from 'react';
import './Messages.css';

function Messages() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.email) {
      setUser(userData);
      fetchApplications(userData.email);
    } else {
      setError('Please log in to view your applications');
      setLoading(false);
    }
  }, []);

  const fetchApplications = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/user/applications?email=${email}`);
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.applications || []);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredApplications = () => {
    if (filter === 'all') return applications;
    return applications.filter(app => app.status === filter);
  };

  const getStatusIcon = (status) => {
    const icons = {
      'submitted': '📋',
      'reviewing': '👀',
      'interview': '🤝',
      'accepted': '✅',
      'rejected': '❌'
    };
    return icons[status] || '📋';
  };

  const getStatusColor = (status) => {
    const colors = {
      'submitted': '#3498db',
      'reviewing': '#f39c12',
      'interview': '#9b59b6',
      'accepted': '#2ecc71',
      'rejected': '#e74c3c'
    };
    return colors[status] || '#3498db';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredApplications = getFilteredApplications();

  if (loading) {
    return (
      <div className="messages-bg-animated">
        <div className="messages-bg-bubble b1"></div>
        <div className="messages-bg-bubble b2"></div>
        <div className="messages-bg-bubble b3"></div>
        <div className="messages-bg-bubble b4"></div>
        
        <div className="messages-loading">
          <div className="messages-loading-spinner"></div>
          <h2>Loading Applications...</h2>
          <p>Please wait while we fetch your job applications.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messages-bg-animated">
        <div className="messages-bg-bubble b1"></div>
        <div className="messages-bg-bubble b2"></div>
        <div className="messages-bg-bubble b3"></div>
        <div className="messages-bg-bubble b4"></div>
        
        <div className="messages-error">
          <div className="messages-error-icon">⚠️</div>
          <h2>Unable to Load Applications</h2>
          <p>{error}</p>
          <button 
            className="messages-retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-bg-animated">
      <div className="messages-bg-bubble b1"></div>
      <div className="messages-bg-bubble b2"></div>
      <div className="messages-bg-bubble b3"></div>
      <div className="messages-bg-bubble b4"></div>
      
      <div className="messages-container">
        <div className="messages-header">
          <div className="messages-title-section">
            <h1>
              <span className="messages-title-icon">📬</span>
              My Job Applications
            </h1>
            <p>Track the status of your job applications</p>
          </div>
          
          <div className="messages-stats">
            <div className="stat-item">
              <span className="stat-number">{applications.length}</span>
              <span className="stat-label">Total Applications</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{applications.filter(app => app.status === 'accepted').length}</span>
              <span className="stat-label">Accepted</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{applications.filter(app => app.status === 'interview').length}</span>
              <span className="stat-label">Interviews</span>
            </div>
          </div>
        </div>

        <div className="messages-filters">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Applications ({applications.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'submitted' ? 'active' : ''}`}
              onClick={() => setFilter('submitted')}
            >
              📋 Submitted ({applications.filter(app => app.status === 'submitted').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'reviewing' ? 'active' : ''}`}
              onClick={() => setFilter('reviewing')}
            >
              👀 Under Review ({applications.filter(app => app.status === 'reviewing').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'interview' ? 'active' : ''}`}
              onClick={() => setFilter('interview')}
            >
              🤝 Interview ({applications.filter(app => app.status === 'interview').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
              onClick={() => setFilter('accepted')}
            >
              ✅ Accepted ({applications.filter(app => app.status === 'accepted').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              ❌ Rejected ({applications.filter(app => app.status === 'rejected').length})
            </button>
          </div>
        </div>

        <div className="messages-content">
          {filteredApplications.length === 0 ? (
            <div className="messages-empty">
              <div className="empty-icon">
                {filter === 'all' ? '📭' : getStatusIcon(filter)}
              </div>
              <h3>
                {filter === 'all' 
                  ? 'No Applications Yet' 
                  : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Applications`}
              </h3>
              <p>
                {filter === 'all' 
                  ? "You haven't applied for any jobs yet. Browse our job listings and start applying!"
                  : `You don't have any applications with ${filter} status.`}
              </p>
              {filter === 'all' && (
                <button 
                  className="browse-jobs-btn"
                  onClick={() => window.location.href = '/jobs'}
                >
                  Browse Jobs
                </button>
              )}
            </div>
          ) : (
            <div className="applications-grid">
              {filteredApplications.map(application => (
                <div key={application._id} className="application-card">
                  <div className="application-header">
                    <div className="job-info">
                      <h3 className="job-title">{application.job?.title}</h3>
                      <p className="company-name">
                        <span className="company-icon">🏢</span>
                        {application.job?.company}
                      </p>
                      <p className="job-location">
                        <span className="location-icon">📍</span>
                        {application.job?.location}
                      </p>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(application.status) }}
                    >
                      <span className="status-icon">{getStatusIcon(application.status)}</span>
                      <span className="status-text">
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="application-meta">
                    <div className="meta-row">
                      <span className="meta-label">Applied on:</span>
                      <span className="meta-value">{formatDate(application.appliedDate)}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Application ID:</span>
                      <span className="meta-value application-id">
                        {application._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="application-actions">
                    {application.status === 'interview' && (
                      <div className="interview-notice">
                        <span className="notice-icon">🎉</span>
                        <span>Congratulations! You've been invited for an interview.</span>
                      </div>
                    )}
                    {application.status === 'accepted' && (
                      <div className="accepted-notice">
                        <span className="notice-icon">🎊</span>
                        <span>Congratulations! Your application has been accepted.</span>
                      </div>
                    )}
                    {application.status === 'rejected' && (
                      <div className="rejected-notice">
                        <span className="notice-icon">💼</span>
                        <span>Keep trying! There are many opportunities ahead.</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
