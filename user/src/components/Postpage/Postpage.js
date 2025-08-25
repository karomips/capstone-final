import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Postpage.css';

function Postpage() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
          <h2>Post a New Job Opportunity</h2>
          <button 
            className="view-jobs-btn" 
            onClick={handleViewJobs}
          >
            <i className="fas fa-list"></i> View All Jobs
          </button>
        </div>

        <form className="postpage-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="postpage-field">
              <label htmlFor="title">Job Title</label>
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
              <label htmlFor="company">Company/Organization</label>
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
              <label htmlFor="location">Location</label>
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

          <div className="postpage-field">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              placeholder="Describe the job responsibilities, requirements, and qualifications..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="form-actions">
            <button className="postpage-btn" type="submit">
              Post Job Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Postpage;