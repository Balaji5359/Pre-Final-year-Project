import "./login.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [statusCode, setStatusCode] = useState("");
    const [message, setMessage] = useState("");
    const [apimessage, setApiMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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

    const loginUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setApiMessage("");
        
        const url = "https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/login";
        const userdata = {
            email: email,
            password: password,
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
                localStorage.setItem("email", email);
                navigate("/profiledata");
            }
        } catch (error) {
            console.log("Error", error);
            setError("Failed to connect to server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="form-container">
                    <form id="signupForm" onSubmit={loginUser}>
                        <div className="form-header">
                            <h1>Welcome Back</h1>
                            <h2>Student Login</h2>
                        </div>

                        <div className="social-signup">
                            <button type="button" className="social-btn google">
                                <i className="fab fa-google"></i> Sign in with Google
                            </button>
                            <button type="button" className="social-btn github">
                                <i className="fab fa-github"></i> Sign in with GitHub
                            </button>
                        </div>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <center>
                        <button 
                            type="submit" 
                            id="submitBtn" 
                            className="auth-btn signup-btn"
                            disabled={isLoading}
                        >
                            <span className="btn-text">{isLoading ? 'Logging in...' : 'Login'}</span>
                            {isLoading && <div className="spinner"></div>}
                        </button></center>

                        {apimessage && (
                            <div className="message-box">
                                <p className="login-link" style={{ color: "green" }}>{apimessage}</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="message-box">
                                <p className="login-link" style={{ color: "red" }}>{error}</p>
                            </div>
                        )}

                        <p className="login-link">
                            Don't have an account? <Link to="/signup">Create one</Link>
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

export default Login;