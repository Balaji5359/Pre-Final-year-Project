import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './activities.css';
function ProPlans() {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState('monthly');

    useEffect(() => {
        // Make user free from start
        localStorage.removeItem('userPlan');
        localStorage.removeItem('selectedPlan');
        localStorage.removeItem('trialUsage');
    }, []);

    const handleUpgrade = (planType) => {
        // Simulate payment process
        localStorage.setItem('userPlan', 'pro');
        localStorage.setItem('selectedPlan', planType);
        
        // Clear trial usage
        localStorage.removeItem('trialUsage');
        
        // Navigate back to activities
        navigate('/activities');
    };

    const handleFreePlan = () => {
        localStorage.removeItem('userPlan');
        localStorage.removeItem('selectedPlan');
        localStorage.removeItem('trialUsage');
        alert('Welcome to the Free Tier! You can upgrade anytime.');
        navigate('/activities');
    };

    const makeFree = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handlePayment = (planType) => {
        const planName = planType === 'monthly' ? 'Monthly Plan' : '3 Months Plan';
        alert(`Redirecting to payment gateway for ${planName}...`);
        setTimeout(() => {
            handleUpgrade(planType);
        }, 1000);
    };

    const plans = [
        {
            id: 'free',
            name: 'Free Tier',
            price: '₹0',
            period: '/one time',
            description: 'Perfect for getting started',
            features: [
                'One time access to the GenAI JAM Session',
                'One time access to the GenAI Pronunciation Test-Spoken',
                'One time access to the GenAI Pronunciation Test-Listening',
                'One 30-min Interview with GenAI-Based on Resume',
                'Standard updates'
            ],
            buttonText: 'Get Started',
            popular: false,
            color: 'from-blue-500 to-blue-600',
            buttonAction: () => handleFreePlan()
        },
        {
            id: 'monthly',
            name: 'Monthly Plan',
            price: '₹199',
            period: '/month',
            description: 'Best value for regular users',
            features: [
                'Daily 5 GenAI JAM Sessions and Personalized Feedback',
                'Daily 5 GenAI Pronunciation Test-Spoken and Personalized Feedback',
                'Daily 5 GenAI Pronunciation Test-Listening and Personalized Feedback',
                'Daily 5 Personalized Pronunciation Pro Practice with GenAI-powered Feedback',
                'Daily 1 30-min Interview with GenAI-Based on Resume',
                'Daily 1 30-min Personality-Based (HR) Interview with GenAI',
                'Daily 1 30-min Job-Specific (Technical) Interview with GenAI',
                'Analytics Dashboard'
            ],
            buttonText: 'Get Offer',
            popular: true,
            color: 'from-purple-500 to-pink-500',
            buttonAction: () => handlePayment('monthly')
        },
        {
            id: '3-months',
            name: '3 Months Plan',
            price: '₹499',
            period: '/3 months',
            description: 'Ultimate value for serious learners',
            features: [
                'Daily 10 GenAI JAM Sessions and Personalized Feedback',
                'Daily 10 GenAI Pronunciation Test-Spoken and Personalized Feedback',
                'Daily 10 GenAI Pronunciation Test-Listening and Personalized Feedback',
                'Daily 10 Personalized Pronunciation Pro Practice with GenAI-powered Feedback',
                'Daily 2 30-min Interview with GenAI-Based on Resume',
                'Daily 2 30-min Personality-Based (HR) Interview with GenAI',
                'Daily 2 30-min Job-Specific (Technical) Interview with GenAI',
                'Analytics Dashboard'
            ],
            buttonText: 'Get Offer',
            popular: false,
            color: 'from-emerald-500 to-teal-600',
            buttonAction: () => handlePayment('quarterly')
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16" style={{marginTop: '60px'}}>
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Choose Your Pro Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Unlock unlimited access to all communication activities and advanced AI-powered features
                    </p>
                </div>

                

                {/* Pricing Plans */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                                plan.popular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
                            } ${
                                selectedPlan === plan.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                            }`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-semibold">
                                    🔥 MOST POPULAR
                                </div>
                            )}
                            
                            <div className={`bg-gradient-to-r ${plan.color} p-6 text-white ${plan.popular ? 'pt-12' : ''}`}>
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-blue-100 mb-4">{plan.description}</p>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-lg ml-1">{plan.period}</span>
                                </div>
                                {plan.originalPrice && (
                                    <p className="text-blue-200 line-through text-sm mt-1">
                                        {plan.originalPrice}
                                    </p>
                                )}
                            </div>

                            <div className="p-6">
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        plan.buttonAction();
                                    }}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 bg-gradient-to-r ${plan.color} hover:shadow-lg`}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Back Button */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/activities')}
                        className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        ← Back to Activities
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProPlans;