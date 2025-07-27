import React from "react";
import { Link } from "react-router-dom";
import "./activities.css";
function Activities() {
    return (
        <div className="activities-container">
            <h1>Communication Activities</h1>
            <center>
            <Link to="/profiledata" className="btn-back-profile">
                Back to Profile
            </Link>
            </center>
            <div className="activities-list">
                <Link to="/genai-jam" className="activity-item">
                    GenAI Just A Minute topics
                </Link>
                <Link to="/genai-pronunciation-test-spoken" className="activity-item">
                    GenAI Pronunciation - Spoken Test 
                </Link>
                <Link to="/profiledata" className="activity-item">
                    GenAI Pronunciation - Listening Test 
                </Link>
            </div>
        </div>
    );
}
export default Activities;