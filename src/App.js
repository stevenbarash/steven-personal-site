// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import BlogPage from './pages/BlogPage';
import PhotoPage from './pages/PhotoPage';
import MenuBar from './components/MenuBar'; // Import the new MenuBar component

function App() {
  return (
    <Router>
      <div className="App">
        <MenuBar /> {/* Use the MenuBar component */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/photography" element={<PhotoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;