import React, { useState, useEffect } from 'react';
import './Dashboard.css';

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
          { id: 1, action: 'New user registration', user: 'John Doe', time: '2 minutes ago', type: 'user' },
          { id: 2, action: 'Job posting approved', user: 'Company ABC', time: '5 minutes ago', type: 'job' },
          { id: 3, action: 'Document uploaded', user: 'Jane Smith', time: '10 minutes ago', type: 'upload' },
          { id: 4, action: 'Admin registration request', user: 'Alex Johnson', time: '15 minutes ago', type: 'admin' },
          { id: 5, action: 'User approved', user: 'Maria Garcia', time: '20 minutes ago', type: 'approval' }
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
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="lds-dual-ring"></div>
        </div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* Background Animation */}
      <div className="dashboard-bg-animated">
        <div className="dashboard-bg-bubble b1"></div>
        <div className="dashboard-bg-bubble b2"></div>
        <div className="dashboard-bg-bubble b3"></div>
        <div className="dashboard-bg-bubble b4"></div>
      </div>

      <div className="dashboard-main-content">
        {/* Welcome Section */}
        <section className="dashboard-welcome-section">
          <div className="welcome-header">
            <img 
              src="/favicon.ico" 
              alt="Barangay Mangan-vaca Logo" 
              className="welcome-logo"
            />
            <div className="welcome-text">
              <h1>Admin Dashboard</h1>
              <p>Welcome back! Here's what's happening in your job portal today.</p>
              <span className="current-time">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="dashboard-stats-grid">
          <div className="dashboard-stats-container">
            <div className="stats-icon">👥</div>
            <div className="stats-content">
              <h3>Total Users</h3>
              <p className="stats-count">{stats.totalUsers}</p>
              <span className="stats-label">Registered</span>
            </div>
          </div>
          
          <div className="dashboard-stats-container pending">
            <div className="stats-icon">⏳</div>
            <div className="stats-content">
              <h3>Pending Users</h3>
              <p className="stats-count">{stats.pendingUsers}</p>
              <span className="stats-label">Awaiting Approval</span>
            </div>
          </div>
          
          <div className="dashboard-stats-container">
            <div className="stats-icon">💼</div>
            <div className="stats-content">
              <h3>Total Jobs</h3>
              <p className="stats-count">{stats.totalJobs}</p>
              <span className="stats-label">Active Listings</span>
            </div>
          </div>
          
          <div className="dashboard-stats-container">
            <div className="stats-icon">📄</div>
            <div className="stats-content">
              <h3>Pending Files</h3>
              <p className="stats-count">{stats.pendingUploads}</p>
              <span className="stats-label">To Review</span>
            </div>
          </div>
          
          <div className="dashboard-stats-container">
            <div className="stats-icon">⚡</div>
            <div className="stats-content">
              <h3>Admin Requests</h3>
              <p className="stats-count">{stats.adminRequests}</p>
              <span className="stats-label">Pending</span>
            </div>
          </div>
          
          <div className="dashboard-stats-container approved">
            <div className="stats-icon">✅</div>
            <div className="stats-content">
              <h3>Approved Users</h3>
              <p className="stats-count">{stats.approvedUsers}</p>
              <span className="stats-label">Active Members</span>
            </div>
          </div>
        </div>

        {/* Content Row */}
        <div className="dashboard-content-row">
          {/* Quick Actions */}
          <div className="dashboard-quick-actions">
            <div className="quick-actions-header">
              <h2>Quick Actions</h2>
              <span className="actions-subtitle">Common administrative tasks</span>
            </div>
            
            <div className="actions-grid">
              <button 
                className="action-card"
                onClick={() => window.location.href = '/approve'}
              >
                <div className="action-icon">✅</div>
                <div className="action-content">
                  <h3>Approve Users</h3>
                  <p>Review and approve pending user registrations</p>
                  <span className="action-badge">{stats.pendingUsers} pending</span>
                </div>
              </button>
              
              <button 
                className="action-card"
                onClick={() => window.location.href = '/jobs'}
              >
                <div className="action-icon">💼</div>
                <div className="action-content">
                  <h3>Manage Jobs</h3>
                  <p>View and manage job postings</p>
                  <span className="action-badge">{stats.totalJobs} active</span>
                </div>
              </button>
              
              <button 
                className="action-card"
                onClick={() => window.location.href = '/users'}
              >
                <div className="action-icon">👥</div>
                <div className="action-content">
                  <h3>User Management</h3>
                  <p>Manage user accounts and permissions</p>
                  <span className="action-badge">{stats.totalUsers} users</span>
                </div>
              </button>
              
              <button 
                className="action-card"
                onClick={() => window.location.href = '/reports'}
              >
                <div className="action-icon">📊</div>
                <div className="action-content">
                  <h3>View Reports</h3>
                  <p>Generate and view system reports</p>
                  <span className="action-badge">Analytics</span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-recent-activity">
            <div className="activity-header">
              <h2>Recent Activity</h2>
              <span className="activity-count">{recentActivity.length} recent</span>
            </div>
            
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div 
                    className="activity-icon"
                    style={{ backgroundColor: getActivityColor(activity.type) }}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-user">by {activity.user}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="activity-footer">
              <button className="view-all-btn">
                View All Activity
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-system-status">
          <h2>System Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Database Connection</span>
              <span className="status-text">Online</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>File Storage</span>
              <span className="status-text">Active</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Email Service</span>
              <span className="status-text">Operational</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>API Services</span>
              <span className="status-text">Running</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
