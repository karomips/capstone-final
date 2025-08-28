import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../shared/styles/unified-design-system.css';

function Jobspage() {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const categoriesData = await categoriesResponse.json();

        if (Array.isArray(jobsData)) {
          setJobs(jobsData);
        } else if (jobsData.success && Array.isArray(jobsData.jobs)) {
          setJobs(jobsData.jobs);
        } else {
          setJobs([]);
        }

        if (categoriesData.success && Array.isArray(categoriesData.categories)) {
          // Extract just the category names if they're objects
          const categoryNames = categoriesData.categories.map(cat => 
            typeof cat === 'string' ? cat : cat.name || cat
          );
          setCategories(categoryNames);
        } else {
          setCategories([]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load jobs. Please try again.');
        setJobs([]);
        setCategories([]);
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
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.toLowerCase().includes(search.toLowerCase()) ||
        job.location?.toLowerCase().includes(search.toLowerCase()) ||
        job.description?.toLowerCase().includes(search.toLowerCase()) ||
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
      'Technology': '',
      'Healthcare': '',
      'Education': '',
      'Finance': '',
      'Marketing': '',
      'Sales': '',
      'Construction': '',
      'Manufacturing': '',
      'Retail': '',
      'Food Service': '',
      'Transportation': '',
      'Administrative': '',
      'Customer Service': '',
      'Arts & Design': '',
      'Legal': '',
      'Real Estate': '',
      'Other': ''
    };
    return icons[categoryName] || '';
  };

  const handleApply = (job) => {
    navigate(`/apply/${job._id}`, { state: { job } });
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

  return (
    <div className="main-content">
      <div className="content-wrapper">
        {/* Jobs Header */}
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon"></span>
            Job Opportunities
          </h1>
          <p className="page-subtitle">
            {loading ? 'Loading...' : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search jobs by title, company, location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="filter-controls">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryIcon(category)} {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
                <option value="company">By Company</option>
              </select>

              {(search || selectedCategory || sortBy !== 'newest') && (
                <button className="btn btn-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="content-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <h3 className="loading-title">Loading Jobs...</h3>
              <p className="loading-text">Please wait while we fetch the latest job opportunities.</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3 className="error-title">Unable to Load Jobs</h3>
              <p className="error-text">{error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid-layout grid-2">
              {filteredJobs.map(job => (
                <div key={job._id} className="job-card">
                  <div className="job-header">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-category-badge">
                      {getCategoryIcon(job.category || 'Other')} {job.category || 'General'}
                    </div>
                  </div>
                  
                  <div className="job-content">
                    <div className="job-info">
                      <div className="job-detail">
                        <span className="detail-icon">🏢</span>
                        <span>{job.company}</span>
                      </div>
                      <div className="job-detail">
                        <span className="detail-icon">📍</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="job-detail">
                        <span className="detail-icon">📅</span>
                        <span>{formatDate(job.createdAt || job.datePosted)}</span>
                      </div>
                    </div>
                    
                    <p className="job-description">
                      {job.description && typeof job.description === 'string' && job.description.length > 120 
                        ? `${job.description.substring(0, 120)}...` 
                        : typeof job.description === 'string' 
                          ? job.description 
                          : 'No description available.'}
                    </p>

                    {job.salary && (
                      <div className="job-detail">
                        <span className="detail-icon">💰</span>
                        <span>{typeof job.salary === 'string' ? job.salary : 'Competitive salary'}</span>
                      </div>
                    )}

                    {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
                      <div className="job-requirements">
                        <strong className="requirements-title">Requirements:</strong>
                        <ul className="requirements-list">
                          {job.requirements.slice(0, 2).map((req, index) => (
                            <li key={index}>{typeof req === 'string' ? req : req.name || req.title || 'Requirement'}</li>
                          ))}
                          {job.requirements.length > 2 && (
                            <li>+{job.requirements.length - 2} more...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="job-footer">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleApply(job)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">No Jobs Found</h3>
              <p className="empty-state-description">
                {search || selectedCategory 
                  ? 'Try adjusting your search terms or filters to find more opportunities.'
                  : 'No job listings are currently available. Check back later for new opportunities.'}
              </p>
              {(search || selectedCategory) && (
                <button className="btn btn-secondary" onClick={clearFilters}>
                  Clear Search & Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobspage;
