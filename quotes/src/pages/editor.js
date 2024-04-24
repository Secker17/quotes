import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/eksamen';

// The Editor can now receive an optional quote prop for editing
const Editor = ({ quote, onSaveSuccess }) => {
  const [quoteText, setQuoteText] = useState('');

  // When the component receives a new quote prop, it updates the quoteText state
  useEffect(() => {
    if (quote) {
      setQuoteText(quote.text);
    } else {
      setQuoteText(''); // Reset if no quote is provided (new quote mode)
    }
  }, [quote]);

  // Handles saving a new quote or updating an existing one
  const handleQuoteSave = async () => {
    if (quoteText.trim() === '') {
      alert('Please enter some text for the quote.');
      return;
    }

    try {
      let response;
      if (quote) {
        // If a quote is provided, send a PUT request to update it
        response = await axios.put(`${API_BASE_URL}/quotes/${quote._id}`, { text: quoteText });
      } else {
        // If no quote is provided, send a POST request to create a new quote
        response = await axios.post(`${API_BASE_URL}/quotes`, { text: quoteText });
      }
      setQuoteText(''); // Clear input after save
      onSaveSuccess(response.data); // Call onSaveSuccess callback with the saved quote data
    } catch (error) {
      console.error('Error saving the quote:', error);
      alert('Failed to save the quote. Please try again.');
    }
  };

  return (
    <div className="editor-container">
      <h2>Quote Editor</h2>
      <textarea
        className="quote-input"
        value={quoteText}
        onChange={(e) => setQuoteText(e.target.value)}
        placeholder="Enter quote here..."
      />
      <button className="save-button" onClick={handleQuoteSave}>
        {quote ? 'Update Quote' : 'Save Quote'}
      </button>
    </div>
  );
};

export default Editor;
