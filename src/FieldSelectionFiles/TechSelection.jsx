import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./techlist.css";
import { ImTextColor } from "react-icons/im";

function TechSelection() {
    const fieldList = [
        "Full Stack Web Development", "Machine Learning", "Artificial Intelligence", "Data Science", "Cloud Computing",
        "Cybersecurity", "Blockchain Technology", "Internet of Things (IoT)", "Generative AI"
    ];
    const [showNote, setShowNote] = useState(false);
    const companyTypeList = [
        "Product-based", "Service-based", "Marketplace", "Startup", "Other"
    ];

    const [selectedFields, setSelectedFields] = useState({
        field1: "",
        field2: "",
        field3: "",
        jobRole: "",
        companyType: "",
        dreamCompany: "",
        agree: false,
        confirm: false
    });
        // Filter out already selected fields for next dropdowns
    const getFilteredFields = (excludeFields) =>
        fieldList.filter(f => !excludeFields.includes(f));


    function handleFieldChange(e) {
        const { name, value, type, checked } = e.target;
        setSelectedFields(prev => {
            let updated = {
                ...prev,
                [name]: type === "checkbox" ? checked : value
            };
            // Reset next fields if previous changes
            if (name === "field1") {
                updated.field2 = "";
                updated.field3 = "";
            }
            if (name === "field2") {
                updated.field3 = "";
            }
            return updated;
        });
    }
    function handleSubmit(event) {
        event.preventDefault();
        console.log("Form Data:", selectedFields);
        alert("Your selection has been submitted!");
        navigate("/placement-prediction1", { state: { selectedFields } });
        setSelectedFields({
            field1: "",
            field2: "",
            field3: "",
            jobRole: "",
            companyType: "",
            dreamCompany: "",
            agree: false,
            confirm: false
        });
    }
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

    function handleFieldChange(e) {
        const { name, value, type, checked } = e.target;
        setSelectedFields(prev => {
            let updated = {
                ...prev,
                [name]: type === "checkbox" ? checked : value
            };
            if (name === "field1") {
                updated.field2 = "";
                updated.field3 = "";
            }
            if (name === "field2") {
                updated.field3 = "";
            }
            return updated;
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log("Form Data:", selectedFields);
        alert("Your selection has been submitted!");
        navigate("/placement-prediction1", { state: { selectedFields } });
        setSelectedFields({
            field1: "",
            field2: "",
            field3: "",
            jobRole: "",
            companyType: "",
            dreamCompany: "",
            agree: false,
            confirm: false
        });
    }

    if (loading) {
        return <div><p>Loading...</p></div>;
    }

    if (techSelection) {
        return (
            <div className="tech-selection-card">
                <center>
                    <Link to="/profiledata"><button className="btn">Back</button></Link>
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
            </div>
        );
    }

    return (
<div className="tech-selection-card">
            <center>
                <Link to="/tech-list"><button className="btn">Back to Tech List</button></Link>                
            
            <br />
            <h2>Welcome to Tech Selection Page</h2>
            </center>
            <form className="tech-selection-form" onSubmit={handleSubmit}>
                <ul className="tech-selection-notes">
                    <li><b>Note:</b></li>
                    <li>Select your preferred technology and domain.</li>
                    <li>Be alert and confident while selection; it's for your future <br />(can't be modified later).</li>
                    <li>You can select multiple domains or Technologies, if interested.</li>
                </ul>
                <div className="form-group">
                    <h5>Field 1 selection</h5>
                    <select
                        name="field1"
                        value={selectedFields.field1}
                        onChange={handleFieldChange}
                        required
                    >
                        <option value="">Select a field</option>
                        {fieldList.map((field, idx) => (
                            <option key={idx} value={field}>{field}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <h5>Field 2 selection</h5>
                    <select
                        name="field2"
                        value={selectedFields.field2}
                        onChange={handleFieldChange}
                        disabled={!selectedFields.field1}
                    >
                        <option value="">Select a field</option>
                        {getFilteredFields([selectedFields.field1]).map((field, idx) => (
                            <option key={idx} value={field}>{field}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <h5>Field 3 selection</h5>
                    <select
                        name="field3"
                        value={selectedFields.field3}
                        onChange={handleFieldChange}
                        disabled={!selectedFields.field2}
                    >
                        <option value="">Select a field</option>
                        {getFilteredFields([selectedFields.field1, selectedFields.field2]).map((field, idx) => (
                            <option key={idx} value={field}>{field}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <h5>Which Job Role you are passionate about? (optional)</h5>
                    <input
                        type="text"
                        name="jobRole"
                        value={selectedFields.jobRole}
                        onChange={handleFieldChange}
                        placeholder="Enter your desired job role"
                    />
                </div>
                <div className="form-group">
                    <h5>Which Type of company is your dream?</h5>
                    <select
                        name="companyType"
                        value={selectedFields.companyType}
                        onChange={handleFieldChange}
                        required
                    >
                        <option value="">Select a company type</option>
                        {companyTypeList.map((type, idx) => (
                            <option key={idx} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <h5>Which is your dream company to work for? (Optional)</h5>
                    <input
                        type="text"
                        name="dreamCompany"
                        value={selectedFields.dreamCompany}
                        onChange={handleFieldChange}
                        placeholder="Enter your dream company"
                    />
                </div>
                <div className="form-group checkboxes">
                    <label>
                        <input
                            type="checkbox"
                            name="agree"
                            checked={selectedFields.agree}
                            onChange={handleFieldChange}
                            required
                        /> I agree to the terms and conditions
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="confirm"
                            checked={selectedFields.confirm}
                            onChange={handleFieldChange}
                            required
                        /> I confirm my selection and I am ready to proceed
                    </label>
                </div>
                <center><button className="tech-list-button" type="submit">Submit</button></center>
            </form>
            <div className="tech-list-footer">
                
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
    );
}

export default TechSelection;