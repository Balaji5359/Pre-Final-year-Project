import React, { useState, useEffect } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [statusCode, setStatusCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Add auth-page class to body when component mounts and remove when unmounts
    useEffect(() => {
        // Reset any existing styles
        document.body.style = "";
        // Add auth-page class
        document.body.classList.add("auth-page");
        
        // Cleanup function to remove class
        return () => {
            document.body.classList.remove("auth-page");
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setApiMessage("");

        const userData = {
            body: {
                name: name,
                email: email,
                password: password
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
                localStorage.setItem("email", email);
                navigate("/profilecreation");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to connect to server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="form-container">
                    <form id="signupForm" onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h1>Welcome to Skill Route</h1>
                            <h2>Student Signup</h2>
                        </div>

                        <div className="social-signup">
                            <button type="button" className="social-btn google">
                                <i className="fab fa-google"></i> Sign up with Google
                            </button>
                            <button type="button" className="social-btn github">
                                <i className="fab fa-github"></i> Sign up with GitHub
                            </button>
                        </div>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input 
                                type="text"
                                name="name"
                                id="name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Full Name" 
                                required
                            />
                        </div>

                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email Address" 
                                required
                            />
                        </div>

                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input 
                                type="password" 
                                name="password"
                                id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            <span className="btn-text">{isLoading ? 'Creating Account...' : 'Create Account'}</span>
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

                        <p className="login-link">
                            Already have an account? <Link to="/login">Login here</Link>
                        </p>
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