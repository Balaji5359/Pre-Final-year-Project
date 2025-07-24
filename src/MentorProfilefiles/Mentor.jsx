import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mentor.css';

const Mentor = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiMessage, setApiMessage] = useState('');
  const [statusCode, setStatusCode] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setApiMessage('');

    if (isLogin) {
      // Login API call
      const url = "https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/mentor_signup/mentor_login";
      const userdata = {
        email: formData.email,
        password: formData.password,
      };
      const headers = {
        "Content-Type": "application/json",
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(userdata),
        });
        const data = await response.json();
        setStatusCode(data.statusCode);
        setMessage(data.body);

        try {
          const parsedBody = JSON.parse(data.body);
          setApiMessage(parsedBody.message || "");
        } catch (e) {
          setApiMessage(data.body || "");
        }

        if (data.statusCode === 200) {
          localStorage.setItem("email", formData.email);
          navigate("/mentor_profile");
        }
      } catch (error) {
        setError("Failed to connect to server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Signup API call
      const url = 'https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/mentor_signup';
      const userData = {
        body: {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      };
      const headers = {
        'Content-Type': 'application/json'
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(userData),
        });
        const data = await response.json();
        setStatusCode(data.statusCode);
        setMessage(data.body);

        try {
          const parsedBody = JSON.parse(data.body);
          setApiMessage(parsedBody.message || "");
        } catch (e) {
          setApiMessage(data.body || "");
        }

        if (data.statusCode === 200) {
          localStorage.setItem("email", formData.email);
          navigate("/mentor_profile_create");
        }
      } catch (error) {
        setError("Failed to connect to server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="mentor-container">
      <div className="mentor-form-wrapper">
        <div className="mentor-form-header">
          <h2>{isLogin ? 'Mentor Login' : 'Mentor Signup'}</h2>
          <div className="toggle-buttons">
            <button
              className={isLogin ? 'active' : ''}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Login
            </button>
            <button
              className={!isLogin ? 'active' : ''}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Signup
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mentor-form">
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading
              ? (isLogin ? 'Logging in...' : 'Signing up...')
              : (isLogin ? 'Login' : 'Create Account')}
          </button>
          {error && <div className="error-message">{error}</div>}
          {apiMessage && <div className="api-message">{apiMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default Mentor;