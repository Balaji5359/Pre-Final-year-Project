import React from 'react';
import "./main.css";
import Motivate from "../assets/motivatee.png";
function MotivationSection() {
    return (
        <section className="about-section">
        <div className="about-content">
            <h1>Keep Motivating yourself</h1>
            <ul className="list-style">
            <li>
                <i className="fas fa-heart"></i> Keep Motivating yourself and keep learning.
            </li>
            <li>
                <i className="fas fa-star"></i> Be consistent and be patient that's what Skill Route advice.
            </li>
            <li>
                <i className="fas fa-bolt"></i> Consistency is not a habit, it's a super power.
            </li>
            <li>
                <i className="fas fa-lightbulb"></i> Consistency is the key to success.
            </li>
            </ul>
        </div>
        <img
                src={Motivate}
                style={{ width: "480px", height: "380px" }}
                alt="About Skill Route"
                className="about-image"
        />
        </section>
    );
}

export default MotivationSection;
