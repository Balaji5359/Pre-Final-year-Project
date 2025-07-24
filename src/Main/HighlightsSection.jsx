import React, { useEffect } from 'react';
import "./main.css";
import HighlightImg from "../assets/highlights.png";

function HighlightsSection() {
    useEffect(() => {
        if (window.gsap) {
            gsap.from('.highlight-items li', {
                scrollTrigger: {
                    trigger: '.highlights-section',
                    start: 'top 70%'
                },
                duration: 0.8,
                opacity: 0,
                y: 20,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
    }, []);
    
    return (
        <section id="highlights-section" className="highlights-section bg-gradient-to-br from-purple-50 to-pink-100" >
            <div className="highlights-content glass p-8 rounded-xl" data-aos="fade-right">
                <h1 className="text">
                    Highlights of Skill Route
                </h1>
                <ul className="list">
                    <li>
                        <i></i> Guiding Students in selecting Field for career
                    </li>
                    <li className="hover-lift modern-card p-4 mb-4 bg-gradient-to-r from-indigo-100 to-blue-100">
                        <i className="fas fa-brain text-blue-500 text-xl mr-3"></i> Analyzing the knowledge of the Student in the Field
                    </li>
                    <li className="hover-lift modern-card p-4 mb-4 bg-gradient-to-r from-blue-100 to-purple-100">
                        <i className="fas fa-tasks text-purple-500 text-xl mr-3"></i> Conducting Self-assessment for Evaluation
                    </li>
                    <li className="hover-lift modern-card p-4 mb-4 bg-gradient-to-r from-purple-100 to-pink-100">
                        <i className="fas fa-map-signs text-pink-500 text-xl mr-3"></i> Provide Road-Map to expertise in the Field
                    </li>
                    <li className="hover-lift modern-card p-4 mb-4 bg-gradient-to-r from-pink-100 to-green-100">
                        <i className="fas fa-chart-line text-green-500 text-xl mr-3"></i> Analyzing and Self-assessment monthly
                    </li>
                    <li className="hover-lift modern-card p-4 mb-4 bg-gradient-to-r from-green-100 to-yellow-100">
                        <i className="fas fa-briefcase text-yellow-500 text-xl mr-3"></i> Providing Job opportunities in the Field
                    </li>
                </ul>
                <button
                    className="register-button btn-modern bg-gradient-secondary text-white py-3 px-8 rounded-full hover-lift animated-border"
                    onClick={() => (window.location.href = "/signup")}
                >
                    <i className="fas fa-user-plus icon-pulse"></i> Register now and explore our platform
                </button>
            </div>
            <div className="image-container" data-aos="fade-left">
                <img
                    src={HighlightImg}
                    style={{ width: "100%", height: "auto", maxHeight: "565px" }}
                    alt="Skill Route Highlights"
                    className="about-image hover-lift modern-card animated-border"
                />
            </div>
        </section>
    );
}

export default HighlightsSection;
