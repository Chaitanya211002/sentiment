import { useState, useCallback } from 'react';

export const useDeepgram = () => {
  const [transcript, setTranscript] = useState([]);
  const [currentInterim, setCurrentInterim] = useState('');
  const [error, setError] = useState(null);

  const handleTranscript = useCallback((data) => {
    if (data.isFinal) {
      // Add final transcript to history
      setTranscript(prev => [...prev, {
        text: data.text,
        timestamp: data.timestamp,
        confidence: data.confidence,
        isFinal: true
      }]);
      setCurrentInterim(''); // Clear interim text
    } else {
      // Update interim transcript
      setCurrentInterim(data.text);
    }
  }, []);

  const handleError = useCallback((err) => {
    console.error('Recording error:', err);
    setError(err.message || 'An error occurred');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    setCurrentInterim('');
  }, []);

  return {
    transcript,
    currentInterim,
    error,
    handleTranscript,
    handleError,
    clearTranscript
  };
};