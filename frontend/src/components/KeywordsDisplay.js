import React, { useState, useEffect } from 'react';
import './KeywordsDisplay.css';

const KeywordsDisplay = ({ keywords }) => {
  const [displayedKeywords, setDisplayedKeywords] = useState([]);

  useEffect(() => {
    // Find new keywords that aren't displayed yet
    const newKeywords = keywords.filter(kw => !displayedKeywords.includes(kw));
    
    if (newKeywords.length > 0) {
      // Add new keywords one by one with delay
      newKeywords.forEach((keyword, index) => {
        setTimeout(() => {
          setDisplayedKeywords(prev => [...prev, keyword]);
        }, index * 200);
      });
    }
  }, [keywords]); // Remove displayedKeywords from deps

  return (
    <div className="keywords-container">
      <h3>Key Topics</h3>
      <div className="keywords-cloud">
        {displayedKeywords.map((keyword, index) => (
          <span 
            key={`${keyword}-${index}`} 
            className="keyword-tag"
            style={{
              animationDelay: `${index * 0.1}s`,
              fontSize: `${14 + Math.random() * 8}px`
            }}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KeywordsDisplay;