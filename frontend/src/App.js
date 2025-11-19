import React, { useState, useEffect } from 'react';
import Controls from './components/Controls';
import TranscriptDisplay from './components/TranscriptDisplay';
import KeywordsDisplay from './components/KeywordsDisplay';
import AuraVisualization from './components/AuraVisualization';
import AudioRecorder from './components/AudioRecorder';
import { useDeepgram } from './hooks/useDeepgram';
import { useSentimentAnalysis } from './hooks/useSentimentAnalysis';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  
  const { 
    transcript, 
    currentInterim, 
    error: transcriptError,
    handleTranscript,
    handleError,
    clearTranscript
  } = useDeepgram();
  
  const { 
    sentiment, 
    sentimentLabel, 
    keywords, 
    intensity,
    error: sentimentError,
    analyzeText 
  } = useSentimentAnalysis();

  // Analyze text when new final transcript arrives
  useEffect(() => {
    if (transcript.length > 0) {
      const latestTranscript = transcript[transcript.length - 1];
      if (latestTranscript.isFinal && latestTranscript.text.length > 0) {
        analyzeText(latestTranscript.text);
      }
    }
  }, [transcript, analyzeText]);

  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
    } else {
      // Clear previous transcript and start fresh
      clearTranscript();
      setIsRecording(true);
    }
  };

  return (
    <div className="App">
      {/* Audio Recorder - doesn't render UI, just manages recording */}
      <AudioRecorder
        isRecording={isRecording}
        onTranscript={handleTranscript}
        onError={handleError}
      />

      {/* Background visualization */}
      <div className="visualization-container">
        <AuraVisualization 
          sentiment={sentiment}
          intensity={intensity}
          sentimentLabel={sentimentLabel}
        />
      </div>

      {/* UI Overlays */}
      <TranscriptDisplay 
        transcript={transcript}
        currentInterim={currentInterim}
      />
      
      <KeywordsDisplay keywords={keywords} />
      
      <Controls 
        isRecording={isRecording}
        onToggleRecording={handleToggleRecording}
      />

      {/* Error Display */}
      {(transcriptError || sentimentError) && (
        <div className="error-banner">
          {transcriptError || sentimentError}
        </div>
      )}
    </div>
  );
}

export default App;