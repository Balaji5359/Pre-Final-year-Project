import React, { useEffect } from 'react';
import "./main.css";
import Motivate from "../assets/motivate.png";

function ResourcesSection() {
    useEffect(() => {
        if (window.gsap) {
            gsap.from('.resource-items li', {
                scrollTrigger: {
                    trigger: '.resource-section',
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
        <section className="highlights-section bg-gradient-to-br from-green-50 to-teal-100">
        <div className="highlights-content glass p-8 rounded-xl" data-aos="fade-right">
            <h1 className="text">
                Who are all here to help Students?
            </h1>
            <ul className="list">
            <li className="hover-lift modern-card p-4 bg-gradient-to-r from-green-100 to-teal-100 flex justify-between items-center">
                <div className="flex items-center">
                    <i className="fas fa-users text-green-600 text-xl mr-3"></i>
                    <span>Skill Route Team</span>
                </div>
            </li>
            <li className="hover-lift modern-card p-4 bg-gradient-to-r from-teal-100 to-cyan-100 flex justify-between items-center">
                <div className="flex items-center">
                    <i className="fas fa-chalkboard-teacher text-teal-600 text-xl mr-3"></i>
                    <span>Professors and Placement Team of College</span>
                </div>
            </li>
            <li className="hover-lift modern-card p-4 bg-gradient-to-r from-cyan-100 to-blue-100 flex justify-between items-center">
                <div className="flex items-center">
                    <i className="fas fa-user-graduate text-cyan-600 text-xl mr-3"></i>
                    <span>Alumni Students of college</span>
                </div>
            </li>
            <li className="hover-lift modern-card p-4 bg-gradient-to-r from-blue-100 to-indigo-100 flex justify-between items-center">
                <div className="flex items-center">
                    <i className="fas fa-building text-blue-600 text-xl mr-3"></i>
                    <span>Different Companies Experts (Product, Service, StartUp)</span>
                </div>
            </li>
            <li className="hover-lift modern-card p-4 bg-gradient-to-r from-indigo-100 to-purple-100 flex justify-between items-center">
                <div className="flex items-center">
                    <i className="fas fa-briefcase text-indigo-600 text-xl mr-3"></i>
                    <span>Employees, HR's and Mentors of different Companies</span>
                </div>
            </li>
            </ul>
            
            <button
                className="register-button btn-modern bg-gradient-success text-white py-3 px-8 rounded-full hover-lift animated-border mt-6"
                onClick={() => (window.location.href = "/signup")}
            >
                <i className="fas fa-handshake icon-pulse"></i> Connect With Mentors
            </button>
        </div>
        <div className="image-container" data-aos="fade-left">
            <img
                src={Motivate}
                style={{ width: "100%", height: "auto", maxHeight: "565px" }}
                alt="Resources"
                className="resource-image hover-lift modern-card animated-border"
            />
        </div>
        </section>
    );
}

export default ResourcesSection;
