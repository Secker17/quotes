import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/eksamen';

const Editor = ({ onSaveSuccess, onSaveError }) => {
  const [quoteText, setQuoteText] = useState('');

  const handleQuoteSave = async () => {
    if (quoteText.trim() === '') {
      onSaveError && onSaveError('Sitatet kan ikke være tomt.');
      return;
    }
    if (quoteText.length > 100) {
      onSaveError && onSaveError('Sitatet kan ikke overstige 100 tegn.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await axios.post(`${API_BASE_URL}/quotes`, { text: quoteText }, { headers });
      setQuoteText('');
      onSaveSuccess && onSaveSuccess(response.data);
    } catch (error) {
      console.error('Error saving the quote:', error);
      onSaveError && onSaveError('Kunne ikke lagre sitatet. Vennligst prøv igjen.');
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
        Lagre Sitat
      </button>
    </div>
  );
};

export default Editor;