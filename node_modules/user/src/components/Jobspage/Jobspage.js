import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Jobspage.css';

function Jobspage() {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal starts open since this is the jobs page
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch jobs
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(error => console.error('Error fetching jobs:', error));

    // Fetch categories for icon mapping
    fetch('http://localhost:5000/api/jobs/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const filteredJobs = jobs.filter(
    job =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      (job.category && job.category.toLowerCase().includes(search.toLowerCase()))
  );

  const getCategoryIcon = (categoryName) => {
    return '';
  };

  const handleApply = (job) => {
    navigate(`/apply/${job._id}`, { state: { job } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/home'); // Navigate back to homepage when closing
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="jobs-modal-backdrop" onClick={handleBackdropClick}>
      <div className="jobs-modal-container">
        {/* Modal Header */}
        <div className="jobs-modal-header">
          <h1 className="jobs-modal-title">Job Listings</h1>
          <button className="jobs-modal-close" onClick={handleCloseModal}>
            <span>&times;</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="jobs-modal-search-container">
          <input
            type="text"
            placeholder="Search jobs by title, company, location, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="jobs-modal-search"
          />
        </div>

        {/* Job Listings */}
        <div className="jobs-modal-content">
          <div className="jobs-modal-grid">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job._id} className="jobs-modal-card">
                  <div className="jobs-card-header">
                    <h3 className="jobs-card-title">{job.title}</h3>
                    {job.category ? (
                      <div className="jobs-card-badge">
                        {job.category}
                      </div>
                    ) : (
                      <div className="jobs-card-badge">General</div>
                    )}
                  </div>
                  
                  <div className="jobs-card-info">
                    <p className="jobs-card-company">
                      <span className="jobs-card-icon">🏢</span>
                      {job.company}
                    </p>
                    <p className="jobs-card-location">
                      <span className="jobs-card-icon">📍</span>
                      {job.location}
                    </p>
                  </div>
                  
                  <p className="jobs-card-description">{job.description}</p>
                  
                  <button
                    className="jobs-card-apply-btn"
                    onClick={() => handleApply(job)}
                  >
                    Apply Now
                  </button>
                </div>
              ))
            ) : (
              <div className="jobs-modal-no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No jobs found</h3>
                <p>Try adjusting your search terms or check back later for new opportunities.</p>
              </div>
            )}
          </div>
        </div>

        {/* Background Animation */}
        <div className="jobs-modal-bg-animated">
          <div className="jobs-modal-bg-bubble b1"></div>
          <div className="jobs-modal-bg-bubble b2"></div>
          <div className="jobs-modal-bg-bubble b3"></div>
          <div className="jobs-modal-bg-bubble b4"></div>
        </div>
      </div>
    </div>
  );
}

export default Jobspage;