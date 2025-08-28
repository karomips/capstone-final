import React, { useState, useEffect } from 'react';
import './Reports.css';

function Reports() {
  const [reportData, setReportData] = useState({
    totalUsers: 0,
    totalJobs: 0,
    pendingApprovals: 0,
    monthlyRegistrations: [],
    jobCategories: [],
    userStatistics: {}
  });
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Simulate fetching report data
        setTimeout(() => {
          setReportData({
            totalUsers: 127,
            totalJobs: 45,
            pendingApprovals: 8,
            monthlyRegistrations: [
              { month: 'Jan', users: 15, jobs: 8 },
              { month: 'Feb', users: 22, jobs: 12 },
              { month: 'Mar', users: 18, jobs: 6 },
              { month: 'Apr', users: 28, jobs: 10 },
              { month: 'May', users: 35, jobs: 15 },
              { month: 'Jun', users: 42, jobs: 18 }
            ],
            jobCategories: [
              { category: 'Healthcare', count: 12 },
              { category: 'Education', count: 8 },
              { category: 'Technology', count: 15 },
              { category: 'Business', count: 6 },
              { category: 'Other', count: 4 }
            ],
            userStatistics: {
              approved: 95,
              pending: 8,
              rejected: 24,
              admins: 5
            }
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const generatePDFReport = () => {
    alert('PDF report generation would be implemented here');
  };

  const exportToExcel = () => {
    alert('Excel export would be implemented here');
  };

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="loading-spinner">
          <div className="lds-dual-ring"></div>
        </div>
        <p>Generating reports...</p>
      </div>
    );
  }

  return (
    <>
      {/* Background Animation */}
      <div className="reports-bg-animated">
        <div className="reports-bg-bubble b1"></div>
        <div className="reports-bg-bubble b2"></div>
        <div className="reports-bg-bubble b3"></div>
        <div className="reports-bg-bubble b4"></div>
      </div>

      <div className="reports-main-content">
        {/* Welcome Section */}
        <section className="reports-welcome-section">
          <div className="welcome-header">
            <img 
              src="/favicon.ico" 
              alt="Reports" 
              className="welcome-logo"
            />
            <div className="welcome-text">
              <h1>Analytics & Reports</h1>
              <p>Comprehensive insights and data analysis for your job portal</p>
            </div>
            <div className="report-actions">
              <button className="export-btn pdf" onClick={generatePDFReport}>
                📄 Export PDF
              </button>
              <button className="export-btn excel" onClick={exportToExcel}>
                📊 Export Excel
              </button>
            </div>
          </div>
        </section>

        {/* Report Navigation */}
        <div className="report-nav">
          <button 
            className={`report-tab ${selectedReport === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedReport('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`report-tab ${selectedReport === 'users' ? 'active' : ''}`}
            onClick={() => setSelectedReport('users')}
          >
            👥 User Analytics
          </button>
          <button 
            className={`report-tab ${selectedReport === 'jobs' ? 'active' : ''}`}
            onClick={() => setSelectedReport('jobs')}
          >
            💼 Job Analytics
          </button>
          <button 
            className={`report-tab ${selectedReport === 'trends' ? 'active' : ''}`}
            onClick={() => setSelectedReport('trends')}
          >
            📈 Trends
          </button>
        </div>

        {/* Report Content */}
        <div className="report-content">
          {selectedReport === 'overview' && (
            <div className="overview-section">
              {/* Key Metrics */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">👥</div>
                  <div className="metric-value">{reportData.totalUsers}</div>
                  <div className="metric-label">Total Users</div>
                  <div className="metric-change positive">+12% this month</div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">💼</div>
                  <div className="metric-value">{reportData.totalJobs}</div>
                  <div className="metric-label">Total Jobs</div>
                  <div className="metric-change positive">+8% this month</div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">⏳</div>
                  <div className="metric-value">{reportData.pendingApprovals}</div>
                  <div className="metric-label">Pending Approvals</div>
                  <div className="metric-change neutral">Needs attention</div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon">✅</div>
                  <div className="metric-value">{reportData.userStatistics.approved}</div>
                  <div className="metric-label">Approved Users</div>
                  <div className="metric-change positive">+15% this month</div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="charts-section">
                <div className="chart-container">
                  <h3>Monthly Growth</h3>
                  <div className="simple-chart">
                    {reportData.monthlyRegistrations.map((data, index) => (
                      <div key={index} className="chart-bar">
                        <div 
                          className="bar users" 
                          style={{ height: `${(data.users / 50) * 100}%` }}
                          title={`${data.users} users`}
                        ></div>
                        <div 
                          className="bar jobs" 
                          style={{ height: `${(data.jobs / 20) * 100}%` }}
                          title={`${data.jobs} jobs`}
                        ></div>
                        <div className="bar-label">{data.month}</div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color users"></div>
                      <span>Users</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color jobs"></div>
                      <span>Jobs</span>
                    </div>
                  </div>
                </div>

                <div className="chart-container">
                  <h3>Job Categories Distribution</h3>
                  <div className="category-chart">
                    {reportData.jobCategories.map((category, index) => (
                      <div key={index} className="category-item">
                        <div className="category-info">
                          <span className="category-name">{category.category}</span>
                          <span className="category-count">{category.count} jobs</span>
                        </div>
                        <div className="category-bar">
                          <div 
                            className="category-fill"
                            style={{ 
                              width: `${(category.count / Math.max(...reportData.jobCategories.map(c => c.count))) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'users' && (
            <div className="users-analytics">
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>User Status Distribution</h3>
                  <div className="status-distribution">
                    <div className="status-item">
                      <div className="status-bar approved" style={{ width: '75%' }}></div>
                      <span>Approved: {reportData.userStatistics.approved}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-bar pending" style={{ width: '6%' }}></div>
                      <span>Pending: {reportData.userStatistics.pending}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-bar rejected" style={{ width: '19%' }}></div>
                      <span>Rejected: {reportData.userStatistics.rejected}</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>User Engagement</h3>
                  <div className="engagement-metrics">
                    <div className="engagement-item">
                      <span className="metric">Daily Active Users</span>
                      <span className="value">42</span>
                    </div>
                    <div className="engagement-item">
                      <span className="metric">Weekly Active Users</span>
                      <span className="value">89</span>
                    </div>
                    <div className="engagement-item">
                      <span className="metric">Average Session Duration</span>
                      <span className="value">12min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'jobs' && (
            <div className="jobs-analytics">
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Job Posting Trends</h3>
                  <div className="trend-metrics">
                    <div className="trend-item">
                      <span className="trend-label">Most Popular Category</span>
                      <span className="trend-value">Technology (15 jobs)</span>
                    </div>
                    <div className="trend-item">
                      <span className="trend-label">Average Jobs per Month</span>
                      <span className="trend-value">11.5 jobs</span>
                    </div>
                    <div className="trend-item">
                      <span className="trend-label">Job Approval Rate</span>
                      <span className="trend-value">94%</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Job Performance</h3>
                  <div className="performance-metrics">
                    <div className="performance-item">
                      <span className="performance-label">Average Views per Job</span>
                      <span className="performance-value">127</span>
                    </div>
                    <div className="performance-item">
                      <span className="performance-label">Total Applications</span>
                      <span className="performance-value">342</span>
                    </div>
                    <div className="performance-item">
                      <span className="performance-label">Application Rate</span>
                      <span className="performance-value">23%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'trends' && (
            <div className="trends-analytics">
              <div className="trend-cards">
                <div className="trend-card positive">
                  <div className="trend-icon">📈</div>
                  <div className="trend-content">
                    <h4>User Growth</h4>
                    <p>+25% increase in user registrations this quarter</p>
                    <div className="trend-percentage">+25%</div>
                  </div>
                </div>

                <div className="trend-card positive">
                  <div className="trend-icon">💼</div>
                  <div className="trend-content">
                    <h4>Job Postings</h4>
                    <p>Steady growth in job postings across all categories</p>
                    <div className="trend-percentage">+18%</div>
                  </div>
                </div>

                <div className="trend-card neutral">
                  <div className="trend-icon">⚡</div>
                  <div className="trend-content">
                    <h4>Processing Time</h4>
                    <p>Average approval time remains consistent</p>
                    <div className="trend-percentage">~2 days</div>
                  </div>
                </div>

                <div className="trend-card positive">
                  <div className="trend-icon">🎯</div>
                  <div className="trend-content">
                    <h4>Success Rate</h4>
                    <p>High approval rate for user applications</p>
                    <div className="trend-percentage">94%</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Reports;
