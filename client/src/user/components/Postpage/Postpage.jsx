import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Postpage.css';

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
    <div className="postpage-container">
      {/* Background Animation */}
      <div className="postpage-bg-animated">
        <div className="postpage-bg-bubble b1"></div>
        <div className="postpage-bg-bubble b2"></div>
        <div className="postpage-bg-bubble b3"></div>
        <div className="postpage-bg-bubble b4"></div>
      </div>

      {showPrompt && (
        <div className={`prompt-overlay ${isSuccess ? 'success' : 'error'}`}>
          <div className="prompt-box">
            <div className="prompt-icon">
              {isSuccess ? '✓' : '✕'}
            </div>
            <p>{promptMessage}</p>
          </div>
        </div>
      )}
      
      <div className="postpage-content">
        <div className="postpage-header">
          <div className="header-content">
            <div className="header-text">
              <h2>Post a New Job Opportunity</h2>
              <p>Share exciting career opportunities with our community</p>
            </div>
            <button 
              className="view-jobs-btn" 
              onClick={handleViewJobs}
            >
              <span className="btn-icon">📋</span>
              View All Jobs
            </button>
          </div>
        </div>

        <form className="postpage-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>
              <span className="section-icon">📝</span>
              Job Information
            </h3>
            
            <div className="form-grid">
              <div className="postpage-field">
                <label htmlFor="title">Job Title *</label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Barangay Health Worker"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="postpage-field">
                <label htmlFor="category">Job Category *</label>
                <div className="category-dropdown">
                  <select
                    id="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    className="category-select"
                  >
                    <option value="">Select a category...</option>
                    {jobCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                  <div className="dropdown-arrow">▼</div>
                </div>
              </div>

              <div className="postpage-field">
                <label htmlFor="company">Company/Organization *</label>
                <input
                  id="company"
                  type="text"
                  placeholder="e.g. Barangay Mangan-vaca Health Center"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  required
                />
              </div>

              <div className="postpage-field">
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. Barangay Mangan-vaca"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>
              <span className="section-icon">📄</span>
              Job Details
            </h3>
            
            <div className="postpage-field">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                placeholder="Describe the job responsibilities, requirements, qualifications, and benefits..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={8}
                required
              />
              <small>Provide a detailed description including responsibilities, requirements, and benefits</small>
            </div>
          </div>

          <div className="form-actions">
            <button className="postpage-btn" type="submit">
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