import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Apply.css';

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
      <div className="apply-container">
        <div className="apply-loading">
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apply-container">
        <div className="apply-error">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="apply-container">
        <div className="apply-error">
          <div className="error-icon">🔍</div>
          <h2>Job Not Found</h2>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <button className="back-btn" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="apply-container">
        <div className="success-container">
          <div className="success-icon">🎉</div>
          <h2>Application Submitted Successfully!</h2>
          <p>Thank you for applying to <strong>{job.title}</strong> at <strong>{job.company}</strong>.</p>
          <p>We'll review your application and get back to you soon.</p>
          <div className="success-actions">
            <button className="primary-btn" onClick={() => navigate('/jobs')}>
              Browse More Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-container">
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
          <div className="job-details-view">
            <div className="job-header">
              <div className="job-title-section">
                <h1>{job.title}</h1>
                <div className="job-badge">Open Position</div>
              </div>
              <div className="job-meta-info">
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
            </div>

            <div className="job-content">
              <div className="job-section">
                <h2>
                  <span className="section-icon">📋</span>
                  Job Description
                </h2>
                <div className="job-description">
                  <p>{job.description}</p>
                </div>
              </div>

              <div className="job-section">
                <h2>
                  <span className="section-icon">✅</span>
                  Key Responsibilities
                </h2>
                <ul className="responsibility-list">
                  <li>Develop and maintain high-quality software applications</li>
                  <li>Collaborate with cross-functional teams to deliver projects</li>
                  <li>Participate in code reviews and maintain coding standards</li>
                  <li>Troubleshoot and debug applications</li>
                  <li>Stay updated with latest technology trends</li>
                </ul>
              </div>

              <div className="job-section">
                <h2>
                  <span className="section-icon">🎯</span>
                  Requirements
                </h2>
                <ul className="requirement-list">
                  <li>Bachelor's degree in Computer Science or related field</li>
                  <li>2+ years of experience in software development</li>
                  <li>Proficiency in relevant programming languages</li>
                  <li>Strong problem-solving and analytical skills</li>
                  <li>Excellent communication and teamwork abilities</li>
                </ul>
              </div>

              <div className="job-section">
                <h2>
                  <span className="section-icon">🌟</span>
                  What We Offer
                </h2>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <span className="benefit-icon">💰</span>
                    <h4>Competitive Salary</h4>
                    <p>Industry-leading compensation package</p>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">🏥</span>
                    <h4>Health Benefits</h4>
                    <p>Comprehensive medical and dental coverage</p>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">🏖️</span>
                    <h4>Flexible Time Off</h4>
                    <p>Generous vacation and personal time</p>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">📚</span>
                    <h4>Learning & Development</h4>
                    <p>Continuous learning opportunities</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="back-btn" onClick={() => navigate('/jobs')}>
                <span className="btn-icon">←</span>
                Back to Jobs
              </button>
              <button className="apply-btn" onClick={() => setShowForm(true)}>
                <span className="btn-icon">📝</span>
                Apply Now
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <div className="application-form-view">
            <div className="form-header">
              <h1>Apply for {job.title}</h1>
              <p>Please fill out the form below to submit your application</p>
            </div>

            <form onSubmit={handleSubmit} className="apply-form">
              <div className="form-section">
                <h3>
                  <span className="section-icon">👤</span>
                  Personal Information
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={formErrors.fullName ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={formErrors.email ? 'error' : ''}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={formErrors.phone ? 'error' : ''}
                    placeholder="Enter your phone number"
                  />
                  {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3>
                  <span className="section-icon">💼</span>
                  Professional Information
                </h3>

                <div className="form-group">
                  <label htmlFor="experience">Work Experience *</label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={formErrors.experience ? 'error' : ''}
                    placeholder="Describe your relevant work experience..."
                    rows="4"
                  />
                  {formErrors.experience && <span className="error-text">{formErrors.experience}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="education">Education Background *</label>
                  <textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className={formErrors.education ? 'error' : ''}
                    placeholder="Describe your educational background..."
                    rows="3"
                  />
                  {formErrors.education && <span className="error-text">{formErrors.education}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="resume">Resume/CV</label>
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
                  <small>Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
                </div>
              </div>

              <div className="form-section">
                <h3>
                  <span className="section-icon">✍️</span>
                  Cover Letter
                </h3>

                <div className="form-group">
                  <label htmlFor="coverLetter">Why are you interested in this position? *</label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    className={formErrors.coverLetter ? 'error' : ''}
                    placeholder="Tell us why you're the perfect fit for this role..."
                    rows="6"
                  />
                  {formErrors.coverLetter && <span className="error-text">{formErrors.coverLetter}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  <span className="btn-icon">←</span>
                  Back to Job Details
                </button>
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="btn-spinner"></div>
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
  );
}

export default Apply;