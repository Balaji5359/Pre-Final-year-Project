import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './activities.css';

function ProPlanPayment() {
    const navigate = useNavigate();
    const [planData, setPlanData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const API_URL = 'https://jaumunpkj2.execute-api.ap-south-1.amazonaws.com/dev/post_field_data';

    useEffect(() => {
        const storedPlanData = localStorage.getItem('selectedPlanData');
        if (storedPlanData) {
            setPlanData(JSON.parse(storedPlanData));
        } else {
            navigate('/pro-plans');
        }
    }, [navigate]);

    const handlePayment = () => {
        if (!planData) return;

        const options = {
            key: 'YOUR_RAZORPAY_KEY_ID',
            amount: planData.amount * 100, // in paise
            currency: 'INR',
            name: 'AI SkillDev App',
            description: `Pro Plan - ${planData.type}`,
            handler: async function (response) {
                await handlePaymentSuccess(response);
            },
            prefill: {
                email: localStorage.getItem('email') || '',
            },
            theme: {
                color: '#3399cc',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handlePaymentSuccess = async (response) => {
        setIsProcessing(true);
        const email = localStorage.getItem('email');
        const currentDate = new Date();

        const paymentData = {
            email: email,
            data: {
                subscription_plan: planData.duration,
                amount: planData.amount,
                payment_status: 'success',
                payment_date: currentDate.toISOString().split('T')[0],
                payment_time: currentDate.toTimeString().split(' ')[0],
                plan_type: planData.type,
                payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
            }
        };

        try {
            const result = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (result.ok) {
                localStorage.setItem('userPlan', 'pro');
                localStorage.setItem('selectedPlan', planData.type);
                localStorage.removeItem('selectedPlanData');
                localStorage.removeItem('trialUsage');
                alert('Payment successful! Your Pro Plan is now active.');
                navigate('/activities');
            } else {
                throw new Error('Server error saving payment data');
            }
        } catch (err) {
            console.error(err);
            alert('Payment succeeded but failed to save subscription. Please contact support.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!planData) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 payment-container">
            <div className="payment-wrapper">
                {/* Header */}
                <div className="payment-card payment-header">
                    <h1 className="text-lg font-bold text-gray-800 mb-1">Congratulations!</h1>
                    <p className="text-gray-500 text-xs">You're about to upgrade to the Pro Plan</p>
                </div>

                {/* Plan Details */}
                <div className="payment-plan">
                    <div className="bg-white/20 rounded-full px-2 py-1 inline-block mb-2">
                        <span className="text-xs font-semibold uppercase">
                            {planData.type === 'monthly' ? 'Monthly' : '3 Months'}
                        </span>
                    </div>
                    <h2 className="text-lg font-bold mb-2">Pro Plan</h2>
                    <div className="flex items-baseline justify-center mb-2">
                        <span className="text-2xl font-bold">₹{planData.amount}</span>
                        <span className="text-sm ml-1 opacity-75">/{planData.duration}</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-xs">
                        <div>✨ More access to GenAI Sessions</div>
                        <div>📈 Advanced Analytics on sessions</div>
                        <div>🔒 and more...</div>
                    </div>
                </div>

                {/* Payment Button */}
                <div className="payment-card payment-actions">
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="back-to-plans"
                    >
                        {isProcessing ? (
                            <span>Processing...</span>
                        ) : (
                            <span style={{ color: 'green', cursor: 'pointer' }}>
                                Click here to Pay ₹{planData.amount}
                            </span>
                        )}
                    </button>

                    <button onClick={() => navigate('/pro-plans')} className="back-to-plans">
                        ← Back to Plans
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProPlanPayment;
