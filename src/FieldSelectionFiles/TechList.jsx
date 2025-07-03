import React, { useEffect, useState } from "react";
import "./techlist.css";
import { Link, useNavigate } from "react-router-dom";

function TechListPage() {
    const [techList] = useState([
        { id: 1, name: "Full Stack Web Development", description: "Learn to build complete web applications from front to back." },
        { id: 2, name: "Artificial Intelligence", description: "Explore the world of AI and machine learning." },
        { id: 3, name: "Machine Learning", description: "Dive into algorithms and data analysis." },
        { id: 4, name: "Data Science", description: "Learn data analysis and visualization techniques." },
        { id: 5, name: "Cloud Computing", description: "Understand cloud services and deployment." },
        { id: 6, name: "Cybersecurity", description: "Learn to protect systems and networks." },
        { id: 7, name: "Blockchain Technology", description: "Explore decentralized applications and cryptocurrencies." },
        { id: 8, name: "Internet of Things (IoT)", description: "Connect devices and create smart solutions." },
        { id: 9, name: "Generative AI", description: "Learn about AI that can create content." },
    ]);
    const [showNote, setShowNote] = useState(false);
    const [apiData, setApi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [techSelection, setTechSelection] = useState(null);
    const [expandedFields, setExpandedFields] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const url = 'https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/login/profile_data/send_data';
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            setLoading(false);
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: storedEmail }),
        })
            .then((response) => response.json())
            .then((data) => {
                setApi(data);
                if (data && data.body) {
                    try {
                        const parsedData = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
                        if (parsedData.data && Object.keys(parsedData.data).length > 0) {
                            setTechSelection(parsedData.data);
                        }
                    } catch (error) {
                        console.error('Error parsing tech selection data:', error);
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const toggleField = (field) => {
        setExpandedFields(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const toggleCategory = (field, category) => {
        const key = `${field}-${category}`;
        setExpandedCategories(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (techSelection) {
        return (
            <div className="tech-selection-card">
                <center>
                    <Link to="/profiledata"><button className="back-btn">Back</button></Link>
                </center>
                <br />
                <div className="tech-selection-summary">
                    <h2>🎯 Your Selected Technologies & Skill Ratings</h2>
                    <div className="dropdown-container">
                        {Object.entries(techSelection).map(([field, categories]) => (
                            <div key={field} className="field-dropdown">
                                <div 
                                    className="field-header" 
                                    onClick={() => toggleField(field)}
                                >
                                    <h3>{field}</h3>
                                    <span className={`arrow ${expandedFields[field] ? 'expanded' : ''}`}>▼</span>
                                </div>
                                
                                {expandedFields[field] && (
                                    <div className="field-content">
                                        {categories && typeof categories === "object" ? (
                                            Object.entries(categories).map(([category, skills]) => (
                                                <div key={category} className="category-dropdown">
                                                    <div 
                                                        className="category-header"
                                                        onClick={() => toggleCategory(field, category)}
                                                    >
                                                        <h4>📂 {category}</h4>
                                                        <span className={`arrow ${expandedCategories[`${field}-${category}`] ? 'expanded' : ''}`}>▼</span>
                                                    </div>
                                                    
                                                    {expandedCategories[`${field}-${category}`] && (
                                                        <div className="skills-content">
                                                            <p><strong>Your Skill Ratings:</strong></p>
                                                            <div className="skills-grid">
                                                                {skills && typeof skills === "object" ? (
                                                                    Object.entries(skills).map(([skill, rating]) => (
                                                                        <div key={skill} className="skill-item">
                                                                            <span className="skill-name">{skill}</span>
                                                                            <div className="rating-display">
                                                                                <div className="stars">
                                                                                    {[...Array(5)].map((_, i) => (
                                                                                        <span 
                                                                                            key={i} 
                                                                                            className={`star ${i < rating ? 'filled' : ''}`}
                                                                                        >
                                                                                            ⭐
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                                <span className="rating-text">{rating}/5</span>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="skill-item">{skills}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p>{categories}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <br></br>
                    <center>
                        <Link to="/genai-interviewer-res">
                            <button className="back-btn">
                                Click here to start test with GenAI Interviewer
                            </button>
                        </Link>
                    </center>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="tech-list">
                <div className="tech-list-header">
                    <h2 style={{ color: "#357abd" }}>Welcome to the Technologies Place of the world ruling Digital World!...</h2>
                    <p>Discover trending technologies and design your own path to success.</p>
                </div>
                <div className="tech-list-container">
                    {techList.map(tech => (
                        <div className="tech-list-item" key={tech.id}>
                            <h2>{tech.name}</h2>
                            <p>{tech.description}</p>
                            <Link to={`/tech-card`} state={{ techName: tech.name }}>
                                <button className="tech-list-button">Explore</button>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="tech-list-footer">
                    {!showNote && (
                        <button onClick={() => setShowNote(true)}>
                            Ready for Next Step?
                        </button>
                    )}
                    {showNote && (
                        <ul id="note">
                            <li>Note: We hope you had a great exploration here</li>
                            <li>Now it's time to select your future plans,
                                domain, and the technology you want to learn and get a job
                                in that field.
                            </li>
                            <center>
                                <Link to="/tech-selection"><button>Click here if you are ready</button></Link>
                            </center>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TechListPage;