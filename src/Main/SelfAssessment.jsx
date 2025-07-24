import React, { useEffect } from 'react';
import "./main.css";
import Selfassess from "../assets/selfassess.png";

function SelfAssessment() {
    useEffect(() => {
        if (window.gsap) {
            gsap.from('.assessment-items li', {
                scrollTrigger: {
                    trigger: '.highlights-section',
                    start: 'top 70%'
                },
                duration: 0.8,
                opacity: 0,
                x: -30,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
    }, []);
    
    return (
        <section className="highlights-section bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="highlights-content glass p-8 rounded-xl" data-aos="fade-right">
            <h1 className="text">Self-Assessment Highlights</h1>
            <ul className="list">
            <li className="hover-lift"><i className="fas fa-file-alt text-teal-500"></i> Mock Interview with GenAI Based on Resume, get real-time feedback</li>
            <li className="hover-lift"><i className="fas fa-laptop-code text-cyan-500"></i> Mock Interview with GenAI Based on Field, get real-time feedback</li>
            <li className="hover-lift"><i className="fas fa-user-tie text-blue-500"></i> Mock Interview with GenAI Based on Personality Related Traits, get real-time feedback</li>
            <li className="hover-lift"><i className="fas fa-comments text-indigo-500"></i> JAM session with GenAI and user, get real-time feedback</li>
            <li className="hover-lift"><i className="fas fa-route text-purple-500"></i> Career Guidance and Field Insights with GenAI</li>
            </ul>
            
            <button
                className="register-button btn-modern bg-gradient-accent text-white py-3 px-8 rounded-full hover-lift animated-border mt-6"
                onClick={() => (window.location.href = "/signup")}
            >
                <i className="fas fa-clipboard-check icon-pulse"></i> Start Your Assessment
            </button>
        </div>
        
        <div className="image-container" data-aos="fade-left">
            <img
                src={Selfassess}
                style={{ width: "100%", height: "auto", maxHeight: "565px" }}
                alt="Self Assessment"
                className="about-image hover-lift modern-card animated-border"
            />
        </div>
        </section>

    );
}

export default SelfAssessment;
