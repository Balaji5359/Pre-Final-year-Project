import React, { useState, useRef } from 'react';
import { startTranscription } from './TranscribeStream.js';

const SimpleVoiceRecorder = ({ onTranscript, disabled }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const stopRecordingRef = useRef(null);

    const handleStartRecording = async () => {
        setIsRecording(true);
        
        const handleTranscript = (transcript) => {
            console.log('Transcript received:', transcript);
            onTranscript(transcript);
            setIsRecording(false);
            setIsProcessing(false);
        };

        const handleError = (error) => {
            console.error('Transcription error:', error);
            // Fallback to Web Speech API
            fallbackToWebSpeech();
        };

        try {
            const stopFunction = await startTranscription(handleTranscript, handleError);
            stopRecordingRef.current = stopFunction;
        } catch (error) {
            console.error('Failed to start recording:', error);
            setIsRecording(false);
            fallbackToWebSpeech();
        }
    };

    const handleStopRecording = () => {
        if (stopRecordingRef.current) {
            stopRecordingRef.current();
            stopRecordingRef.current = null;
        }
        setIsRecording(false);
        setIsProcessing(true);
    };

    const fallbackToWebSpeech = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition not supported in this browser');
            setIsRecording(false);
            setIsProcessing(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onTranscript(transcript);
            setIsRecording(false);
            setIsProcessing(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
            setIsProcessing(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
            setIsProcessing(false);
        };

        recognition.start();
    };

    const toggleRecording = () => {
        if (isRecording) {
            handleStopRecording();
        } else {
            handleStartRecording();
        }
    };

    return (
        <button
            className={`voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            disabled={disabled || isProcessing}
            title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
        >
            {isProcessing ? '⏳' : isRecording ? '⏹️' : '🎤'}
        </button>
    );
};

export default SimpleVoiceRecorder;