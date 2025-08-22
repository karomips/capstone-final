import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Apply.css';

function Apply() {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [job, setJob] = useState(location.state?.job || null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!location.state?.job);

  // Fetch job details if not passed through navigation state
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!job && jobId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
          if (response.data) {
            setJob(response.data);
          } else {
            setError('Job not found');
          }
        } catch (err) {
          console.error('Error fetching job:', err);
          setError('Failed to load job details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobDetails();
  }, [job, jobId]);

  // Show loading state
  if (loading) {
    return (
      <div className="apply-container">
        <div className="apply-loading">Loading job details...</div>
      </div>
    );
  }

  // Show error state
  if (error || !job) {
    return (
      <div className="apply-container">
        <div className="apply-error">
          {error || 'Job not found'}
          <button onClick={() => navigate('/jobs')} className="back-btn">
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError('Resume file size should not exceed 5MB');
      return;
    }
    setFormData(prev => ({
      ...prev,
      resume: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        formPayload.append(key, formData[key]);
      });
      
      const response = await axios.post(`http://localhost:5000/api/applications/${job._id}`, formPayload);
      
      if (response.data.success) {
        alert('Application submitted successfully!');
        navigate('/jobs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-container">
      <div className="apply-content">
        <h1>Apply for {job.title}</h1>
        <div className="job-details">
          <h2>Job Details</h2>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Description:</strong> {job.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="apply-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume">Resume (PDF, max 5MB)</label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows="6"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/jobs')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Apply;