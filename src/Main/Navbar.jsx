import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./main.css";
import logo from "../assets/logo.png"

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

    return (
        <nav className={scrolled ? "scrolled" : ""}>
            <div className="header-div">
                <img 
                    src={logo}
                    style={{ width: "100px", height: "70px" ,borderRadius: "10px", marginRight: "10px" }}
                    alt="Skill Route Logo"
                    className="logo-image"
                />
                <Link to="/" className="logo">
                    <h2 style={{padding:"0px",fontWeight:'bold',fontSize:'38px'}}>Skill Route</h2>
                </Link>
                
                <div className="mobile-menu-icon" onClick={toggleMenu}>
                    <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
                
                <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <Link 
                        to="/" 
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fas fa-home"></i> Home
                    </Link>
                    <Link 
                        to="/about" 
                        className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fas fa-info-circle"></i> About Us
                    </Link>
                    <Link 
                        to="/contact" 
                        className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fas fa-envelope"></i> Contact
                    </Link>
                    <Link 
                        to="/highlights" 
                        className={`nav-link ${isActive('/highlights') ? 'active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <i className="fas fa-star"></i> Highlights
                    </Link>
                </div>
                
                <div className="auth-buttons">
                    <Link 
                        to="/login" 
                        className="auth-btn login-btn"
                        onClick={() => setMenuOpen(false)}
                    >
                        Login
                    </Link>
                    <Link 
                        to="/signup" 
                        className="auth-btn signup-btn"
                        onClick={() => setMenuOpen(false)}
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;