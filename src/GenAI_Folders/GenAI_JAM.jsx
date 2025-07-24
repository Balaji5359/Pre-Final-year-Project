import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './genai_interviewer_res.css';
import { speakWithPolly, stopSpeech } from './PollyPlayer.jsx';

const GenAI_JAM = () => {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recognitionInstance, setRecognitionInstance] = useState(null);
    const [sessionId, setSessionId] = useState('skill-route-001');

    // Generate a new session ID for each request
    const sessionIdget = () => {
        const newSessionId = 'skill-route-001-' + Math.random().toString(36).substring(2, 15);
        setSessionId(newSessionId);
        return newSessionId;
    };

    const sendMessage = async (textMessage = message) => {
        if (!textMessage.trim()) return;

        const userMessage = { sender: 'user', text: textMessage };
        setChat(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            // Wrap payload as required by backend
            const payload = {
                body: JSON.stringify({
                    sessionId: sessionIdget(),
                    message: textMessage
                })
            };

            const res = await axios.post(
                'https://c9beky98gk.execute-api.ap-south-1.amazonaws.com/dev/activity-jam',
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            let aiResponse = 'No response from AI';

            // Log the full response for debugging
            console.log('AI raw response:', res.data);

            // Try to extract reply from different possible locations
            if (res.data?.body) {
                let parsedBody;
                try {
                    parsedBody = typeof res.data.body === 'string'
                        ? JSON.parse(res.data.body)
                        : res.data.body;
                } catch (e) {
                    parsedBody = {};
                }
                aiResponse =
                    parsedBody.reply ||
                    parsedBody.message ||
                    parsedBody.text ||
                    parsedBody.error ||
                    'No reply found';
            } else if (res.data?.reply) {
                aiResponse = res.data.reply;
            } else if (res.data?.message) {
                aiResponse = res.data.message;
            } else if (res.data?.text) {
                aiResponse = res.data.text;
            }

            if (typeof aiResponse === 'object') aiResponse = JSON.stringify(aiResponse);

            const botMessage = { sender: 'bot', text: aiResponse };
            setChat(prev => [...prev, botMessage]);

            if (!isMuted && aiResponse) speakWithPolly(aiResponse);

        } catch (err) {
            console.error('API error:', err.response?.data || err.message);
            setChat(prev => [...prev, { sender: 'bot', text: 'Error: Could not get response from AI.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const startRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition not supported in this browser');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) setMessage(finalTranscript.trim());
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);

        recognition.start();
        setRecognitionInstance(recognition);
    };

    const stopRecording = () => {
        if (recognitionInstance && isRecording) {
            recognitionInstance.stop();
            setIsRecording(false);
            setRecognitionInstance(null);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [chat]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    const formatMessage = (text) => {
        if (!text || typeof text !== 'string') return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/(\d+\.\s\*\*.*?\*\*)/g, '<div class="list-item">$1</div>')
            .replace(/\n/g, '<br/>')
            .replace(/###/g, '<strong></strong>');
    };

    return (
        <div className="main-container">
            <div className="chat-container">
                <div className="chat-header">
                    <h2>GenAI Agent</h2>
                    <div className="header-buttons">
                        <button className='clear-btn' onClick={() => window.location.href = '/activities'}>Back</button>
                        <button className='clear-btn' onClick={() => {
                            setIsMuted(!isMuted);
                            if (!isMuted) stopSpeech();
                        }}>
                            {isMuted ? '🔇 Muted' : '🔊 Sound'}
                        </button>
                        <button className='clear-btn' onClick={stopSpeech}>⏹️ Stop</button>
                    </div>
                </div>
                <div className="chat-box" ref={chatRef}>
                    {showHistory ? (
                        <div className="history-view">
                            <h3>Chat History</h3>
                            {chatHistory.length === 0 ? (
                                <p>No chat history available</p>
                            ) : (
                                chatHistory.map((msg, i) => (
                                    <div key={i} className={`chat-message ${msg.sender}`}>
                                        <div className="message-content">
                                            <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <>
                            {chat.length === 0 && (
                                <div className="welcome-message">
                                    <p style={{ fontSize: '17px' }}>
                                        👋 Hello! I'm your GenAI Agent.<br />I will conduct JAM session for you.
                                    </p>
                                </div>
                            )}
                            {chat.map((msg, i) => (
                                <div key={i} className={`chat-message ${msg.sender}`}>
                                    <div className="message-content">
                                        <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="chat-input">
                    <div className="input-row">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder='Type "hi" to start interview...'
                            disabled={isLoading}
                        />
                        <button
                            className={`send-btn ${isRecording ? 'recording' : ''}`}
                            onClick={toggleRecording}
                            disabled={isLoading}
                            title={isRecording ? 'Stop Recording' : 'Start Recording'}
                        >
                            {isRecording ? '🔴' : '🎤'}
                        </button>
                        <button
                            className="send-btn"
                            onClick={() => sendMessage()}
                            disabled={isLoading || !message.trim()}
                        >
                            {isLoading ? '⏳' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="instructions-panel">
                <h3>JAM Session Instructions</h3>
                <ul>
                    <li> * Give greetings to Agent as "hi"</li>
                    <li> * Agent will provide topic to speak, if you know topic then speak on that topic for 1 minute</li>
                    <li> * If you don't know topic then say "I don't know about this topic" agent will give new topic</li>
                    <li> * Use voice or text to communicate</li>
                    <li> * Take your time to think before starting JAM</li>
                    <li> * Finally ask agent for feedback and rating</li>
                </ul>
            </div>
        </div>
    );
};

export default GenAI_JAM;
