import React, { useState, useEffect } from 'react';
import './JobManagement.css';
import '../../../shared/styles/unified-design-system.css';

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
      <div className="main-content">
        <div className="content-wrapper">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="content-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title blue-accent">
                <span className="page-icon"></span>
                Job Management
              </h1>
              <p className="page-subtitle">Manage and monitor all job postings in the portal</p>
            </div>
          </div>
        </div>

        {/* Stats and Controls */}
        <section className="content-section">
          <h2 className="section-title blue-accent">
            <span className="section-icon"></span>
            Job Statistics
          </h2>
          <div className="grid-layout grid-2">
            <div className="stat-card">
              <div className="stat-icon blue-icon">💼</div>
              <div className="stat-number">{jobs.length}</div>
              <div className="stat-label blue-text">Total Jobs</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue-icon">🔍</div>
              <div className="stat-number">{filteredJobs.length}</div>
              <div className="stat-label blue-text">Filtered Results</div>
            </div>
          </div>
        </section>

        {/* Search and Filter Controls */}
        <section className="content-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title blue-accent">Search & Filter</h3>
            </div>
            <div className="card-content">
              <div className="grid-layout grid-2">
                <div className="form-group">
                  <label className="form-label">Search Jobs</label>
                  <input
                    type="text"
                    placeholder="Search by title or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Filter by Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="form-select"
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
          </div>
        </section>

        {/* Jobs Grid */}
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title blue-accent">
              <span className="section-icon"></span>
              Job Listings ({filteredJobs.length})
            </h2>
          </div>
          
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">No jobs found</h3>
              <p className="empty-state-description">No jobs match your current search criteria.</p>
            </div>
          ) : (
            <div className="grid-layout grid-2">
              {filteredJobs.map(job => (
                <div key={job._id} className="card">
                  <div className="card-header">
                    <div className="job-header-info">
                      <h3 className="card-title blue-text">{job.title}</h3>
                      <span className="category-badge blue-accent">{job.category}</span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <div className="job-info">
                      <div className="info-item">
                        <span className="info-icon blue-icon">🏢</span>
                        <span className="info-text">{job.company}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon blue-icon">📍</span>
                        <span className="info-text">{job.location}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon blue-icon">📅</span>
                        <span className="info-text">{new Date(job.postedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="job-description">
                      <p className="card-text">{job.description?.substring(0, 150)}...</p>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="job-actions">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleViewApplications(job)}
                      >
                        📝 Applications
                      </button>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleViewJob(job)}
                      >
                        👁️ Details
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditJob(job)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteJob(job)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Applications Modal */}
      {showApplications && (
        <div className="modal-backdrop" onClick={() => setShowApplications(false)}>
          <div className="modal applications-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title blue-accent">Applications for: {selectedJob?.title}</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowApplications(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              {applicationsLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <h3 className="empty-state-title">No Applications Yet</h3>
                  <p className="empty-state-description">No one has applied for this job position yet.</p>
                </div>
              ) : (
                <div className="applications-list">
                  {applications.map(application => (
                    <div key={application._id} className="card">
                      <div className="card-header">
                        <div className="applicant-info">
                          <h4 className="card-title blue-text">{application.fullName}</h4>
                          <p className="card-text">{application.email}</p>
                          <p className="card-text">{application.phone}</p>
                        </div>
                        <div className="application-status">
                          <select
                            value={application.status}
                            onChange={(e) => handleUpdateApplicationStatus(application._id, e.target.value)}
                            className={`form-select status-${application.status}`}
                          >
                            <option value="submitted">Submitted</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="interview">Interview</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="card-content">
                        <div className="application-meta">
                          <span className="meta-item blue-text">
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                          </span>
                          {application.hasResume && (
                            <a 
                              href={`http://localhost:5000/api/applications/${application._id}/resume`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline btn-sm"
                            >
                              📎 Download Resume
                            </a>
                          )}
                        </div>
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
              <h2 className="modal-title blue-accent">Job Details</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="content-section">
                <h3 className="section-title blue-accent">Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Job Title:</span>
                    <span className="detail-value blue-text">{viewingJob.title}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Company:</span>
                    <span className="detail-value">{viewingJob.company}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{viewingJob.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value category-badge blue-accent">{viewingJob.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Posted Date:</span>
                    <span className="detail-value">{new Date(viewingJob.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="content-section">
                <h3 className="section-title blue-accent">Job Description</h3>
                <div className="description-content">
                  <p className="card-text">{viewingJob.description}</p>
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
              <h2 className="modal-title blue-accent">Edit Job</h2>
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
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    value={editingJob.title || ''}
                    onChange={(e) => handleEditInputChange('title', e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Company *</label>
                  <input
                    type="text"
                    value={editingJob.company || ''}
                    onChange={(e) => handleEditInputChange('company', e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    value={editingJob.location || ''}
                    onChange={(e) => handleEditInputChange('location', e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Category *</label>
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
                  <label className="form-label">Description *</label>
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
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
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
              <h2 className="modal-title">Confirm Delete</h2>
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
                <h3 className="warning-title">Are you sure you want to delete this job?</h3>
                <p className="warning-details">
                  <strong className="blue-text">{deletingJob.title}</strong> at <strong>{deletingJob.company}</strong>
                </p>
                <p className="warning-text">
                  This action cannot be undone. All applications for this job will also be deleted.
                </p>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
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
    </div>
  );
}

export default JobManagement;
