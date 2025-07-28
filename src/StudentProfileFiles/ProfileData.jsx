import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";

function ProfileData() {
    const navigate = useNavigate();
    const [apiData, setApi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [daysLeft, setDaysLeft] = useState(0);
    const [userData, setUserData] = useState({
        Name: "",
        gender: "",
        dob: "",
        age: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        collegeName: "",
        program: "",
        branch: "",
        yearOfStudy: "",
        hobbies: "",
        about: "",
        username: "",
        student_id: "",
        user_type: "",
        account_create_date: "",
        account_create_time: "",
    });

    useEffect(() => {
        setLoading(true);
        const url = 'https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/login/profile_data/send_data';
        const storedEmail = localStorage.getItem("email");
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
                        setUserData({
                            Name: parsedData.name || "",
                            gender: parsedData.gender || "",
                            dob: parsedData.dob || "",
                            age: parsedData.age || "",
                            email: parsedData.email || "",
                            phone: parsedData.phone || "",
                            city: parsedData.city || "",
                            state: parsedData.state_of_student || "",
                            collegeName: parsedData.collegename || "",
                            program: parsedData.program || "",
                            branch: parsedData.branch || "",
                            yearOfStudy: parsedData.year_of_study || "",
                            hobbies: parsedData.hobbies || "",
                            about: parsedData.about || "",
                            username: parsedData.username || "",
                            student_id: parsedData.student_id || "",
                            user_type: parsedData.user_type || "",
                            account_create_date: parsedData.account_create_date || "",
                            account_create_time: parsedData.account_create_time || "",
                        });
                        
                        // Check for subscription data
                        if (parsedData.subscription_plan && parsedData.payment_status === 'success') {
                            setSubscriptionData({
                                subscription_plan: parsedData.subscription_plan,
                                payment_status: parsedData.payment_status,
                                payment_date: parsedData.payment_date,
                                payment_time: parsedData.payment_time,
                                payment_id: parsedData.payment_id
                            });
                            
                            // Calculate days left
                            const paymentDate = new Date(parsedData.payment_date);
                            const planDuration = parsedData.subscription_plan === '1 month' ? 30 : 90;
                            const expiryDate = new Date(paymentDate.getTime() + (planDuration * 24 * 60 * 60 * 1000));
                            const today = new Date();
                            const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                            
                            setDaysLeft(Math.max(0, daysRemaining));
                        }
                    } catch (e) {
                        console.error('Error parsing API data body:', e);
                    }
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }
    // console.log(JSON.stringify(userData.data))
    return (
        <div className="profile-container">
            {/* Account Creation Info */}
            <div className="account-info">
                <small>Account created: {userData.account_create_date} at {userData.account_create_time}</small>
                <br />
                <small>Student-Skill-Route-Id: {userData.student_id || "Not provided"}</small>
            </div>
            
            <div className="profile-header">
                <div className="profile-avatar">
                    <i className="fa-solid fa-user user"></i>
                </div>
                <h2>{userData.Name || "Not provided"}</h2>
                <span className="profile-role">{userData.program || "Student"}</span>
                
                {/* User Type */}
                <div className="profile-badges">
                    <div className={`user-type-badge ${userData.user_type === 'free' ? 'free-user' : 'pro-user'}`}>
                        <strong>{userData.user_type?.toUpperCase() || "FREE"} USER</strong>
                    </div>
                </div>
                
                {/* Subscription Status */}
                {subscriptionData && daysLeft > 0 ? (
                    <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#10b981', color: 'white', borderRadius: '8px', textAlign: 'center'}}>
                        <div style={{fontSize: '14px', fontWeight: 'bold'}}>✅ Pro Plan Active</div>
                        <div style={{fontSize: '12px', marginTop: '5px'}}>Plan: {subscriptionData.subscription_plan}</div>
                        <div style={{fontSize: '12px'}}>{daysLeft} days remaining</div>
                        <div style={{fontSize: '10px', marginTop: '5px'}}>Payment ID: {subscriptionData.payment_id}</div>
                    </div>
                ) : subscriptionData && daysLeft === 0 ? (
                    <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#dc2626', color: 'white', borderRadius: '8px', textAlign: 'center'}}>
                        <div style={{fontSize: '14px', fontWeight: 'bold'}}>⚠️ Plan Expired</div>
                        <div style={{fontSize: '12px', marginTop: '5px'}}>Your {subscriptionData.subscription_plan} plan has expired</div>
                        <button 
                            onClick={() => navigate('/pro-plans')}
                            className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors text-sm"
                            style={{marginTop: '8px', cursor: 'pointer'}}
                        >
                            Renew Plan
                        </button>
                    </div>
                ) : (
                    <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#8b5cf6', color: 'white', borderRadius: '8px', textAlign: 'center'}}>
                        <div style={{fontSize: '17px', fontWeight: 'bold'}}>🚀 Upgrade to Pro</div>
                        <div style={{fontSize: '15px', marginTop: '5px'}}>To have more access to GenAI Sessions</div>
                        <Link to="/pro-plans">
                            <button type="button" className="btn btn-primary">Buy pro now</button>
                        </Link>
                    </div>
                )}
            </div>
            <div className="profile-section">
                <h3 className="info-heading">About Me</h3>
                <div className="info-data"><span>{userData.about || "Not provided"}</span></div>
            </div>
            <br></br>
            <div className="profile-columns">
                <div>
                    <div className="profile-section">
                        <h3 className="info-heading">Personal Information</h3>
                        <div className="info-data"><strong>Gender:</strong> <span>{userData.gender || "Not provided"}</span></div>
                        <div className="info-data"><strong>Date of Birth:</strong> <span>{userData.dob || "Not provided"}</span></div>
                        <div className="info-data"><strong>Age:</strong> <span>{userData.age || "Not provided"}</span></div>
                        <div className="info-data"><strong>Address:</strong> <span>{userData.address || "Not provided"}</span></div>
                        <div className="info-data"><strong>City:</strong> <span>{userData.city || "Not provided"}</span></div>
                        <div className="info-data"><strong>State:</strong> <span>{userData.state || "Not provided"}</span></div>
                    </div>
                    <div className="profile-section">
                        <h3 className="info-heading">Contact Information</h3>
                        <div className="info-data"><strong>College Email:</strong> <span>{userData.email || "Not provided"}</span></div>
                        <div className="info-data"><strong>Phone Number:</strong> <span>{userData.phone || "Not provided"}</span></div>
                        <div className="info-data"><strong>Username:</strong> <span>{userData.username || "Not provided"}</span></div>
                    </div>
                </div>
                <div>
                    <div className="profile-section">
                        <h3 className="info-heading">Academic Information</h3>
                        <div className="info-data"><strong>College Name:</strong> <span>{userData.collegeName || "Not provided"}</span></div>
                        <div className="info-data"><strong>Program:</strong> <span>{userData.program || "Not provided"}</span></div>
                        <div className="info-data"><strong>Branch:</strong> <span>{userData.branch || "Not provided"}</span></div>
                        <div className="info-data"><strong>Year of Study:</strong> <span>{userData.yearOfStudy || "Not provided"}</span></div>
                    </div>
                    <div className="profile-section">
                        <h3 className="info-heading">Additional Information</h3>
                        <div className="info-data"><strong>Hobbies:</strong> <span>{userData.hobbies || "Not provided"}</span></div>
                    </div>
                </div>
            </div>
            <div className="profile-actions">
                <div>
                    <h3 className="info-heading">Interested Field</h3>
                    <Link to="/profiledata">
                        <button type="button" className="btn btn-primary">Click Here To Select</button>
                    </Link>
                </div>
                <div>
                    <h3 className="info-heading">Interested Field RoadMap</h3>
                    <Link to="/profiledata">
                        <button type="button" className="btn btn-primary">Click Here To Start</button>
                    </Link>
                </div>
                <div>
                    <h3 className="info-heading">Your Progress</h3>
                    <Link to="/progress">
                        <button type="button" className="btn btn-primary">Click Here To View</button>
                    </Link>
                </div>
                <div>
                    <h3 className="info-heading">Your Activities History</h3>
                        <button type="button" className="btn btn-primary">Click Here To View</button>
                    <Link to="/profiledata">
                    </Link>
                </div>
                <div>
                    <h3 className="info-heading">Gen-AI Agent Activities</h3>
                    <Link to="/activities">
                        <button type="button" className="btn btn-primary">Click Here To View</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProfileData;