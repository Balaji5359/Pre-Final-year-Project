import React, { useState, useRef, useEffect } from 'react';

const MicrophoneRecorder = ({ onTranscript, disabled }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if speech recognition is supported
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        const recognition = recognitionRef.current;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setHasPermission(true);
            console.log('Speech recognition started');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('Transcript:', transcript);
            onTranscript(transcript);
            setIsRecording(false);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
            setIsListening(false);
            
            if (event.error === 'not-allowed') {
                setHasPermission(false);
                alert('Microphone access denied. Please:\n1. Click the microphone icon in your browser address bar\n2. Allow microphone access\n3. Refresh the page and try again');
            } else if (event.error === 'no-speech') {
                alert('No speech detected. Please speak clearly and try again.');
            } else if (event.error === 'network') {
                alert('Network error. Please check your internet connection.');
            }
        };

        recognition.onend = () => {
            setIsRecording(false);
            setIsListening(false);
            console.log('Speech recognition ended');
        };

        return () => {
            if (recognition) {
                recognition.abort();
            }
        };
    }, [onTranscript]);

    const requestMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setHasPermission(true);
            return true;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            setHasPermission(false);
            alert('Microphone access is required. Please allow microphone access in your browser settings.');
            return false;
        }
    };

    const startRecording = async () => {
        if (!recognitionRef.current) {
            alert('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        // Check microphone permission first
        if (hasPermission === null || hasPermission === false) {
            const permitted = await requestMicrophonePermission();
            if (!permitted) return;
        }

        try {
            setIsRecording(true);
            recognitionRef.current.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            setIsRecording(false);
            alert('Error starting voice recognition. Please try again.');
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <button
            type="button"
            style={{ width: '60px', height: '70px', borderRadius: '50%', 
                fontSize: '28px', backgroundColor: '#f0f0f0', cursor: 'pointer',
                hover: { backgroundColor: 'red' } }}
            className={`voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            disabled={disabled}
            title={isRecording ? 'Stop Recording (Click or speak to stop)' : 'Start Voice Recording'}
        >
            {isListening ? '🔴' : isRecording ? '⏹️' : 'a'}
        </button>
    );
};

export default MicrophoneRecorder;