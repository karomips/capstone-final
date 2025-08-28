import React, { useState, useEffect } from 'react';
import './JobManagement.css';

function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  
  // New states for job management
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/jobs');
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      setApplicationsLoading(true);
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/applications`);
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleViewApplications = (job) => {
    setSelectedJob(job);
    setShowApplications(true);
    fetchApplications(job._id);
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh applications
        fetchApplications(selectedJob._id);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Job management functions
  const handleViewJob = (job) => {
    setViewingJob(job);
    setShowViewModal(true);
  };

  const handleEditJob = (job) => {
    setEditingJob({ ...job });
    setShowEditModal(true);
  };

  const handleDeleteJob = (job) => {
    setDeletingJob(job);
    setShowDeleteModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingJob) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:5000/api/jobs/${editingJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editingJob.title,
          company: editingJob.company,
          location: editingJob.location,
          description: editingJob.description,
          category: editingJob.category
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchJobs(); // Refresh the jobs list
        setShowEditModal(false);
        setEditingJob(null);
        alert('Job updated successfully!');
      } else {
        alert('Error updating job: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Error updating job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingJob) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:5000/api/jobs/${deletingJob._id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchJobs(); // Refresh the jobs list
        setShowDeleteModal(false);
        setDeletingJob(null);
        alert('Job deleted successfully!');
      } else {
        alert('Error deleting job: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Error deleting job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditingJob(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const categories = [
    'all', 'Healthcare', 'Education', 'Administration', 'Social Services',
    'Security', 'Maintenance', 'Technology', 'Agriculture', 'Business', 'Other'
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || job.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="job-management-loading">
        <div className="loading-spinner">
          <div className="lds-dual-ring"></div>
        </div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <>
      {/* Background Animation */}
      <div className="job-management-bg-animated">
        <div className="job-management-bg-bubble b1"></div>
        <div className="job-management-bg-bubble b2"></div>
        <div className="job-management-bg-bubble b3"></div>
        <div className="job-management-bg-bubble b4"></div>
      </div>

      <div className="job-management-main-content">
        {/* Welcome Section */}
        <section className="job-management-welcome-section">
          <div className="welcome-header">
            <img 
              src="/favicon.ico" 
              alt="Job Management" 
              className="welcome-logo"
            />
            <div className="welcome-text">
              <h1>Job Management</h1>
              <p>Manage and monitor all job postings in the portal</p>
            </div>
          </div>
        </section>

        {/* Stats and Controls */}
        <div className="job-management-controls">
          <div className="job-stats">
            <div className="stat-item">
              <span className="stat-number">{jobs.length}</span>
              <span className="stat-label">Total Jobs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{filteredJobs.length}</span>
              <span className="stat-label">Filtered Results</span>
            </div>
          </div>

          <div className="search-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-box">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="jobs-grid">
          {filteredJobs.length === 0 ? (
            <div className="no-jobs">
              <div className="no-jobs-icon">📋</div>
              <h3>No jobs found</h3>
              <p>No jobs match your current search criteria.</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-header">
                  <h3 className="job-title">{job.title}</h3>
                  <span className="job-category">{job.category}</span>
                </div>
                <div className="job-info">
                  <p className="job-company">
                    <span className="info-icon">🏢</span>
                    {job.company}
                  </p>
                  <p className="job-location">
                    <span className="info-icon">📍</span>
                    {job.location}
                  </p>
                  <p className="job-date">
                    <span className="info-icon">📅</span>
                    {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="job-description">
                  {job.description?.substring(0, 150)}...
                </div>
                <div className="job-actions">
                  <button 
                    className="action-btn view"
                    onClick={() => handleViewApplications(job)}
                  >
                    View Applications
                  </button>
                  <button 
                    className="action-btn info"
                    onClick={() => handleViewJob(job)}
                  >
                    View Details
                  </button>
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditJob(job)}
                  >
                    Edit Job
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteJob(job)}
                  >
                    Delete Job
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Applications Modal */}
      {showApplications && (
        <div className="applications-modal-backdrop" onClick={() => setShowApplications(false)}>
          <div className="applications-modal" onClick={(e) => e.stopPropagation()}>
            <div className="applications-modal-header">
              <h2>Applications for: {selectedJob?.title}</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowApplications(false)}
              >
                ×
              </button>
            </div>
            
            <div className="applications-modal-content">
              {applicationsLoading ? (
                <div className="applications-loading">
                  <div className="loading-spinner">
                    <div className="lds-dual-ring"></div>
                  </div>
                  <p>Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="no-applications">
                  <div className="no-applications-icon">📝</div>
                  <h3>No Applications Yet</h3>
                  <p>No one has applied for this job position yet.</p>
                </div>
              ) : (
                <div className="applications-list">
                  {applications.map(application => (
                    <div key={application._id} className="application-card">
                      <div className="application-header">
                        <div className="applicant-info">
                          <h4>{application.fullName}</h4>
                          <p>{application.email}</p>
                          <p>{application.phone}</p>
                        </div>
                        <div className="application-status">
                          <select
                            value={application.status}
                            onChange={(e) => handleUpdateApplicationStatus(application._id, e.target.value)}
                            className={`status-select ${application.status}`}
                          >
                            <option value="submitted">Submitted</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="interview">Interview</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="application-meta">
                        <span className="applied-date">
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                        {application.hasResume && (
                          <a 
                            href={`http://localhost:5000/api/applications/${application._id}/resume`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-link"
                          >
                            📎 Download Resume
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {showViewModal && viewingJob && (
        <div className="modal-backdrop" onClick={() => setShowViewModal(false)}>
          <div className="modal job-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Job Details</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="job-detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Job Title:</label>
                    <span>{viewingJob.title}</span>
                  </div>
                  <div className="detail-item">
                    <label>Company:</label>
                    <span>{viewingJob.company}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{viewingJob.location}</span>
                  </div>
                  <div className="detail-item">
                    <label>Category:</label>
                    <span className="category-badge">{viewingJob.category}</span>
                  </div>
                  <div className="detail-item">
                    <label>Posted Date:</label>
                    <span>{new Date(viewingJob.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="job-detail-section">
                <h3>Job Description</h3>
                <div className="description-content">
                  {viewingJob.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && editingJob && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal job-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Job</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    value={editingJob.title || ''}
                    onChange={(e) => handleEditInputChange('title', e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Company *</label>
                  <input
                    type="text"
                    value={editingJob.company || ''}
                    onChange={(e) => handleEditInputChange('company', e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={editingJob.location || ''}
                    onChange={(e) => handleEditInputChange('location', e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={editingJob.category || ''}
                    onChange={(e) => handleEditInputChange('category', e.target.value)}
                    required
                    className="form-select"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={editingJob.description || ''}
                    onChange={(e) => handleEditInputChange('description', e.target.value)}
                    required
                    className="form-textarea"
                    rows="6"
                  />
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowEditModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingJob && (
        <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="delete-warning">
                <div className="warning-icon">⚠️</div>
                <h3>Are you sure you want to delete this job?</h3>
                <p><strong>{deletingJob.title}</strong> at <strong>{deletingJob.company}</strong></p>
                <p className="warning-text">
                  This action cannot be undone. All applications for this job will also be deleted.
                </p>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-danger"
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Job'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobManagement;
