import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import "./main.css";
import AboutusImg from "../assets/about_us.png";

function AboutSection() {
    useEffect(() => {
        if (window.gsap) {
            gsap.from('.about-title', {
                scrollTrigger: {
                    trigger: '.about-section',
                    start: 'top 80%'
                },
                duration: 1,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            });
            
            gsap.from('.about-paragraph', {
                scrollTrigger: {
                    trigger: '.about-section',
                    start: 'top 70%'
                },
                duration: 1,
                y: 20,
                opacity: 0,
                ease: 'power3.out',
                delay: 0.3
            });
        }
    }, []);
    
return (
    <section id="about-section" className="about-section bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="about-content glass p-8 rounded-xl" data-aos="fade-right">
            <h1 className="text">
                About Us
            </h1>
            <p className="about">
                Skill Route is an online platform that guides individuals in their engineering career paths.
                It provides insights into various engineering disciplines and future opportunities, 
                allowing users to explore fields, assess their knowledge, and take skill tests. 
                AI agents offer career guidance, subject knowledge, and conduct mock interviews based on resumes and previous
                interview questions. The platform emphasizes continuous learning and highlights motivation, consistency, 
                and patience as key factors for career success.
            </p>
            <button
                className="register-button btn-modern bg-gradient-primary text-white py-3 px-8 rounded-full hover-lift animated-border"
                onClick={() => (window.location.href = "/signup")}
            >
                <i className="fas fa-user-plus icon-pulse"></i> Register now and explore our platform
            </button>
        </div>
        <div className="image-container" data-aos="fade-left">
            <img
                src={AboutusImg}
                style={{ width: "100%", 
                    height: "500px",
                    objectFit: "cover",
                    borderRadius: "15px"
                }}
                alt="About Skill Route"
                className="about-image hover-lift modern-card animated-border" />
        </div>
    </section>
);
}

export default AboutSection;
