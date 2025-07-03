import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './genai_interviewer_res.css';
import { speakWithPolly, stopSpeech } from './PollyPlayer.jsx';
import MicrophoneRecorder from './MicrophoneRecorder.jsx';

function GenAI_Guidence() {
        const [chat, setChat] = useState([]);
        const [message, setMessage] = useState('');
        const [isMuted, setIsMuted] = useState(false);
        const [chatHistory, setChatHistory] = useState([]);
        const [showHistory, setShowHistory] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const chatRef = useRef(null);
        const [isRecording, setIsRecording] = useState(false);
        const [mediaRecorder, setMediaRecorder] = useState(null);
        const [sessionId, setSessionId] = useState('skill-route-001');


        const sessionIdget = () => {
            const newsessionId = sessionId || 'skill-route-001';
            //change random sessionId for each new session
            setSessionId(newsessionId + '-' + Math.random().toString(36).substring(2, 15));
            // console.log('New session ID:', newsessionId);
            return newsessionId;
        }

        const sendMessage = async (textMessage = message) => {
            if (!textMessage.trim()) return;
    
            const userMessage = { sender: 'user', text: textMessage };
            setChat((prev) => [...prev, userMessage]);
            setMessage('');
            setIsLoading(true);
    
            try {
                const res = await axios.post(
                    'https://c9beky98gk.execute-api.ap-south-1.amazonaws.com/dev',
                    {
                        body: { message: textMessage, sessionId: sessionIdget() },
                    },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
    
                const parsed = JSON.parse(res.data.body);
                const aiResponse = parsed.response;
    
                const botMessage = { sender: 'bot', text: aiResponse };
                setChat((prev) => [...prev, botMessage]);
    
                if (!isMuted) {
                    speakWithPolly(aiResponse);
                }
    
            } catch (err) {
                console.error('API error:', err.response?.data || err.message);
                const errorMsg = {
                    sender: 'bot',
                    text: 'Error: Could not get response from AI.'
                };
                setChat((prev) => [...prev, errorMsg]);
            } finally {
                setIsLoading(false);
            }
        };
    
        const handleVoiceTranscript = (transcript) => {
            if (transcript.trim()) {
                setMessage(transcript);
            }
        };
    
        const startRecording = () => {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                alert('Speech recognition not supported in this browser');
                return;
            }
    
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
    
            recognition.onstart = () => {
                setIsRecording(true);
            };
    
            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setMessage(finalTranscript.trim());
                }
            };
    
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };
    
            recognition.onend = () => {
                setIsRecording(false);
            };
    
            recognition.start();
            setMediaRecorder(recognition);
        };
    
        const stopRecording = () => {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                setIsRecording(false);
                setMediaRecorder(null);
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
                                if (!isMuted) {
                                    stopSpeech();
                                }
                            }}>
                                {isMuted ? '🔇 Muted' : '🔊 Sound'}
                            </button>
                            <button className='clear-btn' onClick={stopSpeech}>
                                ⏹️ Stop
                            </button>
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
                                    <p style={{ fontSize: '17px' }}>👋 Hello! I'm your GenAI Agent.<br />I here to give career guidance for you.</p>
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
                {(
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
                )}
                </div>
                    <div className="instructions-panel">
                        <h3>Instructions</h3>
                        <ul>
                            <li> * Type "hi" to start the conversation.</li>
                            <li> * Ask questions about career guidance, skills, or job opportunities.</li>
                            <li> * Use the microphone button to speak your queries.</li>
                            <li> * Speak politely, and be respectful in your interactions.</li>
                        </ul>
                    </div>
            </div>
    );
}

export default GenAI_Guidence;