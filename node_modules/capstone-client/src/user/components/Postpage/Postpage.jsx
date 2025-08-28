import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../shared/styles/unified-design-system.css';

function Postpage() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Job categories with icons
  const jobCategories = [
    { value: 'Healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'Education', label: 'Education', icon: '📚' },
    { value: 'Administration', label: 'Administration', icon: '📋' },
    { value: 'Social Services', label: 'Social Services', icon: '🤝' },
    { value: 'Security', label: 'Security', icon: '🛡️' },
    { value: 'Maintenance', label: 'Maintenance', icon: '🔧' },
    { value: 'Technology', label: 'Technology', icon: '💻' },
    { value: 'Agriculture', label: 'Agriculture', icon: '🌾' },
    { value: 'Business', label: 'Business', icon: '💼' },
    { value: 'Other', label: 'Other', icon: '📌' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category) {
      setIsSuccess(false);
      setPromptMessage('Please select a job category.');
      setShowPrompt(true);
      setTimeout(() => setShowPrompt(false), 3000);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          company,
          location,
          description,
          category,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setPromptMessage('Job posted successfully!');
        setShowPrompt(true);
        
        // Clear form
        setTitle('');
        setCompany('');
        setLocation('');
        setDescription('');
        setCategory('');
        
        // Hide prompt after 3 seconds
        setTimeout(() => {
          setShowPrompt(false);
        }, 3000);
      } else {
        setIsSuccess(false);
        setPromptMessage('Failed to post job. Please try again.');
        setShowPrompt(true);
      }
    } catch (error) {
      setIsSuccess(false);
      setPromptMessage('Error posting job. Please check your connection.');
      setShowPrompt(true);
    }
  };

  const handleViewJobs = () => {
    navigate('/jobs');
  };

  return (
    <div className="page-container">
      {showPrompt && (
        <div className={`notification ${isSuccess ? 'notification-success' : 'notification-error'}`}>
          <div className="notification-content">
            <div className="notification-icon">
              {isSuccess ? '✓' : '✕'}
            </div>
            <p className="notification-message">{promptMessage}</p>
          </div>
        </div>
      )}
      
      <div className="page-content">
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h2 className="page-title">Post a New Job Opportunity</h2>
              <p className="page-subtitle">Share exciting career opportunities with our community</p>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={handleViewJobs}
            >
              <span className="btn-icon">📋</span>
              View All Jobs
            </button>
          </div>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon">📝</span>
              Job Information
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title" className="form-label">Job Title *</label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Barangay Health Worker"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">Job Category *</label>
                <div className="select-wrapper">
                  <select
                    id="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    className="form-select"
                  >
                    <option value="">Select a category...</option>
                    {jobCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="company" className="form-label">Company/Organization *</label>
                <input
                  id="company"
                  type="text"
                  placeholder="e.g. Barangay Mangan-vaca Health Center"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">Location *</label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. Barangay Mangan-vaca"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon">📄</span>
              Job Details
            </h3>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">Job Description *</label>
              <textarea
                id="description"
                placeholder="Describe the job responsibilities, requirements, qualifications, and benefits..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="form-textarea"
                rows={8}
                required
              />
              <small className="form-hint">Provide a detailed description including responsibilities, requirements, and benefits</small>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary btn-large" type="submit">
              <span className="btn-icon">🚀</span>
              Post Job Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Postpage;