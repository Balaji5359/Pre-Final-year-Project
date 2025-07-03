import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard-navbar.css";

function Login_Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Get user email from localStorage
        const email = localStorage.getItem("email");
        if (email) {
            // Extract username from email
            const name = email.split('@')[0];
            setUserName(name);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem("email");
        // Reset body styles before logout
        document.body.style = "";
        document.body.className = "";
        // Force a complete page reload to restore original home page
        window.location.href = "/";
    };


const goToProfile = () => {
    // Reset body styles before navigating to home
    document.body.style = "";
    document.body.className = "";
    // Navigate to home
    window.location.href = "/profiledata";
};



    return (
        <nav className="dashboard-navbar">
            <div className="dashboard-container">
                <div className="dashboard-logo" style={{cursor: 'pointer'}}>
                    <span className="logo-text">Skill Route</span>
                </div>
                
                <div className="mobile-menu-icon" onClick={toggleMenu}>
                    <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
                
                <div className={`dashboard-nav-links ${menuOpen ? 'active' : ''}`}>
                    

                    <div 
                        className="dashboard-nav-link"
                        onClick={() => {
                            setMenuOpen(false);
                            goToProfile();
                        }}
                        style={{cursor: 'pointer'}}
                    >
                        <i className="fas fa-home"></i> Home
                    </div>


                    <Link 
                        to="/tech-list" 
                        className="dashboard-nav-link"
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fas fa-chart-line"></i> Progress
                    </Link>
                    <Link 
                        to="/profiledata" 
                        className="dashboard-nav-link"
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fas fa-user"></i> Profile
                    </Link>
                    <Link 
                        to="/tech-selection" 
                        className="dashboard-nav-link"
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fas fa-laptop-code"></i> Fields
                    </Link>
                </div>
                
                <div className="user-menu">
                    <div className="user-info">
                        <span className="user-name">{userName || "User"}</span>
                        <div className="user-avatar">
                            <i className="fas fa-user-circle"></i>
                        </div>
                    </div>
                    <Link 
                        to="/" 
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Login_Navbar;