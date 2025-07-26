import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// import './genai_interviewer_res.css'; // Removed - using Tailwind CSS
// import { speakWithPolly, stopSpeech } from './PollyPlayer.jsx'; // Disabled due to credential issues
import MicrophoneRecorder from './MicrophoneRecorder.jsx';

function GenAI_JAM() {
        const [chat, setChat] = useState([]);
        const [message, setMessage] = useState('');
        const [isMuted, setIsMuted] = useState(false);
        const [chatHistory, setChatHistory] = useState([]);
        const [showHistory, setShowHistory] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const chatRef = useRef(null);
        const [isRecording, setIsRecording] = useState(false);
        const [mediaRecorder, setMediaRecorder] = useState(null);
        const [sessionId] = useState('jam-session-' + Math.random().toString(36).substring(2, 15));
        const [timer, setTimer] = useState(0);
        const [timerInterval, setTimerInterval] = useState(null);
        const [accumulatedText, setAccumulatedText] = useState('');
        const [isSubmitting, setIsSubmitting] = useState(false);
        const accumulatedTextRef = useRef('');
        const mediaRecorderRef = useRef(null);
        const isRecordingRef = useRef(false);


        const sessionIdget = () => {
            return sessionId;
        }
        
        const startTimer = () => {
            const interval = setInterval(() => {
                setTimer(prev => {
                    const newTime = prev + 1;
                    if (newTime >= 60) {
                        // Auto-submit at exactly 60 seconds
                        console.log('Timer reached 60 seconds, auto-submitting...');
                        
                        if (mediaRecorderRef.current && isRecordingRef.current) {
                            setIsSubmitting(true);
                            mediaRecorderRef.current.stop();
                            setIsRecording(false);
                            isRecordingRef.current = false;
                            setMediaRecorder(null);
                            mediaRecorderRef.current = null;
                        }
                        
                        clearInterval(interval);
                        setTimerInterval(null);
                        setTimer(0);
                        
                        // Submit accumulated text immediately
                        setTimeout(() => {
                            const finalText = accumulatedTextRef.current.trim();
                            console.log('Submitting text:', finalText);
                            if (finalText) {
                                const cleanText = finalText.replace(/(\b\w+\b(?:\s+\b\w+\b)*?)\s+\1+/g, '$1');
                                sendMessage(cleanText);
                            }
                        }, 100);
                        
                        return 60;
                    }
                    return newTime;
                });
            }, 1000);
            setTimerInterval(interval);
        }
        
        const stopTimer = () => {
            if (timerInterval) {
                clearInterval(timerInterval);
                setTimerInterval(null);
            }
            setTimer(0);
        }

        const sendMessage = async (textMessage = message) => {
            if (!textMessage.trim()) return;
    
            const userMessage = { sender: 'user', text: textMessage };
            setChat((prev) => [...prev, userMessage]);
            setMessage(''); // Clear message box immediately
            setAccumulatedText(''); // Clear accumulated text
            accumulatedTextRef.current = ''; // Clear ref
            setIsSubmitting(false); // Reset submission flag
            setIsLoading(true);
    
            try {
                const res = await axios.post(
                    'https://c9beky98gk.execute-api.ap-south-1.amazonaws.com/dev/activity-jam',
                    JSON.stringify({
                        message: textMessage, 
                        sessionId: sessionIdget()
                    }),
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
    
                console.log('Full response:', res.data);
                
                // Handle different response formats
                let aiResponse;
                if (res.data.body) {
                    const parsed = JSON.parse(res.data.body);
                    aiResponse = parsed.response;
                } else {
                    aiResponse = res.data.response;
                }
                
                aiResponse = aiResponse || 'No response received';
    
                const botMessage = { sender: 'bot', text: aiResponse };
                setChat((prev) => [...prev, botMessage]);
    
                if (!isMuted && aiResponse && typeof aiResponse === 'string') {
                    // Use browser's built-in speech synthesis instead of Polly
                    if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(aiResponse.replace(/<[^>]*>/g, '').replace(/\*\*/g, ''));
                        utterance.rate = 0.8;
                        speechSynthesis.speak(utterance);
                    }
                }
    
            } catch (err) {
                console.error('Full API error:', err);
                console.error('Response data:', err.response?.data);
                console.error('Response status:', err.response?.status);
                console.error('Response headers:', err.response?.headers);
                
                const errorMsg = {
                    sender: 'bot',
                    text: `Error: ${err.response?.status || 'Unknown'} - ${err.response?.data?.message || err.message || 'Could not get response from AI.'}`
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
                isRecordingRef.current = true;
                setAccumulatedText(''); // Clear previous text
                accumulatedTextRef.current = '';
                setMessage(''); // Clear message box
                setIsSubmitting(false); // Reset submission flag
                startTimer();
            };
    
            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';
                
                // Only process new results from the last result index
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                // Only add new final transcript to avoid duplicates
                if (finalTranscript.trim()) {
                    setAccumulatedText(prev => {
                        const newAccumulated = prev + finalTranscript;
                        accumulatedTextRef.current = newAccumulated;
                        setMessage(newAccumulated + interimTranscript);
                        return newAccumulated;
                    });
                } else if (interimTranscript.trim()) {
                    // Show interim with current accumulated
                    setMessage(accumulatedTextRef.current + interimTranscript);
                }
            };
    
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };
    
            recognition.onend = () => {
                setIsRecording(false);
                // Don't auto-submit here, let timer handle it
            };
    
            recognition.start();
            setMediaRecorder(recognition);
            mediaRecorderRef.current = recognition;
        };
    
        const stopRecording = () => {
            if (mediaRecorderRef.current && isRecordingRef.current && !isSubmitting) {
                setIsSubmitting(true);
                mediaRecorderRef.current.stop();
                setIsRecording(false);
                isRecordingRef.current = false;
                setMediaRecorder(null);
                mediaRecorderRef.current = null;
                stopTimer();
                
                // Submit the accumulated text
                setTimeout(() => {
                    const finalText = accumulatedTextRef.current.trim();
                    if (finalText) {
                        // Clean up duplicate phrases
                        const cleanText = finalText.replace(/(\b\w+\b(?:\s+\b\w+\b)*?)\s+\1+/g, '$1');
                        sendMessage(cleanText);
                    }
                }, 200);
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
        
        useEffect(() => {
            console.log('Session ID:', sessionId);
            return () => {
                if (timerInterval) {
                    clearInterval(timerInterval);
                }
            };
        }, [timerInterval]);
    
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
            <div style={{
                display: 'flex',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 50%, #e0e7ff 100%)',
                padding: '40px 16px 16px 16px',
                gap: '20px',
                paddingTop: '100px'
            }}>
                {/* Instructions Panel - Left Side */}
                <div style={{
                    width: '500px',
                    flexShrink: 0
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        height: 'calc(100vh - 120px)',
                        padding: '25px',
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}>
                                📋
                            </div>
                            <h3 style={{
                                fontSize: '30px',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                margin: 0
                            }}>JAM Session Guide</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{
                                padding: '16px',
                                background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #3b82f6',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}>
                                <p style={{
                                    fontSize: '17px',
                                    color: '#374151',
                                    fontWeight: '500',
                                    margin: 0
                                }}>💬 Start with greeting: <span style={{ fontWeight: 'bold', color: '#2563eb' }}>"hi"</span></p>
                            </div>
                            <div style={{
                                padding: '16px',
                                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #22c55e',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}>
                                <p style={{
                                    fontSize: '17px',
                                    color: '#374151',
                                    fontWeight: '500',
                                    margin: 0
                                }}>🎯 Type <span style={{ fontWeight: 'bold', color: '#16a34a' }}>yes</span> then Agent will <span style={{ fontWeight: 'bold', color: '#16a34a' }}>start session</span></p>
                            </div>
                            <div style={{
                                padding: '16px',
                                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #eab308',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}>
                                <p style={{
                                    fontSize: '17px',
                                    color: '#374151',
                                    fontWeight: '500',
                                    margin: 0
                                }}>🎯 Choose <span style={{ fontWeight: 'bold', color: '#2563eb' }}>1 topic</span> Agent will provide 2 topics and speak for <span style={{ fontWeight: 'bold', color: '#2563eb' }}>1 minute</span></p>
                            </div>
                            <div style={{
                                padding: '16px',
                                background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #a855f7',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}>
                                <p style={{
                                    fontSize: '17px',
                                    color: '#374151',
                                    fontWeight: '500',
                                    margin: 0
                                }}>🎤 Remember the rules, when you click <span style={{ fontWeight: 'bold', color: '#2563eb' }}>Record </span>
                                it will <span style={{ fontWeight: 'bold', color: 'red' }}>start recording voice</span>, when <span style={{ fontWeight: 'bold', color: '#2563eb' }}>clicked </span>again <span style={{ fontWeight: 'bold', color: 'red' }}>stop recording</span></p>
                            </div>
                            <div style={{
                                padding: '16px',
                                background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #ef4444',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}>
                                <p style={{
                                    fontSize: '17px',
                                    color: '#374151',
                                    fontWeight: '500',
                                    margin: 0
                                }}>💭 Take time for <span style={{ fontWeight: 'bold', color: '#2563eb' }}>30 sec </span>to think before starting,
                                you can also use <span style={{ fontWeight: 'bold', color: '#2563eb' }}>1 minute</span> to record your voice
                                </p>
                            </div>
                            <div style={{
                                padding: '16px',
                                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #14b8a6',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}>
                                <p style={{
                                    fontSize: '17px',
                                    color: '#374151',
                                    fontWeight: '500',
                                    margin: 0
                                }}>📊 After <span style={{ fontWeight: 'bold', color: '#2563eb' }}>1 minute </span>
                                the content will be auto submitted and you will get <span style={{ fontWeight: 'bold', color: '#2563eb' }}>Agent feedback</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Bot - Right Side */}
                <div style={{ maxWidth: '1000px', flex: 1 }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        height: 'calc(100vh - 120px)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                            padding: '20px',
                            color: 'white'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backdropFilter: 'blur(10px)',
                                        fontSize: '24px'
                                    }}>
                                        🤖
                                    </div>
                                    <div>
                                        <h2 style={{
                                            fontSize: '30px',
                                            fontWeight: 'bold',
                                            margin: 0,
                                            background: 'linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>GenAI JAM Agent</h2>
                                        <p style={{
                                            color: '#dbeafe',
                                            fontSize: '14px',
                                            margin: 0
                                        }}>Your AI-powered speaking coach</p>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: '12px'
                                }}>
                                    <button 
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            transition: 'all 0.3s ease',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                                        onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                                        onClick={() => window.location.href = '/activities'}
                                    >
                                        ← Back
                                    </button>
                                    <button 
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 16px',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            backdropFilter: 'blur(10px)',
                                            fontSize: '16px'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                                        onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                                        onClick={() => {
                                            setIsMuted(!isMuted);
                                            if (!isMuted && 'speechSynthesis' in window) {
                                                speechSynthesis.cancel();
                                            }
                                        }}
                                    >
                                        {isMuted ? '🔇' : '🔊'}
                                    </button>
                                    <button 
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 16px',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            backdropFilter: 'blur(10px)',
                                            fontSize: '16px'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                                        onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                                        onClick={() => {
                                            if ('speechSynthesis' in window) {
                                                speechSynthesis.cancel();
                                            }
                                        }}
                                    >
                                        ⏹️
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '22px',
                            background: 'linear-gradient(180deg, rgba(249, 250, 251, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)'
                        }} ref={chatRef}>
                            {chat.length === 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    paddingTop: '0px',
                                    paddingBottom: '64px'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                                        width: '70px',
                                        height: '70px',
                                        borderRadius: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px auto',
                                        fontSize: '48px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        animation: 'pulse 2s infinite'
                                    }}>
                                        👋
                                    </div>
                                    <h3 style={{
                                        fontSize: '28px',
                                        fontWeight: 'bold',
                                        color: '#1f2937',
                                        marginBottom: '8px'
                                    }}>Welcome to JAM Session!</h3>
                                    <p style={{
                                        fontSize: '15px',
                                        color: '#4b5563',
                                        lineHeight: '1.6',
                                        maxWidth: '400px',
                                        margin: '0 auto'
                                    }}>
                                        I'm your GenAI Agent ready to help you practice speaking.<br />
                                        <span style={{ color: '#4f46e5', fontWeight: '600' }}>Let's start your JAM session!</span>
                                    </p>
                                </div>
                            )}
                            {chat.map((msg, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{
                                        maxWidth: '600px',
                                        padding: '16px 24px',
                                        borderRadius: '24px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        ...(msg.sender === 'user' ? {
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                            color: 'white',
                                            marginLeft: 'auto'
                                        } : {
                                            background: 'white',
                                            border: '1px solid #f3f4f6',
                                            color: '#1f2937'
                                        })
                                    }}>
                                        <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div style={{
                            borderTop: '1px solid #f3f4f6',
                            padding: '32px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {isRecording && (
                                <div style={{
                                    textAlign: 'center',
                                    marginBottom: '16px',
                                    padding: '16px',
                                    background: 'linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%)',
                                    borderRadius: '12px',
                                    border: '1px solid #fecaca',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <div style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        marginBottom: '8px',
                                        color: timer > 50 ? '#dc2626' : '#16a34a',
                                        animation: timer > 50 ? 'pulse 1s infinite' : 'none'
                                    }}>
                                        🎙️ Recording: {timer}s / 60s
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        background: '#e5e7eb',
                                        borderRadius: '9999px',
                                        height: '8px',
                                        boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                                    }}>
                                        <div style={{
                                            height: '8px',
                                            borderRadius: '9999px',
                                            transition: 'all 1s ease',
                                            background: timer > 50 
                                                ? 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)' 
                                                : 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
                                            width: `${(timer/60)*100}%`
                                        }}></div>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder='Type "hi" to start your JAM session...'
                                    disabled={isLoading}
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '24px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '16px',
                                        resize: 'none',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        background: 'rgba(249, 250, 251, 0.5)',
                                        fontSize: '18px',
                                        fontFamily: 'inherit',
                                        color: '#1f2937'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#4f46e5';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
                                        e.target.style.background = 'white';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
                                        e.target.style.background = 'rgba(249, 250, 251, 0.5)';
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={toggleRecording}
                                        disabled={isLoading}
                                        title={isRecording ? 'Stop Recording' : 'Start 1-Minute Recording'}
                                        style={{
                                            flex: 1,
                                            padding: '12px 20px',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            background: isRecording 
                                                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                            color: 'white'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'scale(1.02)';
                                            e.target.style.background = isRecording 
                                                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                                                : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                            e.target.style.background = isRecording 
                                                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                                        }}
                                    >
                                        {isRecording ? `🔴 ${timer}s` : '🎤 Record'}
                                    </button>
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={isLoading || !message.trim()}
                                        style={{
                                            flex: 1,
                                            padding: '12px 20px',
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                            color: 'white',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            border: 'none',
                                            cursor: isLoading || !message.trim() ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.3s ease',
                                            opacity: isLoading || !message.trim() ? 0.5 : 1,
                                            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                                        }}
                                        onMouseOver={(e) => {
                                            if (!isLoading && message.trim()) {
                                                e.target.style.transform = 'scale(1.02)';
                                                e.target.style.background = 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                            e.target.style.background = 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
                                        }}
                                    >
                                        {isLoading ? '⏳ Sending...' : '📤 Send'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default GenAI_JAM;