import React from 'react';
import ReactWordcloud from 'react-wordcloud';

const KeywordCloud = ({ segments, onKeywordClick }) => {
  if (!segments || segments.length === 0) return null;

  const keywordCounts = {};

  segments.forEach(seg => {
    (seg.keywords || []).forEach(word => {
      const key = word.toLowerCase();
      keywordCounts[key] = (keywordCounts[key] || 0) + 1;
    });
  });

  const words = Object.entries(keywordCounts).map(
    ([text, value]) => ({ text, value })
  );

  if (words.length === 0) return null;

  const options = {
    rotations: 0,
    fontSizes: [14, 42],
    fontFamily: 'Inter, sans-serif',
    colors: [
      '#4f46e5',
      '#6366f1',
      '#3b82f6',
      '#2563eb'
    ],
    padding: 2
  };

  const callbacks = {
    onWordClick: (word) => {
      if (onKeywordClick) {
        onKeywordClick(word.text);
      }
    }
  };

  return (
    <div className="card-elevated p-6">
      <h3 className="text-lg font-semibold mb-4">
        Keyword Overview
      </h3>

      <ReactWordcloud
        words={words}
        options={options}
        callbacks={callbacks}
      />
    </div>
  );
};

export default KeywordCloud;
