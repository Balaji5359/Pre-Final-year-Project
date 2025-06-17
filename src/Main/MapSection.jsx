import React from 'react';
import "./main.css";

function MapSection() {
    return (
        <section className="map-section" id="map-sec">
            <div className="container">
                <div className="section-title">
                    <h2>Find Us</h2>
                    <p>Our location in Andhra Pradesh, India</p>
                </div>
                
                <div className="map-container">
                    <iframe
                        className="map-frame"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3866.7127490261706!2d79.98955731482347!3d14.442332989898744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4c8cca0e958771%3A0xd3036c2025161697!2sAndhra%20Pradesh!5e0!3m2!1sen!2sin!4v1623456789012!5e0!3m2!1sen!2sin!4v1623456789012"
                        allowFullScreen
                        loading="lazy"
                        title="Location Map - Andhra Pradesh, India"
                    ></iframe>
                </div>
                
                <div className="location-details">
                    <div className="address-card">
                        <div className="icon">
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div className="details">
                            <h3>Our Address</h3>
                            <p>123 Education Street, Vijayawada</p>
                            <p>Andhra Pradesh, India - 520008</p>
                        </div>
                    </div>
                    
                    <div className="contact-card">
                        <div className="icon">
                            <i className="fas fa-phone-alt"></i>
                        </div>
                        <div className="details">
                            <h3>Contact Us</h3>
                            <p>Phone: +91 98765 43210</p>
                            <p>Email: contact@skillroute.edu</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MapSection;