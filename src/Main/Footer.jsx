import React from 'react';
import { Link } from 'react-router-dom';
import './main.css';
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="site-footer bg-gradient-primary" style={{ color: 'white' }}>
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-col about-col">
            <div className="footer-logo" data-aos="fade-right">
              <img src={logo} alt="Skill Route Logo" className="hover-lift" />
              <h3 className="text-neon" style={{ color: 'white' }}>Skill Route</h3>
            </div>
            <p style={{ color: 'white' }}>
              Empowering students with AI-driven career guidance and placement preparation
              to achieve their professional goals.
            </p>
            <div className="social-links" data-aos="fade-up">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover-lift" style={{ color: 'white' }}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover-lift" style={{ color: 'white' }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover-lift" style={{ color: 'white' }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover-lift" style={{ color: 'white' }}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-col contact-col" data-aos="fade-up" data-aos-delay="100">
            <h4 style={{ color: 'white' }}>Quick Links</h4>
            <ul>
              <li><Link to="/" style={{ color: 'white' }}>Home</Link></li>
              <li><Link to="/about" style={{ color: 'white' }}>About Us</Link></li>
              <li><Link to="/contact" style={{ color: 'white' }}>Contact</Link></li>
              <li><Link to="/highlights" style={{ color: 'white' }}>Highlights</Link></li>
            </ul>
          </div>
          
          <div className="footer-col contact-col" data-aos="fade-up" data-aos-delay="200">
            <h4 style={{ color: 'white' }}>Student Resources</h4>
            <ul>
              <li><Link to="/tech-list" style={{ color: 'white' }}>Technology Fields</Link></li>
              <li><Link to="/activities" style={{ color: 'white' }}>AI Activities</Link></li>
              <li><Link to="/progress" style={{ color: 'white' }}>Progress Tracking</Link></li>
              <li><Link to="/placement-prediction1" style={{ color: 'white' }}>Placement Prediction</Link></li>
            </ul>
          </div>
          
          <div className="footer-col contact-col" data-aos="fade-up" data-aos-delay="300">
            <h4 style={{ color: 'white' }}>Contact Us</h4>
            <ul className="contact-info">
              <li className="hover-lift" style={{ color: 'white' }}>
                <i className="fas fa-map-marker-alt icon-pulse"></i>
                <span>456 College Road, Madanapalle, Andhra Pradesh, India - 517325</span>
              </li>
              <li className="hover-lift" style={{ color: 'white' }}>
                <i className="fas fa-phone icon-pulse"></i>
                <span>+91 98765 43210</span>
              </li>
              <li className="hover-lift" style={{ color: 'white' }}>
                <i className="fas fa-envelope icon-pulse"></i>
                <span>contact@skillroute.edu</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom glass-dark" style={{ color: 'white' }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Skill Route. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#" className="hover-lift" style={{ color: 'white' }}>Privacy Policy</a>
            <a href="#" className="hover-lift" style={{ color: 'white' }}>Terms of Service</a>
            <a href="#" className="hover-lift" style={{ color: 'white' }}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;