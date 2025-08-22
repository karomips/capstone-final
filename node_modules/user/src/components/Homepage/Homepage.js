import React, { useEffect, useState } from 'react';
import './Homepage.css';

const slides = [
  { src: '/barangay_logo.jpg', caption: 'Welcome to Barangay Mangan-vaca Job Portal' },
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

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // For fade-in effect on image change
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
              src="/barangay_logo.jpg" 
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
            {/* Slide navigation dots */}
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
          
          <div className="homepage-latestjobs-container">
            <h2>
              Latest Job Posts
              <span>
                ({jobs.length})
              </span>
            </h2>
            {loading ? (
              <div className="spinner" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80px'
              }}>
                <div className="lds-dual-ring"></div>
              </div>
            ) : jobs.length === 0 ? (
              <p>No jobs posted yet.</p>
            ) : (
              <ul>
                {jobs.slice(0, 5).map((job) => (
                  <li
                    key={job._id}
                    className="homepage-job-item"
                  >
                    <strong>{job.title}</strong> at {job.company} — {job.location}
                    <div>
                      {job.description}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;