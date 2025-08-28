import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import '../../../shared/styles/unified-design-system.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalJobs: 0,
    pendingUploads: 0,
    adminRequests: 0,
    approvedUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch pending users
        const usersResponse = await fetch('http://localhost:5000/api/admin/users');
        const usersData = await usersResponse.json();
        const pendingUsers = usersData.success ? usersData.users.length : 0;

        // Fetch admin requests
        const adminResponse = await fetch('http://localhost:5000/api/admin/registrations');
        const adminData = await adminResponse.json();
        const adminRequests = adminData.success ? adminData.requests.length : 0;

        // Fetch uploads
        const uploadsResponse = await fetch('http://localhost:5000/api/uploads/pending');
        const uploadsData = await uploadsResponse.json();
        const pendingUploads = uploadsData.success ? uploadsData.uploads.length : 0;

        // Fetch jobs
        const jobsResponse = await fetch('http://localhost:5000/api/jobs');
        const jobsData = await jobsResponse.json();
        const totalJobs = Array.isArray(jobsData) ? jobsData.length : 0;

        // Update stats
        setStats({
          totalUsers: pendingUsers + 25, // Simulated approved users
          pendingUsers,
          totalJobs,
          pendingUploads,
          adminRequests,
          approvedUsers: 25 // Simulated approved users
        });

        // Set recent activity (simulated data)
        setRecentActivity([
          { type: 'user', description: 'New user registration', time: '2 minutes ago' },
          { type: 'job', description: 'Job posting approved', time: '15 minutes ago' },
          { type: 'upload', description: 'Document uploaded', time: '1 hour ago' },
          { type: 'approval', description: 'User account approved', time: '2 hours ago' }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return '👤';
      case 'job': return '💼';
      case 'upload': return '📄';
      case 'admin': return '⚡';
      case 'approval': return '✅';
      default: return '📋';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user': return '#42a5f5';
      case 'job': return '#66bb6a';
      case 'upload': return '#ffa726';
      case 'admin': return '#ab47bc';
      case 'approval': return '#26c6da';
      default: return '#78909c';
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="content-wrapper">
        {/* Compact Page Header */}
        <div className="page-header compact">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title blue-accent">
                <span className="page-icon">📊</span>
                Admin Dashboard
              </h1>
              <p className="page-subtitle">System overview and quick actions</p>
            </div>
            <div className="header-meta">
              <span className="current-time blue-text">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Stats Grid - Most Important Metrics Only */}
        <section className="content-section compact">
          <div className="grid-layout grid-4">
            <div className="stat-card compact">
              <div className="stat-content">
                <div className="stat-icon blue-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.totalUsers}</div>
                  <div className="stat-label blue-text">Total Users</div>
                </div>
              </div>
            </div>
            
            <div className="stat-card compact">
              <div className="stat-content">
                <div className="stat-icon blue-icon">⏳</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.pendingUsers}</div>
                  <div className="stat-label blue-text">Pending</div>
                </div>
              </div>
            </div>
            
            <div className="stat-card compact">
              <div className="stat-content">
                <div className="stat-icon blue-icon">💼</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.totalJobs}</div>
                  <div className="stat-label blue-text">Jobs</div>
                </div>
              </div>
            </div>
            
            <div className="stat-card compact">
              <div className="stat-content">
                <div className="stat-icon blue-icon">📄</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.pendingUploads + stats.adminRequests}</div>
                  <div className="stat-label blue-text">Actions Needed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Column Layout for Actions and Activity - Compact */}
        <div className="grid-layout grid-2 compact-row">
          {/* Quick Actions - Compact List */}
          <section className="content-section compact">
            <h3 className="section-title blue-accent">
              <span className="section-icon">⚡</span>
              Quick Actions
            </h3>
            
            <div className="action-list">
              <button 
                className="action-btn primary"
                onClick={() => window.location.href = '/admin/approve'}
              >
                <span className="action-icon">✅</span>
                <div className="action-text">
                  <strong>Approve Users</strong>
                  <small>{stats.pendingUsers} pending</small>
                </div>
              </button>
              
              <button 
                className="action-btn secondary"
                onClick={() => window.location.href = '/admin/jobs'}
              >
                <span className="action-icon">💼</span>
                <div className="action-text">
                  <strong>Manage Jobs</strong>
                  <small>{stats.totalJobs} total</small>
                </div>
              </button>
              
              <button 
                className="action-btn tertiary"
                onClick={() => window.location.href = '/admin/users'}
              >
                <span className="action-icon">👥</span>
                <div className="action-text">
                  <strong>User Management</strong>
                  <small>{stats.totalUsers} users</small>
                </div>
              </button>
              
              <button 
                className="action-btn tertiary"
                onClick={() => window.location.href = '/admin/reports'}
              >
                <span className="action-icon">📊</span>
                <div className="action-text">
                  <strong>View Reports</strong>
                  <small>Analytics</small>
                </div>
              </button>
            </div>
          </section>

          {/* Recent Activity - Compact */}
          <section className="content-section compact">
            <h3 className="section-title blue-accent">
              <span className="section-icon">📈</span>
              Recent Activity
            </h3>
            
            <div className="activity-list">
              {recentActivity.length === 0 ? (
                <div className="empty-activity">
                  <span className="empty-icon">📋</span>
                  <p>No recent activity</p>
                </div>
              ) : (
                recentActivity.slice(0, 4).map((activity, index) => (
                  <div key={index} className="activity-item">
                    <span className="activity-icon" style={{ color: getActivityColor(activity.type) }}>
                      {getActivityIcon(activity.type)}
                    </span>
                    <div className="activity-content">
                      <p className="activity-description">{activity.description}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* System Status - Single Row */}
        <section className="content-section compact">
          <h3 className="section-title blue-accent">
            <span className="section-icon">⚙️</span>
            System Status
          </h3>
          
          <div className="grid-layout grid-3">
            <div className="status-card">
              <div className="status-indicator online"></div>
              <div className="status-info">
                <strong>Server Status</strong>
                <span>Online</span>
              </div>
            </div>
            
            <div className="status-card">
              <div className="status-indicator good"></div>
              <div className="status-info">
                <strong>Database</strong>
                <span>Connected</span>
              </div>
            </div>
            
            <div className="status-card">
              <div className="status-indicator warning"></div>
              <div className="status-info">
                <strong>Pending Actions</strong>
                <span>{stats.pendingUsers + stats.pendingUploads + stats.adminRequests} items</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
