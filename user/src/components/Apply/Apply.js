import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Apply.css';

function Apply() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        if (response.data.success) {
          setJob(response.data.job);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!job) return <div className="error">Job not found</div>;

  return (
    <div className="apply-container">
      <div className="job-details">
        <h1>{job.title}</h1>
        <div className="job-meta">
          <span>{job.company}</span>
          <span>{job.location}</span>
        </div>
        <div className="job-description">
          <h2>Job Description</h2>
          <p>{job.description}</p>
        </div>
        {/* Add your application form here */}
      </div>
    </div>
  );
}

export default Apply;