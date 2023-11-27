// src/components/MenuBar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css'; // Ensure the CSS file is correctly imported

const MenuBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="mobile-menu">
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        {/* Hamburger icon */}
        <i>☰</i>
      </div>
      <div className={`menu-items ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/blog" onClick={() => setIsOpen(false)}>Blog</Link>
        <Link to="/photography" onClick={() => setIsOpen(false)}>Photography</Link>
      </div>
    </nav>
  );
};

export default MenuBar;