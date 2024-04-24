import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserQuotes = () => {
    const [quotes, setQuotes] = useState([]);
    const { username } = useParams();

    useEffect(() => {
        const fetchUserQuotes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/${username}/quotes`);
                setQuotes(response.data);
            } catch (error) {
                console.error('Error fetching user quotes:', error);
            }
        };

        fetchUserQuotes();
    }, [username]);

    return (
        <div>
            <h2>{username}'s Quotes</h2>
            {quotes.map((quote, index) => (
                <div className="quote-box" key={index}>
                    <p className="quote-content">{quote.text}</p>
                </div>
            ))}
        </div>
    );
};

export default UserQuotes;