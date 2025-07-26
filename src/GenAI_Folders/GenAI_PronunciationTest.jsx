import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MicrophoneRecorder from './MicrophoneRecorder.jsx';

function GenAI_PronunciationTest() {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');
    const [isMuted, setIsMuted] = useState(false);
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
                    
                    setTimeout(() => {
                        const finalText = accumulatedTextRef.current.trim();
                        if (finalText) {
                            const cleanText = finalText.replace(/(\\b\\w+\\b(?:\\s+\\b\\w+\\b)*?)\\s+\\1+/g, '$1');
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
        setMessage('');
        setAccumulatedText('');
        accumulatedTextRef.current = '';
        setIsSubmitting(false);
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
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(aiResponse.replace(/<[^>]*>/g, '').replace(/\\*\\*/g, ''));
                    utterance.rate = 0.8;
                    speechSynthesis.speak(utterance);
                }
            }

        } catch (err) {
            const errorMsg = {
                sender: 'bot',
                text: `Error: ${err.response?.status || 'Unknown'} - ${err.response?.data?.message || err.message || 'Could not get response from AI.'}`
            };
            setChat((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
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
            setAccumulatedText('');
            accumulatedTextRef.current = '';
            setMessage('');
            setIsSubmitting(false);
            startTimer();
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            
            if (finalTranscript.trim()) {
                setAccumulatedText(prev => {
                    const newAccumulated = prev + finalTranscript;
                    accumulatedTextRef.current = newAccumulated;
                    setMessage(newAccumulated + interimTranscript);
                    return newAccumulated;
                });
            } else if (interimTranscript.trim()) {
                setMessage(accumulatedTextRef.current + interimTranscript);
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
            
            setTimeout(() => {
                const finalText = accumulatedTextRef.current.trim();
                if (finalText) {
                    const cleanText = finalText.replace(/(\\b\\w+\\b(?:\\s+\\b\\w+\\b)*?)\\s+\\1+/g, '$1');
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
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/(\d+\.\s<strong>.*?<\/strong>)/g, '<div class="list-item">$1</div>')
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
                    <h3 style={{
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        margin: 0,
                        marginBottom: '24px'
                    }}>JAM Session Guide</h3>
                </div>
            </div>

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
                    <div style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                        padding: '20px',
                        color: 'white'
                    }}>
                        <h2 style={{
                            fontSize: '30px',
                            fontWeight: 'bold',
                            margin: 0
                        }}>GenAI JAM Agent</h2>
                    </div>

                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '22px',
                        background: 'linear-gradient(180deg, rgba(249, 250, 251, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)'
                    }} ref={chatRef}>
                        {chat.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                paddingTop: '64px',
                                paddingBottom: '64px'
                            }}>
                                <h3 style={{
                                    fontSize: '28px',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    marginBottom: '8px'
                                }}>Welcome to JAM Session!</h3>
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
                                    ...(msg.sender === 'user' ? {
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                        color: 'white'
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

                    <div style={{
                        borderTop: '1px solid #f3f4f6',
                        padding: '32px',
                        background: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        {isRecording && (
                            <div style={{
                                textAlign: 'center',
                                marginBottom: '16px',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%)',
                                borderRadius: '12px'
                            }}>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: timer > 50 ? '#dc2626' : '#16a34a'
                                }}>
                                    🎙️ Recording: {timer}s / 60s
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
                                    fontSize: '18px',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={toggleRecording}
                                    disabled={isLoading}
                                    style={{
                                        flex: 1,
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: isRecording 
                                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                            : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                        color: 'white'
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
                                        opacity: isLoading || !message.trim() ? 0.5 : 1
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

export default GenAI_PronunciationTest;