import React from 'react';
import "./main.css";
import Motivate from "../assets/motivate.png";
import logo from "../assets/logo.png";
function ResourcesSection() {
    return (
        <section className="highlights-section">
        <div className="highlights-content">
            <h1>
            <a className="header1" href="services.html">
                Who are all here to help Students?
            </a>
            </h1>
            <ul className="list-style">
            <li>
                Skill Route Team
                <button className="button">
                <img src={logo} alt="Skill Route Logo" style={{ width: "30px", height: "30px"}} />
                </button>
            </li>
            <li>
                Professors and Placement Team of College
                <button className="arrow-button">
                <img src={logo} alt="Skill Route Logo" style={{ width: "30px", height: "30px"}} />
                </button>
            </li>
            <li>
                Alumni Students of college
                <button className="arrow-button">
                <img src={logo} alt="Skill Route Logo" style={{ width: "30px", height: "30px"}} />
                </button>
            </li>
            <li>
                Different Companies Experts <br></br>(Product, Service, StartUp)
                <button className="arrow-button">
                <img src={logo} alt="Skill Route Logo" style={{ width: "30px", height: "30px"}} />
                </button>
            </li>
            <li>
                Employees, HR's and Mentors of different Companies
                <button className="arrow-button">
                <img src={logo} alt="Skill Route Logo" style={{ width: "30px", height: "30px"}} />
                </button>
            </li>
            </ul>
        </div>
                <img
                src={Motivate}
                style={{ width: "500px", height: "565px" }}
                alt="About Skill Route"
                className="about-image"
        />
        </section>
    );
}

export default ResourcesSection;
