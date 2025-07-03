// GenAI_Interviewer_Res.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './genai_interviewer_res.css';
import { speakWithPolly, stopSpeech } from './PollyPlayer.jsx';
import MicrophoneRecorder from './MicrophoneRecorder.jsx';


function GenAI_Interviewer_Res() {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef(null);
    const [resume, setResume] = useState("");
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const sendResume = async (resumeContent) => {
        try {
            const res = await axios.post(
                'https://c9beky98gk.execute-api.ap-south-1.amazonaws.com/dev/upload-resume',
                {
                    body: { resume: resumeContent, sessionId: "test-user-002" }
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(res);
            const parsed = JSON.parse(res.data.body);
            const uploadMessage = parsed.message || 'Resume uploaded successfully!<br/> Now you can start your interview <br/>type hi... to start';
            
            setUploadStatus('✅ Resume uploaded successfully!');
            setResumeUploaded(true);
            
            const botMessage = {
                sender: 'bot',
                text: uploadMessage
            };
            setChat((prev) => [...prev, botMessage]);
        } catch (err) {
            console.error('API error:', err.response?.data || err.message);
            setUploadStatus('❌ Error: Could not upload resume.');
            setResumeUploaded(false);
            
            const errorMsg = {
                sender: 'bot',
                text: 'Error: Could not upload resume. Please try again.'
            };
            setChat((prev) => [...prev, errorMsg]);
        }
    };
    console.log(uploadStatus)

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
                    body: { message: textMessage, sessionId: "test-user-002" }
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

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadStatus('📄 Processing resume...');
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                setResume(content);
                
                // Send resume to API and get response
                sendResume(content);
                
                setTimeout(() => setUploadStatus(''), 5000);
            };
            reader.onerror = () => {
                setUploadStatus('❌ Error reading file. Please try again.');
                setResumeUploaded(false);
                setTimeout(() => setUploadStatus(''), 3000);
            };
            reader.readAsText(file);
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
                                <p style={{ fontSize: '17px' }}>👋 Hello! I'm your GenAI Agent.<br />Interviewer Based on your Resume</p>
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
            {resumeUploaded && (
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
            {!resumeUploaded && (
                <div className="resume-upload">
                    <div className="upload-container">
                        <input
                            type="file"
                            id="resume-input"
                            accept=".txt,.pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="resume-input" className="upload-btn">
                            <i className="fas fa-upload"></i>
                            Upload Resume
                        </label>
                        {uploadStatus && (
                            <div className={`upload-status ${uploadStatus.includes('Error') || uploadStatus.includes('❌') ? 'error' : 'success'}`}>
                                {uploadStatus}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {resumeUploaded && uploadStatus && (
                <div className="resume-success">
                    <div className="success-container">
                        <div className="success-message">
                            <i className="fas fa-check-circle"></i>
                            Resume Ready! You can now start the interview.
                        </div>
                    </div>
                </div>
            )}
            </div>
                <div className="instructions-panel">
                    <h3>Interview Instructions</h3>
                    <ul>
                        <li> * First Upload resume and type hi to start interview</li>
                        <li> * In case the Agent replay that send resume, type "resume sent"</li>
                        <li>🎯 Be clear and concise in your answers</li>
                        <li>🎤 Use voice or text to communicate</li>
                        <li>⏰ Take your time to think before answering</li>
                        <li>💼 Focus on your experience and skills</li>
                        <li>❓ Ask questions if you need clarification</li>
                    </ul>
                </div>
        </div>
    );
}




export default GenAI_Interviewer_Res;
