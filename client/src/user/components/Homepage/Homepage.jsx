import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import '../../../shared/styles/unified-design-system.css';

const slides = [
  { src: '/barangay_logo.png', caption: 'Welcome to WorkNest: A Mangan-vaca Job Portal' },
  { src: '/tasktracker.png', caption: 'Find jobs in your community!' },
  { src: '/slide3.png', caption: 'Post your job openings easily.' },
  { src: '/gcccsaco.png', caption: 'Stay updated with the latest opportunities.' },
  { src: '/weatherapp.png', caption: 'Connect with employers and applicants.' },
];

function Homepage() {
  const [jobs, setJobs] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);

  // Fetch jobs data
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setTotalJobs(data.length);
        // Get 3 most recent jobs for compact view
        setRecentJobs(data.slice(0, 3));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  }, []);

  // Fetch categories
  useEffect(() => {
    setCategoriesLoading(true);
    fetch('http://localhost:5000/api/jobs/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.categories);
        }
        setCategoriesLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setCategoriesLoading(false);
      });
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = (index) => {
    setSlideIndex(index);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="main-content">
      <div className="content-wrapper">
        {/* Hero Section with Carousel */}
        <section className="hero-section">
          <div className="carousel-container">
            <div className="carousel-slides">
              {slides.map((slide, index) => (
                <div 
                  key={index}
                  className={`carousel-slide ${index === slideIndex ? 'active' : ''}`}
                >
                  <div className="slide-content">
                    <img 
                      src={slide.src} 
                      alt={slide.caption}
                      className="slide-image"
                    />
                    <div className="slide-overlay">
                      <h2 className="slide-title">{slide.caption}</h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Controls */}
            <div className="carousel-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === slideIndex ? 'active' : ''}`}
                  onClick={() => handleSlideChange(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Hero Content */}
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="brand-highlight">WorkNest</span>: A Mangan-vaca Job Portal
            </h1>
            <p className="hero-subtitle">
              Connecting local talent with opportunities in our community. 
              Find your next career opportunity or post job openings for qualified candidates.
            </p>
            <div className="hero-actions">
              <Link to="/user/jobs" className="btn btn-primary btn-lg">
                Browse Jobs
              </Link>
              <Link to="/user/post-job" className="btn btn-outline btn-lg">
                Post a Job
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="stats-section">
          <div className="grid-layout grid-3">
            <div className="stat-card">
              <div className="stat-icon"></div>
              <div className="stat-number">{loading ? '...' : totalJobs}</div>
              <div className="stat-label blue-text">Total Jobs Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"></div>
              <div className="stat-number">{categoriesLoading ? '...' : categories.length}</div>
              <div className="stat-label blue-text">Job Categories</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"></div>
              <div className="stat-number">1</div>
              <div className="stat-label blue-text">Community Served</div>
            </div>
          </div>
        </section>

        {/* Recent Jobs Section */}
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title blue-accent">
              <span className="section-icon"></span>
              Recent Job Opportunities
            </h2>
            <Link to="/user/jobs" className="btn btn-outline">
              View All Jobs →
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading recent jobs...</p>
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="grid-layout grid-3">
              {recentJobs.map((job) => (
                <div key={job._id} className="job-card compact">
                  <div className="job-header">
                    <h3 className="job-title blue-text">{job.title}</h3>
                    <span className="job-category">{job.category}</span>
                  </div>
                  <div className="job-content">
                    <p className="job-description">{job.description.substring(0, 100)}...</p>
                    <div className="job-details compact">
                      <div className="job-detail">
                        <span className="detail-icon blue-icon">📍</span>
                        <span>{job.location || 'Mangan-vaca'}</span>
                      </div>
                      <div className="job-detail">
                        <span className="detail-icon blue-icon">📅</span>
                        <span>Posted {formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="job-footer">
                    <Link 
                      to={`/user/apply/${job._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"></div>
              <h3 className="empty-state-title">No Jobs Available</h3>
              <p className="empty-state-description">
                There are currently no job postings available. Check back later or be the first to post a job!
              </p>
              <Link to="/user/post-job" className="btn btn-primary">
                Post the First Job
              </Link>
            </div>
          )}
        </section>

        {/* Categories Section - Compact */}
        <section className="content-section compact">
          <h2 className="section-title blue-accent">
            <span className="section-icon"></span>
            Popular Categories
          </h2>

          {categoriesLoading ? (
            <div className="loading-container compact">
              <div className="loading-spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            <>
              <div className="grid-layout grid-4">
                {categories.slice(0, 4).map((categoryObj, index) => {
                  const categoryName = typeof categoryObj === 'string' ? categoryObj : categoryObj.name;
                  const categoryCount = typeof categoryObj === 'object' && categoryObj.count !== undefined 
                    ? categoryObj.count 
                    : jobs.filter(job => job.category === categoryName).length;

                  return (
                    <div key={index} className="category-card compact">
                      <div className="category-icon">
                        {categoryName === 'Technology' && '💻'}
                        {categoryName === 'Healthcare' && '🏥'}
                        {categoryName === 'Education' && '🎓'}
                        {categoryName === 'Retail' && '🛒'}
                        {categoryName === 'Construction' && '🏗️'}
                        {categoryName === 'Food Service' && '🍽️'}
                        {categoryName === 'Transportation' && '🚗'}
                        {categoryName === 'Administrative' && '📋'}
                        {!['Technology', 'Healthcare', 'Education', 'Retail', 'Construction', 'Food Service', 'Transportation', 'Administrative'].includes(categoryName) && '💼'}
                      </div>
                      <h3 className="category-name blue-text">{categoryName}</h3>
                      <p className="category-count">
                        {categoryCount} {categoryCount === 1 ? 'job' : 'jobs'}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="text-center" style={{ marginTop: 'var(--space-4)' }}>
                <Link to="/user/jobs" className="btn btn-outline">
                  View All Categories →
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏷️</div>
              <h3 className="empty-state-title">No Categories Yet</h3>
              <p className="empty-state-description">
                Job categories will appear here once employers start posting jobs.
              </p>
            </div>
          )}
        </section>

        {/* Call to Action Section - Compact */}
        <section className="cta-section compact">
          <div className="cta-content">
            <h2 className="cta-title">Get Started Today!</h2>
            <p className="cta-description">
              Find your next opportunity or post a job opening in our community.
            </p>
            <div className="cta-actions">
              <Link to="/user/jobs" className="btn btn-primary">
                Browse Jobs
              </Link>
              <Link to="/user/post-job" className="btn btn-secondary">
                Post a Job
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Homepage;
