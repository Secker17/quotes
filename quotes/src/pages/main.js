import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './login/logo1.png'; // Pass på at filstien er korrekt
import '../css/main.css';

const PostList = ({ loggedInUser }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = loggedInUser ? `http://localhost:5000/api/posts/${loggedInUser}` : 'http://localhost:5000/api/posts';
        const response = await axios.get(url);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [loggedInUser]);

  return (
    <div>
      <h2>Posts</h2>
      {posts.map((post, index) => (
        <div className="post-box" key={index}>
          <h3 className="post-title">{post.title}</h3>
          <p className="post-content">{post.info}</p>
          <p className="cred-text">{post.credText}</p>
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
    const isLoggedIn = document.cookie.includes('loggedIn=true');
    if (isLoggedIn) {
      setLoggedIn(true);
      const savedUsername = localStorage.getItem('username');
      console.log('Retrieved username:', savedUsername);
      if (savedUsername) {
        setUsername(savedUsername);
        setLoggedInUser(savedUsername);
      }
    }
  }, []);

  const handleLoginPopup = () => setLoginPopupOpen(true);
  const handleRegisterPopup = () => setRegisterPopupOpen(true);
  const handleClosePopup = () => {
    setLoginPopupOpen(false);
    setRegisterPopupOpen(false);
    setLoginError('');
    setRegisterError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const setCookie = () => document.cookie = 'loggedIn=true;max-age=3600';
  const removeCookie = () => document.cookie = 'loggedIn=;max-age=0';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError('Please fill in both username and password.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      setUsername(response.data.username);
      setLoggedIn(true);
      setCookie();
      handleClosePopup();
      setLoggedInUser(response.data.username);
      localStorage.setItem('username', response.data.username);
      document.cookie = `username=${response.data.username};max-age=3600`;
    } catch (error) {
      console.error('Login error:', error.response.data.message);
      if (error.response && error.response.status === 401) {
        setLoginError('Invalid username or password. Please try again.');
      } else if (error.response && error.response.status === 404) {
        setLoginError('Username does not exist. Please register.');
      } else {
        setLoginError('An error occurred. Please try again later.');
      }
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    removeCookie();
    setLoggedInUser('');
    localStorage.removeItem('username');
    document.cookie = 'username=;max-age=0';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || confirmPassword !== password) {
      setRegisterError('Please ensure all fields are filled and passwords match.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        password,
      });
      console.log('Register response:', response.data);
      setUsername(response.data.username);
      setLoggedIn(true);
      setCookie();
      handleClosePopup();
      setLoggedInUser(response.data.username);
      localStorage.setItem('username', response.data.username);
      document.cookie = `username=${response.data.username};max-age=3600`;
    } catch (error) {
      console.error('Registration error:', error.response.data.message);
      setRegisterError(error.response.data.message);
    }
  };

  return (
    <div>
      <div className="navbar-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>{loggedIn ? `Bitter - ${username}` : "Bitter"}</h1>
        <div className="navbar-links">
          {!loggedIn && (
            <>
              <button className="navbar-button" onClick={handleLoginPopup}>Logg inn</button>
              <button className="navbar-button" onClick={handleRegisterPopup}>Registrer</button>
            </>
          )}
          {loggedIn && <button className="navbar-button" onClick={handleLogout}>Logg ut</button>}
        </div>
      </div>

      {loginPopupOpen && (
        <div className="popup-container">
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
      )}

      {registerPopupOpen && (
        <div className="popup-container">
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
      )}

      <PostList loggedInUser={loggedInUser} />
    </div>
  );
};

export default App;

