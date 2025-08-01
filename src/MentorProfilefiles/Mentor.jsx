import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mentor.css';

const Mentor = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    secret_key: ''
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

    let url = '';
    let payload = {};
    const headers = { "Content-Type": "application/json" };

    if (isLogin) {
      url = "https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/mentor_signup/mentor_login";
      payload = {
        email: formData.email,
        password: formData.password,
        secret_key: formData.secret_key
      };
    } else {
      url = "https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/mentor_signup";
      payload = {
        body: {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setStatusCode(data.statusCode);
      setMessage(data.body);

      try {
        const parsedBody = JSON.parse(data.body);
        setApiMessage(parsedBody.message || "");
      } catch {
        setApiMessage(data.body || "");
      }

      if (data.statusCode === 200) {
        localStorage.setItem("email", formData.email);
        navigate(isLogin ? "/mentor_profile" : "/mentor_profile_create");
      }
    } catch {
      setError("Failed to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
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

          {isLogin && (
            <div className="form-group">
              <label>Secret Key</label>
              <input
                type="password"
                name="secret_key"
                value={formData.secret_key}
                onChange={handleInputChange}
                required
                placeholder="Enter your secret key"
              />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Create Account')}
          </button>

          {error && <div className="error-message">{error}</div>}
          {apiMessage && <div className="api-message">{apiMessage}</div>}

          <div className="helper-text">
            {isLogin ? (
              <>
                <p>Enter your credentials to log in.</p>
                <p>If you don't have an account, <button type="button" className="link-btn" onClick={() => setIsLogin(false)}>click here to sign up</button>.</p>
              </>
            ) : (
              <>
                <p>Enter your details below to create an account.</p>
                <p>If you have an account, <button type="button" className="link-btn" onClick={() => setIsLogin(true)}>click here to log in</button>.</p>
              </>
            )}
          </div>

          <div className="back-home">
            <button type="button" className="back-btn" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Mentor;
