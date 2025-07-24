import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./main.css";
import logo from "../assets/logo.png";

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Reset any body styles that might have been set by other components
    useEffect(() => {
        document.body.style = "";
        document.body.className = "";
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Smooth scroll function
    const scrollToSection = (sectionId) => {
        setMenuOpen(false);
        
        if (location.pathname !== '/') {
            // If not on home page, navigate to home and then scroll
            window.location.href = `/#${sectionId}`;
            return;
        }
        
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 80, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className={`${scrolled ? "scrolled" : ""}`} style={{ 
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
            height: '80px',
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="header-div">
                <div className="logo-section">
                    <img 
                        src={logo}
                        style={{ width: "60px", height: "50px", borderRadius: "8px" }}
                        alt="Skill Route Logo"
                        className="logo-image"
                    />
                    <Link to="/" className="logo">
                        <h2 className="logo-text">Skill Route</h2>
                    </Link>
                </div>
                
                <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <a 
                        href="#welcome-section"
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('welcome-section');
                        }}
                    >
                        <i className="fas fa-home"></i> Home
                    </a>
                    <a 
                        href="#about-section"
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('about-section');
                        }}
                    >
                        <i className="fas fa-info-circle"></i> About Us
                    </a>
                    <a 
                        href="#highlights-section"
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('highlights-section');
                        }}
                    >
                        <i className="fas fa-star"></i> Highlights
                    </a>
                    <a 
                        href="#contact-sec"
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('contact-sec');
                        }}
                    >
                        <i className="fas fa-envelope"></i> Contact
                    </a>
                    <a 
                        href="#map-sec"
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('map-sec');
                        }}
                    >
                        <i className="fas fa-map-marker-alt"></i> Location
                    </a>
                </div>
                
                <div className="right-section">
                    <div className="auth-buttons">
                        <Link 
                            to="/signup" 
                            className="auth-btn signup-btn btn-modern hover-lift"
                            onClick={() => setMenuOpen(false)}
                        >
                            <i className="fas fa-user-graduate icon-pulse"></i> Student
                        </Link>
                        <Link 
                            to="/mentor" 
                            className="auth-btn mentor-btn btn-modern hover-lift"
                            onClick={() => setMenuOpen(false)}
                        >
                            <i className="fas fa-chalkboard-teacher icon-pulse"></i> Mentor
                        </Link>
                    </div>
                    
                    <div className="mobile-menu-icon" onClick={toggleMenu}>
                        <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;