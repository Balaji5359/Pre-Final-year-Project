import React from "react";
import { Link } from "react-router-dom";
import "./activities.css";
function Activities2() {
    return (
        <div className="activities-container">
            <h1>Skill Based Activities with GenAI</h1>
            <center>
            <Link to="/profiledata" className="btn-back-profile">
                Back to Profile
            </Link>
            </center>
            <div className="activities-list">
                <Link to="/genai-interviewer-res" className="activity-item">
                    GenAI Interviewer based on Resume
                </Link>
                <Link to="/genai-test-tech" className="activity-item">
                    GenAI Interviewer based on Skills Rating Data
                </Link>
                <Link to="/genai-prev-q-interviewer" className="activity-item">
                    GenAI Test with Previous Year Company Questions
                </Link>
                <Link to="/genai-guidance" className="activity-item">
                    GenAI Career Guidance
                </Link>
            </div>
        </div>
    );
}
export default Activities2;