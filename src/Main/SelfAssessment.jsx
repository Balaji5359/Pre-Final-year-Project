import React from 'react';
import "./main.css";
import Selfassess from "../assets/selfassess.png";
function SelfAssessment() {
    return (
        <>
        <section className="about-section">
        <div className="about-content">
            <h1>Self-Assessment Highlights</h1>
            <ul className="list-style">
            <li>Mock Interview with GenAI Based on Resume, get real-time feedback</li>
            <li>Mock Interview with GenAI Based on Field, get real-time feedback</li>
            <li>Mock Interview with GenAI Based on Personality Related Traits, get real-time feedback</li>
            <li>JAM session with GenAI and user, get real-time feedback</li>
            <li>Career Guidance and Field Insights with GenAI</li>
            </ul>
        </div>
        
        <img
                src={Selfassess}
                style={{ width: "550px", height: "565px" }}
                alt="About Skill Route"
                className="about-image"
        />
        </section>
        </>

    );
}

export default SelfAssessment;
