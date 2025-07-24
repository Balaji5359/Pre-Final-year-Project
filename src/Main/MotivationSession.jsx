import React, { useEffect } from 'react';
import "./main.css";
import Motivate from "../assets/motivatee.png";

function MotivationSection() {
    useEffect(() => {
        if (window.gsap) {
            gsap.from('.motivation-items li', {
                scrollTrigger: {
                    trigger: '.highlights-section',
                    start: 'top 70%'
                },
                duration: 0.8,
                opacity: 0,
                scale: 0.9,
                stagger: 0.3,
                ease: 'back.out(1.7)'
            });
        }
    }, []);
    
    return (
        <section className="highlights-section bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="highlights-content glass p-8 rounded-xl" data-aos="fade-up">
            <h1 className="text">Keep Motivating yourself</h1>
            <ul className="list">
            <li className="hover-lift modern-card p-4 mb-4 bg-gradient-to-r from-amber-100 to-orange-100">
                <i className="fas fa-heart text-red-500 text-xl icon-pulse"></i> Keep Motivating yourself and keep learning.
            </li>
            <li className="hover-lift modern-card p-4 mb-4 bg-gradient-to-r from-yellow-100 to-amber-100">
                <i className="fas fa-star text-yellow-500 text-xl icon-pulse"></i> Be consistent and be patient that's what Skill Route advice.
            </li>
            <li className="hover-lift modern-card p-4 mb-4 bg-gradient-to-r from-orange-100 to-red-100">
                <i className="fas fa-bolt text-orange-500 text-xl icon-pulse"></i> Consistency is not a habit, it's a super power.
            </li>
            <li className="hover-lift modern-card p-4 mb-4 bg-gradient-to-r from-amber-50 to-yellow-100">
                <i className="fas fa-lightbulb text-amber-500 text-xl icon-pulse"></i> Consistency is the key to success.
            </li>
            </ul>
            
            <button
                className="register-button btn-modern bg-gradient-warm text-white py-3 px-8 rounded-full hover-lift animated-border mt-6"
                onClick={() => (window.location.href = "/signup")}
            >
                <i className="fas fa-fire icon-pulse"></i> Get Motivated Now
            </button>
        </div>
        <div className="image-container" data-aos="fade-left">
            <img
                src={Motivate}
                style={{ width: "100%", height: "auto", maxHeight: "480px" }}
                alt="Motivation"
                className="about-image hover-lift modern-card animated-border"
            />
        </div>
        </section>
    );
}

export default MotivationSection;
