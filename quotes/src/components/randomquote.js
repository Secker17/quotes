import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RandomQuote = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const fetchRandomQuote = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/random-quote`);
                setQuote(response.data.text);
            } catch (error) {
                console.error('Error fetching random quote:', error);
            }
        };

        fetchRandomQuote();
    }, []);

    return quote ? <p>{quote}</p> : <p>Loading...</p>;
};

export default RandomQuote;