import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./activities.css";
function Activities() {
    const navigate = useNavigate();
    const [userPlan, setUserPlan] = useState('free'); // 'free' or 'pro'
    const [trialUsage, setTrialUsage] = useState({
        jam: false,
        pronunciation: false,
        listening: false
    });
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        // Load trial usage from localStorage
        const savedUsage = localStorage.getItem('trialUsage');
        if (savedUsage) {
            setTrialUsage(JSON.parse(savedUsage));
        }
        
        // Load user plan
        const savedPlan = localStorage.getItem('userPlan') || 'free';
        setUserPlan(savedPlan);
        
        // Fetch student data
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const email = localStorage.getItem('email');
            const response = await fetch('https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/signup/login/profile_data/send_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                const result = await response.json();
                const data = JSON.parse(result.body);
                
                if (data.subscription_plan && data.payment_status === 'success') {
                    setSubscriptionData({
                        subscription_plan: data.subscription_plan,
                        payment_status: data.payment_status,
                        payment_date: data.payment_date,
                        payment_time: data.payment_time,
                        payment_id: data.payment_id
                    });
                    
                    // Calculate days left
                    const paymentDate = new Date(data.payment_date);
                    const planDuration = data.subscription_plan === '1 month' ? 30 : 90;
                    const expiryDate = new Date(paymentDate.getTime() + (planDuration * 24 * 60 * 60 * 1000));
                    const today = new Date();
                    const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                    
                    setDaysLeft(Math.max(0, daysRemaining));
                    setUserPlan(daysRemaining > 0 ? 'pro' : 'free');
                }
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const handleActivityClick = (activityType, path) => {
        if (userPlan === 'pro') {
            navigate(path);
            return;
        }

        if (trialUsage[activityType]) {
            // Trial already used
            return;
        }

        // Mark trial as used
        const newUsage = { ...trialUsage, [activityType]: true };
        setTrialUsage(newUsage);
        localStorage.setItem('trialUsage', JSON.stringify(newUsage));
        navigate(path);
    };

    const ActivityButton = ({ activityType, path, title, icon }) => {
        const isDisabled = userPlan === 'free' && trialUsage[activityType];
        const isTrialAvailable = userPlan === 'free' && !trialUsage[activityType];
        
        return (
            <div className="relative group">
                <button
                    onClick={() => handleActivityClick(activityType, path)}
                    disabled={isDisabled}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        isDisabled 
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg cursor-pointer'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`text-2xl ${isDisabled ? 'text-gray-400' : 'text-blue-600'}`}>
                                {icon}
                            </div>
                            <div>
                                <h3 className={`font-semibold text-lg ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>
                                    {title}
                                </h3>
                                {userPlan === 'free' && (
                                    <p className={`text-sm ${
                                        isTrialAvailable ? 'text-green-600' : 
                                        isDisabled ? 'text-red-500' : 'text-gray-500'
                                    }`}>
                                        {isTrialAvailable ? '🎯 Free Trial Available' : 
                                        isDisabled ? '🔒 Trial Used - Upgrade to Pro' : 'Free Trial'}
                                    </p>
                                )}
                            </div>
                        </div>
                        {userPlan === 'pro' && (
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                PRO
                            </span>
                        )}
                    </div>
                </button>
                {isDisabled && (
                    <div className="absolute inset-0 bg-gray-50 bg-opacity-50 rounded-xl flex items-center justify-center">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border">
                            <p className="text-sm text-gray-600 font-medium">Trial Expired</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8" style={{marginTop: '60px'}}>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Communication Activities
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Enhance your communication skills with AI-powered activities
                    </p>
                </div>

                {/* Subscription Status */}
                {subscriptionData && userPlan === 'pro' && daysLeft > 0 ? (
                    <div className="flex justify-center mb-8">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-white max-w-md">
                            <div className="text-center">
                                <h2 className="text-lg font-bold mb-2">✅ Pro Plan Active</h2>
                                <p className="text-green-100 text-sm mb-2">
                                    Plan: {subscriptionData.subscription_plan}
                                </p>
                                <p className="text-green-100 text-sm mb-2">
                                    {daysLeft} days remaining
                                </p>
                                <p className="text-green-100 text-xs">
                                    Payment ID: {subscriptionData.payment_id}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : subscriptionData && daysLeft === 0 ? (
                    <div className="flex justify-center mb-8">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-4 text-white max-w-md">
                            <div className="text-center">
                                <h2 className="text-lg font-bold mb-2">⚠️ Plan Expired</h2>
                                <p className="text-red-100 text-sm mb-2">
                                    Your {subscriptionData.subscription_plan} plan has expired
                                </p>
                                <button
                                    onClick={() => navigate('/pro-plans')}
                                    className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors text-sm"
                                >
                                    Renew Plan
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center mb-8">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white max-w-md">
                            <div className="text-center">
                                <h2 className="text-lg font-bold mb-2">🚀 Upgrade to Pro</h2>
                                <p className="text-purple-100 text-sm mb-3">
                                    To have more access to GenAI Sessions
                                </p>
                                <button
                                    onClick={() => navigate('/pro-plans')}
                                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-sm"
                                    style={{marginTop: '8px', cursor: 'pointer'}}
                                >
                                    Buy Pro Plan
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Activities Grid */}
                <div className="grid gap-6 mb-8">
                    <ActivityButton
                        activityType="jam"
                        path="/genai-jam"
                        title="GenAI Just A Minute Topics"
                        icon="🎤"
                    />
                    <ActivityButton
                        activityType="pronunciation"
                        path="/genai-pronunciation-test-spoken"
                        title="GenAI Pronunciation - Spoken Test"
                        icon="🗣️"
                    />
                    <ActivityButton
                        activityType="listening"
                        path="/profiledata"
                        title="GenAI Pronunciation - Listening Test"
                        icon="👂"
                    />
                </div>

                {/* Back Button */}
                <div className="text-center">
                    <Link
                        to="/profiledata"
                        className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        ← Back to Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Activities;