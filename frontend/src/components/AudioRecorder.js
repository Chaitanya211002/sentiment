import { useEffect, useRef, useCallback } from 'react';

const AudioRecorder = ({ isRecording, onTranscript, onError }) => {
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const connectToDeepgram = useCallback(() => {
    try {
      const deepgramApiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
      
      if (!deepgramApiKey) {
        console.error('Deepgram API key not found');
        return;
      }

      const socket = new WebSocket(
        'wss://api.deepgram.com/v1/listen?punctuate=true&interim_results=true&language=en-US',
        ['token', deepgramApiKey]
      );

      socketRef.current = socket;

      socket.onopen = () => {
        console.log('✓ Deepgram WebSocket connected');
      };

      socket.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          const transcript = data.channel?.alternatives?.[0]?.transcript;
          
          if (transcript && transcript.length > 0) {
            onTranscript({
              text: transcript,
              isFinal: data.is_final || false,
              confidence: data.channel?.alternatives?.[0]?.confidence || 0,
              timestamp: new Date()
            });
          }
        } catch (err) {
          console.error('Error parsing Deepgram message:', err);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      };

      socket.onclose = () => {
        console.log('Deepgram WebSocket closed');
      };

    } catch (error) {
      console.error('Error connecting to Deepgram:', error);
      if (onError) onError(error);
    }
  }, [onTranscript, onError]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        }
      });

      streamRef.current = stream;
      console.log('✓ Microphone access granted');

      connectToDeepgram();

      setTimeout(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          const mimeType = MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : 'audio/mp4';
          
          const mediaRecorder = new MediaRecorder(stream, { mimeType });
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
              socketRef.current.send(event.data);
            }
          };

          mediaRecorder.start(250);
          console.log('✓ Recording started');
        }
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      if (onError) onError(error);
    }
  }, [connectToDeepgram, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (socketRef.current) {
      socketRef.current.close();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => stopRecording();
  }, [isRecording, startRecording, stopRecording]);

  return null;
};

export default AudioRecorder;