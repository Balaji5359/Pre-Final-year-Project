import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mentor.css';
import "/src/StudentProfileFiles/profile_pages.css"

const MentorProfileCreate = () => {
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    gender: '',
    email: '',
    phone: '',
    age: '',
    college: '',
    program: '',
    branch: '',
    designation: '',
    state: '',
    city: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/mentor_signup/mentor-profile-data'

    // Map form fields to API fields
    const data = {
      username: form.username,
      fullname: form.fullname,
      gender: form.gender,
      email: form.email,
      phone: form.phone,
      age: form.age,
      college: form.college,
      program: form.program,
      branch: form.branch,
      designation: form.designation,
      state_of_mentor: form.state,
      city: form.city
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      console.log('API Response:', responseData);
      
      if (response.status === 200 && responseData.statusCode === 200) {
        setMessage("Profile Created Successfully");
        setTimeout(() => {
          navigate("/mentor");
        }, 1000);
      } else {
        setMessage(responseData.body || "Failed to create profile");
      }
    } catch (error) {
      setMessage("Error occurred");
      console.log('Error:', error);
    }
  };
  
  return (
    <div className="profile-creation-container">
      <div className="profile-header">
        <div className="profile-icon">
          <i className="fas fa-user-graduate"></i>
        </div>
        <h1>Create Mentor Profile</h1>
      </div>
      <form className="profile-form" onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div className="profile-section">
          <h2 className="section-title">Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                required
                value={form.fullname}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              className="gender-select"
              required
              value={form.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                required
                value={form.age}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        {/* Academic Information Section */}
        <div className="profile-section">
          <h2 className="section-title">Academic Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="college">College Name</label>
              <input
                type="text"
                id="college"
                name="college"
                required
                value={form.college}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="program">Program</label>
              <select
                id="program"
                name="program"
                required
                value={form.program}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Program
                </option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="branch">Branch</label>
              <select
                id="branch"
                name="branch"
                required
                value={form.branch}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Branch
                </option>
                <option value="CSE">Computer Science</option>
                <option value="CST">Computer Science and Technology</option>
                <option value="ECE">Electronics</option>
                <option value="ME">Mechanical</option>
                <option value="CE">Civil</option>
                <option value="EE">Electrical</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="designation">Designation</label>
              <select
                id="designation"
                name="designation"
                required
                value={form.designation}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Designation
                </option>
                <option value="HOD">Head of Department</option>
                <option value="Professor">Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Placement Coordinator">Placement Coordinator</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <select
                id="state"
                name="state"
                required
                value={form.state}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select State
                </option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={form.city}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            <i className="fas fa-user-plus"></i>
            Create Profile
          </button>
          {message && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default MentorProfileCreate;
