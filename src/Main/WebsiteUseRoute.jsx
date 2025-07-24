import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./main.css";

function WebsiteUseRoute() {
    const steps = [
        {
            step: 1,
            title: "Sign Up & Create Profile",
            description: "Register your account and create your student profile with personal details and academic information.",
            links: [
                { text: "Sign Up", path: "/signup" },
                { text: "Create Profile", path: "/signup" }
            ],
            icon: "fas fa-user-plus",
            color: "#4361ee"
        },
        {
            step: 2,
            title: "Login & Access Dashboard",
            description: "Login to your account and access your personalized dashboard with all features.",
            links: [
                { text: "Login", path: "/signup" },
                { text: "Dashboard", path: "/signup" }
            ],
            icon: "fas fa-sign-in-alt",
            color: "#3a0ca3"
        },
        {
            step: 3,
            title: "Select Your Field",
            description: "Choose your area of interest from various technology fields and specializations.",
            links: [
                { text: "Tech List", path: "/signup" },
                { text: "Field Selection", path: "/signup" }
            ],
            icon: "fas fa-laptop-code",
            color: "#4cc9f0"
        },
        {
            step: 4,
            title: "Take AI Interviews",
            description: "Practice with AI-powered interviews, JAM sessions, and technical assessments.",
            links: [
                { text: "Skill Assessment", path: "/signup" },
                { text: "JAM Session", path: "/signup" },
                { text: "Tech Interview", path: "/signup" }
            ],
            icon: "fas fa-robot",
            color: "#f72585"
        },
        {
            step: 5,
            title: "Explore GenAI Activities",
            description: "Access all AI-powered features including guidance, personality tests, and technical evaluations.",
            links: [
                { text: "AI Guidance", path: "/signup" },
                { text: "Personality Test", path: "/signup" },
                { text: "Activities", path: "/signup" }
            ],
            icon: "fas fa-brain",
            color: "#4ade80"
        },
        {
            step: 6,
            title: "Track Progress",
            description: "Monitor your learning progress, view performance analytics, and track skill development.",
            links: [
                { text: "Progress Dashboard", path: "/signup" }
            ],
            icon: "fas fa-chart-line",
            color: "#fbbf24"
        },
        {
            step: 7,
            title: "Get AI Improvement Tips",
            description: "Receive personalized feedback and improvement suggestions from AI mentors.",
            links: [
                { text: "AI Guidance", path: "/signup" }
            ],
            icon: "fas fa-lightbulb",
            color: "#8b5cf6"
        },
        {
            step: 8,
            title: "Achieve Placement Success",
            description: "Use placement prediction tools and prepare for your dream job with comprehensive training.",
            links: [
                { text: "Placement Prediction", path: "/signup" }
            ],
            icon: "fas fa-trophy",
            color: "#10b981"
        }
    ];

    const [activeStep, setActiveStep] = useState(null);

    return (
        <section className="website-route-section bg-gradient-to-br from-indigo-50 to-purple-100">
            <div className="route-header" data-aos="fade-up">
                <h1 className="text" >How to Use Skill Route Platform</h1>
                <p className="text-indigo-700">Follow these simple steps to maximize your learning journey</p>
            </div>
            
            <div className="zigzag-container">
                {steps.map((stepData, index) => (
                    <div key={stepData.step} className={`zigzag-step ${index % 2 === 0 ? 'right' : 'left'}`}>
                        <div 
                            className="step-header hover-lift glass-dark"
                            onClick={() => setActiveStep(activeStep === stepData.step ? null : stepData.step)}
                            style={{ backgroundColor: stepData.color }}
                            data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
                        >
                            <span className="step-number">{stepData.step}</span>
                            <h3>{stepData.title}</h3>
                            <i className={`fas ${activeStep === stepData.step ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>
                        
                        {activeStep === stepData.step && (
                            <div className="step-details glass" data-aos="zoom-in">
                                <div className="step-icon" style={{ color: stepData.color }}>
                                    <i className={`${stepData.icon} icon-pulse`}></i>
                                </div>
                                <p>{stepData.description}</p>
                                <div className="step-links">
                                    {stepData.links.map((link, linkIndex) => (
                                        <Link 
                                            key={linkIndex}
                                            to={link.path} 
                                            className="step-link hover-glow"
                                            style={{ borderColor: stepData.color, color: stepData.color }}
                                        >
                                            {link.text}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {index < steps.length - 1 && (
                            <div className="zigzag-arrow">
                                <i className={`fas ${index % 2 === 0 ? 'fa-arrow-right' : 'fa-arrow-left'} icon-spin`}></i>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default WebsiteUseRoute;
