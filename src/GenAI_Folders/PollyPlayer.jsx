import { SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { polly } from './aws-config';

let currentAudio = null;

export const speakWithPolly = async (text) => {
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    // Check if text is valid
    if (!text || typeof text !== 'string') {
        console.warn('Invalid text provided to speakWithPolly');
        return;
    }

    // Clean text for better speech synthesis
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/\*\*/g, '').trim();
    
    if (!cleanText) return;

    try {
        const command = new SynthesizeSpeechCommand({
            OutputFormat: "mp3",
            Text: cleanText,
            VoiceId: "Joanna",
            Engine: "neural"
        });

        const data = await polly.send(command);
        
        if (data && data.AudioStream) {
            const audioBytes = await data.AudioStream.transformToByteArray();
            const blob = new Blob([audioBytes], { type: "audio/mp3" });
            const audioUrl = URL.createObjectURL(blob);
            currentAudio = new Audio(audioUrl);
            
            await currentAudio.play();
            
            // Clean up URL after audio ends
            currentAudio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                currentAudio = null;
            };
        }
    } catch (error) {
        console.error("Polly synthesis error:", error);
        fallbackToSpeechSynthesis(cleanText);
    }
};

export const stopSpeech = () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
};

// Fallback function using browser's built-in speech synthesis
const fallbackToSpeechSynthesis = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
    } else {
        console.warn("Speech synthesis not supported");
    }
};

export default speakWithPolly;