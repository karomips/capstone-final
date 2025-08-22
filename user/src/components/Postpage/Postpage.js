import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Postpage.css';

function Postpage() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !company || !location || !description) return;
    const newJob = { title, company, location, description };

    // POST to backend
    fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJob),
    })
      .then(res => res.json())
      .then(addedJob => {
        // Clear form
        setTitle('');
        setCompany('');
        setLocation('');
        setDescription('');
        // Show success message
        alert('Job posted successfully!');
      })
      .catch(err => {
        alert('Failed to post job. Please try again.');
      });
  };

  const handleViewJobs = () => {
    navigate('/jobs'); // Navigate to jobs listing page
  };

  return (
    <div className="postpage-container">
      <div className="postpage-header">
        <h2>Post a Job</h2>
        <button 
          className="view-jobs-btn" 
          onClick={handleViewJobs}
        >
          View Posted Jobs
        </button>
      </div>

      <form className="postpage-form" onSubmit={handleSubmit}>
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
          <label htmlFor="company">Company</label>
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
        <div className="postpage-field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Describe the job responsibilities and requirements"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <button className="postpage-btn" type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default Postpage;