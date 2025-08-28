import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Apply.css';
import '../../styles/professional-theme.css';

function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    experience: '',
    education: '',
    resume: null
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        if (response.data.success) {
          setJob(response.data.job);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.coverLetter.trim()) errors.coverLetter = 'Cover letter is required';
    if (!formData.experience.trim()) errors.experience = 'Experience details are required';
    if (!formData.education.trim()) errors.education = 'Education details are required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call for application submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/jobs');
      }, 3000);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/jobs')}>
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="error-state">
            <div className="error-icon">🔍</div>
            <h2>Job Not Found</h2>
            <p>The job you're looking for doesn't exist or has been removed.</p>
            <button className="btn btn-primary" onClick={() => navigate('/jobs')}>
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="success-state">
            <div className="success-icon">🎉</div>
            <h2>Application Submitted Successfully!</h2>
            <p>Thank you for applying to <strong>{job.title}</strong> at <strong>{job.company}</strong>.</p>
            <p>We'll review your application and get back to you soon.</p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/jobs')}>
                Browse More Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="content-wrapper">
        {/* Background Animation */}
        <div className="apply-bg-animated">
          <div className="apply-bg-bubble b1"></div>
          <div className="apply-bg-bubble b2"></div>
          <div className="apply-bg-bubble b3"></div>
          <div className="apply-bg-bubble b4"></div>
        </div>

        <div className="apply-content">
          {!showForm ? (
            /* Job Details View */
            <div className="job-details-view professional-card">
              <div className="page-header">
                <div className="header-content">
                  <div className="header-text">
                    <h1 className="page-title">
                      <span className="page-icon">💼</span>
                      {job.title}
                    </h1>
                    <div className="job-badge professional-badge">Open Position</div>
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate('/jobs')}
                  >
                    <span className="btn-icon">🔙</span>
                    Back to Jobs
                  </button>
                </div>
              </div>

              <div className="content-section">
                <div className="job-meta-info professional-meta">
                  <div className="meta-item">
                    <span className="meta-icon">🏢</span>
                    <span className="meta-text">{job.company}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span className="meta-text">{job.location}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">💼</span>
                    <span className="meta-text">Full Time</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">💰</span>
                    <span className="meta-text">Competitive Salary</span>
                  </div>
                </div>

                <div className="job-content">
                  <div className="job-section professional-section">
                    <h2 className="section-title">
                      <span className="section-icon">📋</span>
                      Job Description
                    </h2>
                    <div className="job-description professional-text">
                      <p>{job.description}</p>
                    </div>
                  </div>

                  <div className="job-section professional-section">
                    <h2 className="section-title">
                      <span className="section-icon">✅</span>
                      Key Responsibilities
                    </h2>
                    <ul className="responsibility-list professional-list">
                      <li>Develop and maintain high-quality software applications</li>
                      <li>Collaborate with cross-functional teams to deliver projects</li>
                      <li>Participate in code reviews and maintain coding standards</li>
                      <li>Troubleshoot and debug applications</li>
                      <li>Stay updated with latest technology trends</li>
                    </ul>
                  </div>

                  <div className="job-section professional-section">
                    <h2 className="section-title">
                      <span className="section-icon">🎯</span>
                      Requirements
                    </h2>
                    <ul className="requirement-list professional-list">
                      <li>Bachelor's degree in Computer Science or related field</li>
                      <li>2+ years of experience in software development</li>
                      <li>Proficiency in relevant programming languages</li>
                      <li>Strong problem-solving and analytical skills</li>
                      <li>Excellent communication and teamwork abilities</li>
                    </ul>
                  </div>

                  <div className="job-section professional-section">
                    <h2 className="section-title">
                      <span className="section-icon">🌟</span>
                      What We Offer
                    </h2>
                    <div className="grid-layout grid-2">
                      <div className="benefit-item card">
                        <span className="benefit-icon">💰</span>
                        <h4 className="card-title">Competitive Salary</h4>
                        <p className="card-text">Industry-leading compensation package</p>
                      </div>
                      <div className="benefit-item card">
                        <span className="benefit-icon">🏥</span>
                        <h4 className="card-title">Health Benefits</h4>
                        <p className="card-text">Comprehensive medical and dental coverage</p>
                      </div>
                      <div className="benefit-item card">
                        <span className="benefit-icon">🏖️</span>
                        <h4 className="card-title">Flexible Time Off</h4>
                        <p className="card-text">Generous vacation and personal time</p>
                      </div>
                      <div className="benefit-item card">
                        <span className="benefit-icon">📚</span>
                        <h4 className="card-title">Learning & Development</h4>
                        <p className="card-text">Continuous learning opportunities</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary btn-large" onClick={() => setShowForm(true)}>
                    <span className="btn-icon">📝</span>
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Application Form */
            <div className="application-form-view">
              <div className="page-header">
                <div className="header-content">
                  <div className="header-text">
                    <h1 className="page-title">
                      <span className="page-icon">📝</span>
                      Apply for {job.title}
                    </h1>
                    <p className="page-subtitle">Please fill out the form below to submit your application</p>
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
                  >
                    <span className="btn-icon">🔙</span>
                    Back to Job Details
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="form-card">
                <div className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon">👤</span>
                    Personal Information
                  </h3>
                  
                  <div className="grid-layout grid-2">
                    <div className="form-group">
                      <label htmlFor="fullName" className="form-label">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`form-input ${formErrors.fullName ? 'error' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-input ${formErrors.email ? 'error' : ''}`}
                        placeholder="Enter your email address"
                      />
                      {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.phone ? 'error' : ''}`}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon">💼</span>
                    Professional Information
                  </h3>

                  <div className="form-group">
                    <label htmlFor="experience" className="form-label">Work Experience *</label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`form-textarea ${formErrors.experience ? 'error' : ''}`}
                      placeholder="Describe your relevant work experience..."
                      rows="4"
                    />
                    {formErrors.experience && <span className="error-text">{formErrors.experience}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="education" className="form-label">Education Background *</label>
                    <textarea
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className={`form-textarea ${formErrors.education ? 'error' : ''}`}
                      placeholder="Describe your educational background..."
                      rows="3"
                    />
                    {formErrors.education && <span className="error-text">{formErrors.education}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="resume" className="form-label">Resume/CV</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleInputChange}
                        accept=".pdf,.doc,.docx"
                      />
                      <label htmlFor="resume" className="file-upload-label">
                        <span className="file-icon">📎</span>
                        {formData.resume ? formData.resume.name : 'Choose file or drag here'}
                      </label>
                    </div>
                    <small className="form-hint">Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon">✍️</span>
                    Cover Letter
                  </h3>

                  <div className="form-group">
                    <label htmlFor="coverLetter" className="form-label">Why are you interested in this position? *</label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      className={`form-textarea ${formErrors.coverLetter ? 'error' : ''}`}
                      placeholder="Tell us why you're the perfect fit for this role..."
                      rows="6"
                    />
                    {formErrors.coverLetter && <span className="error-text">{formErrors.coverLetter}</span>}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-large" 
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="loading-spinner small"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">🚀</span>
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Apply;