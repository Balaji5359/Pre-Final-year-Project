// TranscribeStream.js
import {
    TranscribeStreamingClient,
    StartStreamTranscriptionCommand,
} from "@aws-sdk/client-transcribe-streaming";

const client = new TranscribeStreamingClient({
    region: import.meta.env.VITE_AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_TRANS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_TRANS_SECRET_ACCESS_KEY
    },
});

export async function startTranscription(onTranscript, onError) {
    let mediaRecorder;
    let stream;

    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                sampleRate: 16000,
                channelCount: 1
            }
        });

        mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            try {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const arrayBuffer = await audioBlob.arrayBuffer();
                const audioData = new Uint8Array(arrayBuffer);

                const command = new StartStreamTranscriptionCommand({
                    LanguageCode: "en-US",
                    MediaEncoding: "webm",
                    MediaSampleRateHertz: 16000,
                    AudioStream: (async function* () {
                        yield {
                            AudioEvent: {
                                AudioChunk: audioData,
                            },
                        };
                    })(),
                });

                const response = await client.send(command);
                
                for await (const event of response.TranscriptResultStream) {
                    if (event.TranscriptEvent) {
                        const results = event.TranscriptEvent.Transcript.Results;
                        for (const result of results || []) {
                            if (result.Alternatives && result.Alternatives.length > 0 && !result.IsPartial) {
                                const transcript = result.Alternatives[0].Transcript;
                                if (transcript && transcript.trim()) {
                                    onTranscript(transcript);
                                    return;
                                }
                            }
                        }
                    }
                }
                
                // If no transcript found, try fallback
                onError("No speech detected");
                
            } catch (error) {
                console.error("Transcription error:", error);
                onError(error.message);
            } finally {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        };

        mediaRecorder.start();
        
        // Return stop function
        return () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        };

    } catch (error) {
        console.error("Media access error:", error);
        onError("Microphone access denied");
        return null;
    }
}