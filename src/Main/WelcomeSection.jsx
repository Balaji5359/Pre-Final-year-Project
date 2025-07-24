import React, { useEffect } from 'react';
import "./main.css";

function WelcomeSection() {
    useEffect(() => {
        // Initialize GSAP animations if available
        if (window.gsap) {
            gsap.from('.welcome-title', {
                duration: 1.2,
                y: 50,
                opacity: 0,
                ease: 'power3.out',
                delay: 0.3
            });
            
            gsap.from('.welcome-subtitle', {
                duration: 1.2,
                y: 30,
                opacity: 0,
                ease: 'power3.out',
                delay: 0.6
            });
            
            gsap.from('.welcome-btn', {
                duration: 1,
                y: 20,
                opacity: 0,
                ease: 'power3.out',
                delay: 0.9
            });
        }
    }, []);
    
    return (
        <div>
            <section id="welcome-section" className="welcome-section animated-bg">
                <div className="glass p-8 rounded-xl max-w-3xl mx-auto" data-aos="fade-up">
                    <h1 className="welcome">Welcome to Skill Route</h1>
                    <h2 className="welcome-subtitle mb-8">An Online Skill Testing and Career Path Guidance Platform <b>with AI</b></h2>
                    <button 
                        className="welcome-btn btn-modern bg-gradient-cool text-white py-3 px-8 rounded-full hover-lift animated-border"
                        onClick={() => {
                            const aboutSection = document.getElementById('about-section');
                            if (aboutSection) {
                                aboutSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        <span className="relative z-10">Get Started</span>
                    </button>
                </div>
                
                <div className="scroll-indicator">
                    <div className="mouse"></div>
                    <p className="mt-2">Scroll Down</p>
                </div>
            </section>
        </div>
    );
}

export default WelcomeSection;
