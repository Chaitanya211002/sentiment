import { useState, useCallback } from 'react';
import axios from 'axios';

export const useSentimentAnalysis = () => {
  const [sentiment, setSentiment] = useState(0);
  const [sentimentLabel, setSentimentLabel] = useState('neutral');
  const [keywords, setKeywords] = useState([]);
  const [intensity, setIntensity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeText = useCallback(async (text) => {
    if (!text || text.trim().length < 5) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/process_text`,
        { text },
        { timeout: 10000 }
      );

      const { sentiment, sentiment_label, keywords, intensity } = response.data;
      
      setSentiment(sentiment);
      setSentimentLabel(sentiment_label);
      setKeywords(prev => [...new Set([...prev, ...keywords])].slice(-10));
      setIntensity(intensity);

    } catch (err) {
      console.error('Sentiment analysis error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sentiment,
    sentimentLabel,
    keywords,
    intensity,
    isLoading,
    error,
    analyzeText
  };
};