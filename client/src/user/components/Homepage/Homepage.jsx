import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../shared/styles/unified-design-system.css';

const slides = [
  { src: '/barangay_logo.png', caption: 'Welcome to Barangay Mangan-vaca Job Portal' },
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
        // Get 6 most recent jobs
        setRecentJobs(data.slice(0, 6));
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
    <div className="page-container">
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
            Welcome to <span className="brand-highlight">Mangan-vaca</span> Job Portal
          </h1>
          <p className="hero-subtitle">
            Connecting local talent with opportunities in our community. 
            Find your next career opportunity or post job openings for qualified candidates.
          </p>
          <div className="hero-actions">
            <Link to="/user/jobs" className="btn btn-primary btn-lg">
              🔍 Browse Jobs
            </Link>
            <Link to="/user/post-job" className="btn btn-outline btn-lg">
              💼 Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="grid-layout grid-3">
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-number">{loading ? '...' : totalJobs}</div>
            <div className="stat-label">Total Jobs Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-number">{categoriesLoading ? '...' : categories.length}</div>
            <div className="stat-label">Job Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-number">1</div>
            <div className="stat-label">Community Served</div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">🆕</span>
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
          <div className="grid-layout grid-2">
            {recentJobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-header">
                  <h3 className="job-title">{job.title}</h3>
                  <span className="job-category">{job.category}</span>
                </div>
                <div className="job-content">
                  <p className="job-description">{job.description.substring(0, 150)}...</p>
                  <div className="job-details">
                    <div className="job-detail">
                      <span className="detail-icon">📍</span>
                      <span>{job.location || 'Mangan-vaca'}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-icon">💰</span>
                      <span>{job.salary || 'Negotiable'}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-icon">📅</span>
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
                  <span className="job-type">{job.type || 'Full-time'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">💼</div>
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

      {/* Categories Section */}
      <section className="content-section">
        <h2 className="section-title">
          <span className="section-icon">🏷️</span>
          Job Categories
        </h2>

        {categoriesLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid-layout grid-4">
            {categories.map((categoryObj, index) => {
              const categoryName = typeof categoryObj === 'string' ? categoryObj : categoryObj.name;
              const categoryCount = typeof categoryObj === 'object' && categoryObj.count !== undefined 
                ? categoryObj.count 
                : jobs.filter(job => job.category === categoryName).length;

              return (
                <div key={index} className="category-card">
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
                  <h3 className="category-name">{categoryName}</h3>
                  <p className="category-count">
                    {categoryCount} {categoryCount === 1 ? 'job' : 'jobs'} available
                  </p>
                  <Link 
                    to={`/user/jobs?category=${encodeURIComponent(categoryName)}`}
                    className="btn btn-outline btn-sm"
                  >
                    View Jobs
                  </Link>
                </div>
              );
            })}
          </div>
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

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Whether you're looking for your next opportunity or need to hire talented individuals, 
            our platform makes it easy to connect with the right people in your community.
          </p>
          <div className="cta-actions">
            <Link to="/user/jobs" className="btn btn-primary btn-lg">
              Find Jobs
            </Link>
            <Link to="/user/post-job" className="btn btn-secondary btn-lg">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Hero Section */
        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-8);
          align-items: center;
          margin-bottom: var(--space-12);
          padding: var(--space-8) 0;
        }

        @media (max-width: 768px) {
          .hero-section {
            grid-template-columns: 1fr;
            gap: var(--space-6);
            text-align: center;
          }
        }

        /* Carousel */
        .carousel-container {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          height: 400px;
        }

        .carousel-slides {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity var(--transition-normal);
        }

        .carousel-slide.active {
          opacity: 1;
        }

        .slide-content {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slide-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          padding: var(--space-6);
          color: var(--text-white);
        }

        .slide-title {
          font-size: var(--text-xl);
          font-weight: var(--font-semibold);
          margin: 0;
        }

        .carousel-indicators {
          position: absolute;
          bottom: var(--space-4);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: var(--space-2);
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--text-white);
          background: transparent;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .indicator.active {
          background: var(--text-white);
        }

        /* Hero Content */
        .hero-content {
          padding: var(--space-4);
        }

        .hero-title {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-4);
          line-height: var(--leading-tight);
        }

        .brand-highlight {
          color: var(--primary-blue);
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
          line-height: var(--leading-relaxed);
        }

        .hero-actions {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: var(--text-3xl);
          }
          
          .hero-actions {
            justify-content: center;
          }
        }

        /* Statistics Section */
        .stats-section {
          margin-bottom: var(--space-12);
        }

        .stat-card {
          background: var(--bg-primary);
          padding: var(--space-6);
          border-radius: var(--radius-lg);
          text-align: center;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          transition: all var(--transition-normal);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-icon {
          font-size: var(--text-4xl);
          margin-bottom: var(--space-3);
        }

        .stat-number {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--primary-blue);
          margin-bottom: var(--space-2);
        }

        .stat-label {
          font-size: var(--text-base);
          color: var(--text-secondary);
          font-weight: var(--font-medium);
        }

        /* Section Header */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        /* Job Cards */
        .job-card {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
        }

        .job-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-blue), var(--primary-blue-light));
        }

        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-blue-light);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-4);
          gap: var(--space-3);
        }

        .job-title {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0;
          flex: 1;
        }

        .job-category {
          background: var(--primary-blue-light);
          color: var(--primary-blue);
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          white-space: nowrap;
        }

        .job-description {
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-4);
        }

        .job-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }

        .job-detail {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .detail-icon {
          font-size: var(--text-base);
        }

        .job-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--space-4);
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-light);
        }

        .job-type {
          background: var(--secondary-gray-light);
          color: var(--secondary-gray);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
        }

        /* Category Cards */
        .category-card {
          background: var(--bg-primary);
          padding: var(--space-5);
          border-radius: var(--radius-lg);
          text-align: center;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          transition: all var(--transition-normal);
        }

        .category-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-blue-light);
        }

        .category-icon {
          font-size: var(--text-3xl);
          margin-bottom: var(--space-3);
        }

        .category-name {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .category-count {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
        }

        /* Call to Action Section */
        .cta-section {
          background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
          color: var(--text-white);
          padding: var(--space-12);
          border-radius: var(--radius-xl);
          text-align: center;
          margin-top: var(--space-12);
        }

        .cta-title {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          margin-bottom: var(--space-4);
        }

        .cta-description {
          font-size: var(--text-lg);
          margin-bottom: var(--space-6);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: var(--leading-relaxed);
          opacity: 0.9;
        }

        .cta-actions {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-actions .btn-secondary {
          background: var(--text-white);
          color: var(--primary-blue);
          border-color: var(--text-white);
        }

        .cta-actions .btn-secondary:hover {
          background: var(--primary-blue-light);
          border-color: var(--primary-blue-light);
        }

        @media (max-width: 640px) {
          .cta-section {
            padding: var(--space-8);
          }
          
          .cta-title {
            font-size: var(--text-2xl);
          }
        }
      `}</style>
    </div>
  );
}

export default Homepage;
