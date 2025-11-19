import React from 'react';
import './Controls.css';

const Controls = ({ isRecording, onToggleRecording }) => {
  return (
    <div className="controls">
      <button 
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onClick={onToggleRecording}
      >
        <div className="button-content">
          <div className={`record-indicator ${isRecording ? 'pulse' : ''}`} />
          <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
        </div>
      </button>
    </div>
  );
};

export default Controls;