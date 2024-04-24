import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/main';
import Editor from './pages/editor'; // Sørg for at du importerer Editor komponenten

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} /> {/* Endret ruten til å være korrekt */}
      </Routes>
    </BrowserRouter>
  );
}
// Legg til denne ruten i BrowserRouter i App.js
<Route path="/:username" element={<UserQuotes />} />
export default App;
