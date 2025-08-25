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
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setTotalJobs(data.length);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setImgLoaded(false);
  }, [slideIndex]);

  return (
    <>
      {/* Background Animation */}
      <div className="homepage-bg-animated">
        <div className="homepage-bg-bubble b1"></div>
        <div className="homepage-bg-bubble b2"></div>
        <div className="homepage-bg-bubble b3"></div>
        <div className="homepage-bg-bubble b4"></div>
      </div>
      {/* Main content shifted right for sidebar */}
      <div className="homepage-main-content">
        <section className="homepage-welcome-section">
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
        
        <div className="homepage-content-row">
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
              jobs.slice(0, 5).map((job) => (
                <div key={job._id} className="job-item">
                  <div className="job-item-title">{job.title}</div>
                  <div className="job-item-company">{job.company}</div>
                  <div className="job-item-location">
                    <i className="fas fa-map-marker-alt"></i> {job.location}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="homepage-stats-grid">
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
            <p className="total-jobs-count">6</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;