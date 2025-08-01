import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './mentor.css';

const MentorProfile = () => {
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentorData = async () => {
      setLoading(true);
      const url = 'https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/mentor_signup/mentor_data_send';
      const storedEmail = localStorage.getItem("email");

      if (!storedEmail) {
        navigate('/mentor');
        return;
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: storedEmail }),
        });

        const data = await response.json();

        if (data.statusCode === 200 && data.body) {
          const parsedData = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
          setMentorData(parsedData);
        }
      } catch (error) {
        console.error('Error fetching mentor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('email');
    navigate('/mentor');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!mentorData) {
    return <div className="loading">No mentor data found</div>;
  }

  return (
    <div className="mentor-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <h2>Mentor Dashboard</h2>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <i className="fas fa-user-circle"></i>
            </div>

            <div className="profile-info">
              <h3>{mentorData.fullname}</h3>
              <p className="expertise">{mentorData.designation}</p>
              <p className="experience">{mentorData.college}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-section">
              <h4>Personal Info</h4>
              <p><strong>Email:</strong> {mentorData.email}</p>
              <p><strong>Phone:</strong> {mentorData.phone}</p>
              <p><strong>Age:</strong> {mentorData.age}</p>
              <p><strong>Gender:</strong> {mentorData.gender}</p>
            </div>

            <div className="detail-section">
              <h4>Academic Info</h4>
              <p><strong>College:</strong> {mentorData.college}</p>
              <p><strong>Program:</strong> {mentorData.program}</p>
              <p><strong>Branch:</strong> {mentorData.branch}</p>
              <p><strong>Designation:</strong> {mentorData.designation}</p>
            </div>

            <div className="detail-section">
              <h4>Location</h4>
              <p><strong>State:</strong> {mentorData.state_of_mentor}</p>
              <p><strong>City:</strong> {mentorData.city}</p>
            </div>

            <div className="detail-section">
              <h4>Account Info</h4>
              <p><strong>Username:</strong> {mentorData.username}</p>
            </div>
          </div>

          <div className="profile-actions">
            <button className="action-btn primary">
              <i className="fas fa-calendar"></i>
              Manage Schedule
            </button>

            <button
              className="action-btn secondary"
              onClick={() => navigate('/mentor_student_tests')}
            >
              <i className="fas fa-users"></i>
              View Students Tests Data
            </button>

            <button className="action-btn secondary">
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
