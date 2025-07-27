import React from "react";
import { useNavigate } from "react-router-dom";
import "./activities.css";

function Activities() {
    const navigate = useNavigate();

    const ActivityButton = ({ path, title, icon }) => {
        return (
            <div className="relative group">
                <button
                    onClick={() => navigate(path)}
                    className="w-full p-6 rounded-xl border-2 transition-all duration-300 text-left bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg cursor-pointer"
                >
                    <div className="flex items-center space-x-4">
                        <div className="text-2xl text-blue-600">
                            {icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800">
                                {title}
                            </h3>
                        </div>
                    </div>
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8" style={{marginTop: '100px'}}>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Gen-AI Agent Activities
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Enhance your communication, technical, interview and other
                        placement related skills with AI-powered activities
                    </p>
                </div>

                {/* Activity Boxes */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <ActivityButton
                        path="/genai-jam"
                        title="GenAI JAM Test - Spoken"
                        icon="🎤"
                    />
                    <ActivityButton
                        path="/genai-pronunciation-test-spoken"
                        title="Pronunciation Test - Spoken"
                        icon="🗣️"
                    />
                    <ActivityButton
                        path="/profiledata"
                        title="Pronunciation Test - Listening"
                        icon="👂"
                    />
                    <ActivityButton
                        path="/profiledata"
                        title="Pronunciation Pro Practice"
                        icon="📚"
                    />
                    <ActivityButton
                        path="/profiledata"
                        title="Resume-Based Interview"
                        icon="📄"
                    />
                    <ActivityButton
                        path="/profiledata"
                        title="HR Interview"
                        icon="👔"
                    />
                    <ActivityButton
                        path="/profiledata"
                        title="Technical Interview"
                        icon="💻"
                    />
                </div>

                {/* Back Button */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/profiledata')}
                        className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        ← Back to Profile
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Activities;