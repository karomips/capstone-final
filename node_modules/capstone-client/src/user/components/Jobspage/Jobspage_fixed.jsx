import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Jobspage.css';

function Jobspage() {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs and categories in parallel
        const [jobsResponse, categoriesResponse] = await Promise.all([
          fetch('http://localhost:5000/api/jobs'),
          fetch('http://localhost:5000/api/jobs/categories')
        ]);

        const jobsData = await jobsResponse.json();
        let categoriesData = { success: false, categories: [] };
        
        try {
          categoriesData = await categoriesResponse.json();
        } catch (catError) {
          console.warn('Categories API failed, using defaults:', catError);
        }

        if (Array.isArray(jobsData)) {
          setJobs(jobsData);
        } else if (jobsData.success && Array.isArray(jobsData.jobs)) {
          setJobs(jobsData.jobs);
        } else {
          setJobs([]);
        }

        if (categoriesData.success && Array.isArray(categoriesData.categories)) {
          // Ensure categories are strings, not objects
          const categoryStrings = categoriesData.categories.map(cat => 
            typeof cat === 'string' ? cat : cat.name || cat.toString()
          );
          setCategories(categoryStrings);
        } else {
          // Fallback to default categories if API fails
          setCategories([
            'Technology', 'Healthcare', 'Education', 'Finance', 'Marketing', 
            'Sales', 'Construction', 'Manufacturing', 'Retail', 'Food Service',
            'Transportation', 'Administrative', 'Customer Service', 'Arts & Design',
            'Legal', 'Real Estate', 'Other'
          ]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load jobs. Please try again.');
        setJobs([]);
        // Set default categories on error
        setCategories([
          'Technology', 'Healthcare', 'Education', 'Finance', 'Marketing', 
          'Sales', 'Construction', 'Manufacturing', 'Retail', 'Food Service',
          'Transportation', 'Administrative', 'Customer Service', 'Arts & Design',
          'Legal', 'Real Estate', 'Other'
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort jobs
  const getFilteredAndSortedJobs = () => {
    let filtered = jobs.filter(job => {
      const matchesSearch = 
        (job.title && job.title.toLowerCase().includes(search.toLowerCase())) ||
        (job.company && job.company.toLowerCase().includes(search.toLowerCase())) ||
        (job.location && job.location.toLowerCase().includes(search.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(search.toLowerCase())) ||
        (job.category && job.category.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = !selectedCategory || job.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort jobs
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || b.datePosted || 0) - new Date(a.createdAt || a.datePosted || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || a.datePosted || 0) - new Date(b.createdAt || b.datePosted || 0));
        break;
      case 'title':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'company':
        filtered.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredJobs = getFilteredAndSortedJobs();

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Technology': '💻',
      'Healthcare': '🏥',
      'Education': '🎓',
      'Finance': '💰',
      'Marketing': '📈',
      'Sales': '🤝',
      'Construction': '🏗️',
      'Manufacturing': '🏭',
      'Retail': '🛍️',
      'Food Service': '🍽️',
      'Transportation': '🚛',
      'Administrative': '📋',
      'Customer Service': '📞',
      'Arts & Design': '🎨',
      'Legal': '⚖️',
      'Real Estate': '🏠',
      'Other': '💼'
    };
    return icons[categoryName] || '💼';
  };

  const handleApply = (job) => {
    navigate(`/apply/${job._id}`, { state: { job } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/home');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="jobs-modal-backdrop" onClick={handleBackdropClick}>
      <div className="jobs-modal-container">
        {/* Modal Header */}
        <div className="jobs-modal-header">
          <div className="jobs-modal-header-content">
            <h1 className="jobs-modal-title">
              <span className="jobs-title-icon">💼</span>
              Job Opportunities
            </h1>
            <p className="jobs-modal-subtitle">
              {loading ? 'Loading...' : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
          <button className="jobs-modal-close" onClick={handleCloseModal}>
            <span>&times;</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="jobs-modal-filters">
          <div className="jobs-filter-row">
            <div className="jobs-search-container">
              <input
                type="text"
                placeholder="Search jobs by title, company, location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="jobs-modal-search"
              />
              <span className="jobs-search-icon">🔍</span>
            </div>
            
            <div className="jobs-filter-controls">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="jobs-filter-select"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => {
                  // Handle both string categories and category objects
                  const categoryName = typeof category === 'string' ? category : category.name || category;
                  const categoryKey = typeof category === 'string' ? category : category.name || category._id || index;
                  
                  return (
                    <option key={categoryKey} value={categoryName}>
                      {getCategoryIcon(categoryName)} {categoryName}
                    </option>
                  );
                })}
              </select>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="jobs-filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
                <option value="company">By Company</option>
              </select>

              {(search || selectedCategory || sortBy !== 'newest') && (
                <button className="jobs-clear-filters" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="jobs-modal-content">
          {loading ? (
            <div className="jobs-loading-state">
              <div className="jobs-loading-spinner"></div>
              <h3>Loading Jobs...</h3>
              <p>Please wait while we fetch the latest job opportunities.</p>
            </div>
          ) : error ? (
            <div className="jobs-error-state">
              <div className="jobs-error-icon">⚠️</div>
              <h3>Unable to Load Jobs</h3>
              <p>{error}</p>
              <button 
                className="jobs-retry-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="jobs-modal-grid">
              {filteredJobs.map(job => (
                <div key={job._id} className="jobs-modal-card">
                  <div className="jobs-card-header">
                    <h3 className="jobs-card-title">
                      {job.title || 'Job Title'}
                    </h3>
                    <div className="jobs-card-badge">
                      {getCategoryIcon(job.category || 'Other')} {job.category || 'General'}
                    </div>
                  </div>
                  
                  <div className="jobs-card-info">
                    <p className="jobs-card-company">
                      <span className="jobs-card-icon">🏢</span>
                      {job.company || 'Unknown Company'}
                    </p>
                    <p className="jobs-card-location">
                      <span className="jobs-card-icon">📍</span>
                      {job.location || 'Unknown Location'}
                    </p>
                    <p className="jobs-card-date">
                      <span className="jobs-card-icon">📅</span>
                      {formatDate(job.createdAt || job.datePosted)}
                    </p>
                  </div>
                  
                  <p className="jobs-card-description">
                    {job.description && job.description.length > 120 
                      ? `${job.description.substring(0, 120)}...` 
                      : job.description || 'No description available.'}
                  </p>

                  {job.salary && (
                    <p className="jobs-card-salary">
                      <span className="jobs-card-icon">💰</span>
                      {job.salary}
                    </p>
                  )}

                  {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
                    <div className="jobs-card-requirements">
                      <strong>Requirements:</strong>
                      <ul>
                        {job.requirements.slice(0, 2).map((req, index) => (
                          <li key={index}>
                            {typeof req === 'string' ? req : req.description || req.name || String(req)}
                          </li>
                        ))}
                        {job.requirements.length > 2 && (
                          <li>+{job.requirements.length - 2} more...</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <button
                    className="jobs-card-apply-btn"
                    onClick={() => handleApply(job)}
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="jobs-modal-no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No Jobs Found</h3>
              <p>
                {search || selectedCategory 
                  ? 'Try adjusting your search terms or filters to find more opportunities.'
                  : 'No job listings are currently available. Check back later for new opportunities.'}
              </p>
              {(search || selectedCategory) && (
                <button className="jobs-clear-search-btn" onClick={clearFilters}>
                  Clear Search & Filters
                </button>
              )}
            </div>
          )}
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
