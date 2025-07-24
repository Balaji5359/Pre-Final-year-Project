import React from 'react';
import { Link } from 'react-router-dom';

function RoadMap() {
    return (
        <div className="roadmap-container">
            <h2 className="roadmap-title">Your RoadMap</h2>
            <p className="roadmap-description">
                This roadmap is designed to guide you through your learning journey in your chosen field.
                Follow the steps to build your skills and prepare for success.
            </p>
            <div className="roadmap-steps">
                <h3>Steps to Follow:</h3>
                <ol>
                    <li>Complete the initial skill assessment.</li>
                    <li>Choose your specialization based on your interests.</li>
                    <li>Engage in hands-on projects and internships.</li>
                    <li>Participate in mock interviews and JAM sessions.</li>
                    <li>Track your progress and get feedback from mentors.</li>
                </ol>
            </div>
            <Link to="/profiledata" className="start-roadmap-button">
                Start Your RoadMap
            </Link>
        </div>
    );
}

export default RoadMap;