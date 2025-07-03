import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "./main.css";
import AboutusImg from "../assets/about_us.png";
function AboutSection() {
return (
    <>
    <Navbar />
    <section className="about-section">
        <div className="about-content">
            <h1>
                <a className="header1" href="#">
                    About Us
                </a>
            </h1>
            <p className="about-paragraph">
                Skill Route is an online platform that guides individuals in their engineering career paths.
                It provides insights into various engineering disciplines and future opportunities, 
                allowing users to explore fields, assess their knowledge, and take skill tests. 
                AI agents offer career guidance, subject knowledge, and conduct mock interviews based on resumes and previous
                interview questions. The platform emphasizes continuous learning and highlights motivation, consistency, 
                and patience as key factors for career success.
            </p>
            <button
                className="register-button"
                onClick={() => (window.location.href = "/signup")}
            >
                <i className="fas fa-user-plus"></i> Register now and explore our platform
            </button>
        </div>
        <img
            src={AboutusImg}
            //fit the image to the section
            style={{ width: "540px", 
                height: "500px",
                objectFit: "cover",
                borderRadius: "10px",
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)"
            }}
            alt="About Skill Route"
            className="about-image" />
    </section>
    </>
);
}

export default AboutSection;
