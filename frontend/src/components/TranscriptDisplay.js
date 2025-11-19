import React, { useEffect, useRef } from 'react';
import './TranscriptDisplay.css';

const TranscriptDisplay = ({ transcript, currentInterim }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new transcript arrives
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, currentInterim]);

  return (
    <div className="transcript-container">
      <div className="transcript-header">
        <h3>Live Transcript</h3>
        {transcript.length > 0 && (
          <span className="transcript-count">{transcript.length} lines</span>
        )}
      </div>
      
      <div className="transcript-scroll" ref={scrollRef}>
        {transcript.length === 0 && !currentInterim && (
          <p className="transcript-placeholder">
            Start speaking to see your transcript here...
          </p>
        )}
        
        {transcript.map((item, index) => (
          <div key={index} className="transcript-item">
            <p className="transcript-line fade-in">
              {item.text}
            </p>
            {item.confidence && (
              <span className="confidence-badge">
                {Math.round(item.confidence * 100)}% confident
              </span>
            )}
          </div>
        ))}
        
        {currentInterim && (
          <p className="transcript-line interim">
            {currentInterim}
          </p>
        )}
      </div>
    </div>
  );
};

export default TranscriptDisplay;