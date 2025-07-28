import React, { useState, useEffect } from "react";
import "./login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

function SignUp() {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.state?.showLogin || false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState("");
    const [statusCode, setStatusCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style = "";
        document.body.classList.add("auth-page");
        
        // Set login mode if coming from profile creation
        if (location.state?.showLogin) {
            setIsLogin(true);
        }
        
        return () => {
            document.body.classList.remove("auth-page");
        };
    }, [location.state]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setApiMessage("");

        if (isLogin) {
            // Login API call
            const url = "https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/login";
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
                    navigate("/profiledata");
                }
            } catch (error) {
                setError("Failed to connect to server. Please try again.");
            } finally {
                setIsLoading(false);
            }
        } else {
            // Signup API call
            const userData = {
                body: {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }
            };
            
            const url = 'https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup';
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
                    navigate("/profilecreation");
                }
            } catch (error) {
                setError("Failed to connect to server. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="form-container">
                    <form id="signupForm" onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h1>Welcome to Skill Route</h1>
                            <h2>{isLogin ? 'Student Login' : 'Student Signup'}</h2>
                            <div className="toggle-buttons">
                                {/* Swapped the order of Login and Signup buttons */}
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

                        {/* Removed Google signup/login button */}
                        {/* Info text for signup and login */}
                        {!isLogin ? (
                            <div className="info-text" style={{ marginBottom: "1rem", color: "#333", textAlign: "center" }}>
                                <div><b>Enter your details below and create one.</b></div>
                                <div style={{ marginTop: "0.5rem" }}>
                                    If you have an account, <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => setIsLogin(true)}>click here to login</span>.
                                </div>
                            </div>
                        ) : (
                            <div className="info-text" style={{ marginBottom: "1rem", color: "#333", textAlign: "center" }}>
                                <b>Enter your credentials to login.</b>
                                <br/>If you don't have an account, <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => setIsLogin(false)}>click here to signup</span>.
                            </div>
                        )}

                        <div className="divider">
                            <span>or</span>
                        </div>

                        {!isLogin && (
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input 
                                    type="text"
                                    name="name"
                                    id="name" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter Full Name" 
                                    required
                                />
                            </div>
                        )}

                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter you college email" 
                                required
                            />
                        </div>

                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input 
                                type="password" 
                                name="password"
                                id="password" 
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password" 
                                required
                            />
                            <i className="fas fa-eye-slash toggle-password"></i>
                        </div>
                        <center>
                        <button 
                            type="submit" 
                            id="submitBtn" 
                            className="auth-btn signup-btn"
                            disabled={isLoading}
                        >
                            <span className="btn-text">{isLoading ? (isLogin ? 'Logging in...' : 'Creating Account...') : (isLogin ? 'Login' : 'Create Account')}</span>
                            {isLoading && <div className="spinner"></div>}
                        </button></center>

                        {apiMessage && (
                            <div className="message-box">
                                <p className="login-link" style={{ color: "green" }}>{apiMessage}</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="message-box">
                                <p className="login-link" style={{ color: "red" }}>{error}</p>
                            </div>
                        )}

                        <br></br>
                        <center>
                        <div className="btn">
                            <Link to="/">Back to Home</Link>
                        </div></center>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;