import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/main';
import Editor from './pages/editor';
import UserQuotes from './components/userquotes'; // Importer UserQuotes-komponenten

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/:username" element={<UserQuotes />} /> {/* Legg til denne ruten */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;