import React, { useEffect, useState } from 'react';
import './Homepage.css';

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
  const [jobSlideIndex, setJobSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setTotalJobs(data.length);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  }, []);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Job slideshow auto-rotation
  useEffect(() => {
    if (jobs.length > 0) {
      const interval = setInterval(() => {
        setJobSlideIndex((prev) => (prev + 1) % Math.min(jobs.length, 5));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [jobs.length]);

  useEffect(() => {
    setImgLoaded(false);
  }, [slideIndex]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      setScrollProgress(progress);
      setShowScrollTop(scrolled > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Scroll wheel functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress-container">
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <span className="scroll-icon">↑</span>
        </button>
      )}

      {/* Background Animation */}
      <div className="homepage-bg-animated">
        <div className="homepage-bg-bubble b1"></div>
        <div className="homepage-bg-bubble b2"></div>
        <div className="homepage-bg-bubble b3"></div>
        <div className="homepage-bg-bubble b4"></div>
      </div>
      {/* Main content shifted right for sidebar */}
      <div className="homepage-main-content">
        <section className="homepage-welcome-section" id="welcome-section">
          <div className="welcome-header">
            <img 
              src="/barangay_logo.png" 
              alt="Barangay Mangan-vaca Logo" 
              className="welcome-logo"
            />
            <div className="welcome-text">
              <h1>Welcome to Barangay Mangan-vaca Job Portal</h1>
              <p>Find the latest job opportunities in our community</p>
            </div>
          </div>
        </section>
        
        <div className="homepage-content-row" id="slideshow-section">
          <div className="homepage-slideshow">
            <img
              src={slides[slideIndex].src}
              alt={slides[slideIndex].caption}
              className={`homepage-banner ${imgLoaded ? 'fade-in' : ''}`}
              onLoad={() => setImgLoaded(true)}
            />
            <div className="homepage-slide-caption">
              {slides[slideIndex].caption}
            </div>
            <div className="homepage-slide-dots">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={idx === slideIndex ? 'active' : ''}
                />
              ))}
            </div>
          </div>
          
          <div className="latest-jobs-container">
            <div className="latest-jobs-header">
              <h2>Latest Job Posts</h2>
              <span className="latest-jobs-count">{jobs.length}</span>
            </div>
            
            {loading ? (
              <div className="spinner">
                <div className="lds-dual-ring"></div>
              </div>
            ) : jobs.length === 0 ? (
              <p>No jobs available at the moment</p>
            ) : (
              <div className="jobs-slideshow">
                <div className="job-slide-container">
                  {jobs.slice(0, 5).map((job, index) => (
                    <div 
                      key={job._id} 
                      className={`job-item ${index === jobSlideIndex ? 'active' : ''}`}
                      style={{ display: index === jobSlideIndex ? 'block' : 'none' }}
                    >
                      <div className="job-item-header">
                        <div className="job-item-title">{job.title}</div>
                        {job.category && (
                          <span className="job-item-category">
                            {job.category}
                          </span>
                        )}
                      </div>
                      <div className="job-item-company">{job.company}</div>
                      <div className="job-item-location">
                        <i className="fas fa-map-marker-alt"></i> {job.location}
                      </div>
                      <div className="job-item-description">{job.description}</div>
                    </div>
                  ))}
                </div>
                
                {/* Job Slide Dots */}
                <div className="job-slide-dots">
                  {jobs.slice(0, 5).map((_, idx) => (
                    <span
                      key={idx}
                      onClick={() => setJobSlideIndex(idx)}
                      className={idx === jobSlideIndex ? 'active' : ''}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Categories Section */}
        <div className="job-categories-section" id="categories-section">
          <div className="categories-header">
            <h2>
              <span className="section-icon"></span>
              Job Categories
            </h2>
            <p>Explore opportunities by category</p>
          </div>
          
          {categoriesLoading ? (
            <div className="categories-loading">
              <div className="loading-spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category.name} className="category-card">
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                  <div className="category-count">
                    <span className="count-number">{category.count}</span>
                    <span className="count-label">
                      {category.count === 1 ? 'job' : 'jobs'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="homepage-stats-grid" id="stats-section">
          <div className="homepage-totaljobs-container">
            <h2>Total Available Jobs</h2>
            <p className="total-jobs-count">{totalJobs}</p>
          </div>
          
          <div className="homepage-totaljobs-container">
            <h2>Active Applications</h2>
            <p className="total-jobs-count">24</p>
          </div>
          
          <div className="homepage-totaljobs-container">
            <h2>Companies Hiring</h2>
            <p className="total-jobs-count">12</p>
          </div>
          
          <div className="homepage-totaljobs-container">
            <h2>Jobs This Month</h2>
            <p className="total-jobs-count">8</p>
          </div>
          
          <div className="homepage-totaljobs-container">
            <h2>Successful Placements</h2>
            <p className="total-jobs-count">45</p>
          </div>
          
          <div className="homepage-totaljobs-container">
            <h2>Job Categories</h2>
            <p className="total-jobs-count">{categories.filter(cat => cat.count > 0).length}</p>
          </div>
        </div>

        {/* Extra content to ensure scrolling */}
        <div style={{ height: '50vh', padding: '2rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
            borderRadius: '16px', 
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>Ready to Find Your Next Opportunity?</h3>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Join our community of job seekers and employers. Post your resume, apply for jobs, or find the perfect candidate for your business.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;