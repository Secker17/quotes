import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import logo from './login/logo1.png';
import '../css/main.css';
import { Link } from 'react-router-dom'; // Legg til Link fra react-router-dom

const API_BASE_URL = 'http://localhost:5000/eksamen';

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/quotes`);
        setQuotes(response.data);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();
  }, []);

  return (
    <div>
      <h2>Sitater</h2>
      {quotes.map((quote, index) => (
        <div className="quote-box" key={index}>
          <p className="quote-content">{quote.text}</p>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [registerPopupOpen, setRegisterPopupOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      setLoggedInUser(savedUsername);
      setLoggedIn(true);
    }
  }, []);

  const handleLoginPopup = useCallback(() => setLoginPopupOpen(true), []);
  const handleRegisterPopup = useCallback(() => setRegisterPopupOpen(true), []);
  const handleClosePopup = useCallback(() => {
    setLoginPopupOpen(false);
    setRegisterPopupOpen(false);
    setLoginError('');
    setRegisterError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  const handleLogin = useCallback(async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setLoginError('Please enter both username and password.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      setLoggedIn(true);
      setLoggedInUser(username);
      handleClosePopup();
    } catch (error) {
      setLoginError('Invalid username or password. Please try again.');
    }
  }, [username, password]);

  const handleLogout = useCallback(() => {
    setLoggedIn(false);
    setLoggedInUser('');
    localStorage.removeItem('authToken');
  }, []);

  const handleRegister = useCallback(async (event) => {
    event.preventDefault();
    if (!username || !password || !confirmPassword) {
      setRegisterError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/register`, { username, password });
      setLoggedIn(true);
      setLoggedInUser(username);
      handleClosePopup();
    } catch (error) {
      setRegisterError('Registration failed. Please try again later.');
    }
  }, [username, password, confirmPassword]);

  return (
    <div>
      <div className="navbar-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>{loggedIn ? `Secker - ${username}` : "Secker"}</h1>
        <div className="navbar-links">
          {!loggedIn && (
            <>
              <button className="navbar-button" onClick={handleLoginPopup}>Logg inn</button>
              <button className="navbar-button" onClick={handleRegisterPopup}>Registrer</button>
            </>
          )}
          {loggedIn && (
            <>
              <Link to="/editor" className="navbar-button">Rediger sitater</Link>
              <button className="navbar-button" onClick={handleLogout}>Logg ut</button>
            </>
          )}
        </div>
      </div>

      {loginPopupOpen && (
        <div className="popup-container">
          <div className="form-container">
            <form className="form" onSubmit={handleLogin}>
              <h2>Logg inn</h2>
              <input
                className="input"
                type="text"
                placeholder="Brukernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder="Passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="feedback-message">{loginError}</p>
              <button className="submit-button" type="submit">Logg inn</button>
              <button className="close-button" type="button" onClick={handleClosePopup}>
                Lukk
              </button>
            </form>
          </div>
        </div>
      )}

      {registerPopupOpen && (
        <div className="popup-container">
          <div className="form-container">
            <form className="form" onSubmit={handleRegister}>
              <h2>Registrer</h2>
              <input
                className="input"
                type="text"
                placeholder="Brukernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder="Passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder="Bekreft Passord"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <p className="feedback-message">{registerError}</p>
              <button className="submit-button" type="submit">Registrer</button>
              <button className="close-button" type="button" onClick={handleClosePopup}>
                Lukk
              </button>
            </form>
          </div>
        </div>
      )}

      <QuoteList />
    </div>
  );
};

export default App;
