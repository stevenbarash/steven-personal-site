// src/components/MenuBar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css'; // Ensure the CSS file is correctly imported

const MenuBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
<nav className="navbar" role="navigation" aria-label="main navigation">
  <div className="navbar-brand">
    <a role="button" className={`navbar-burger burger ${isOpen ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" onClick={() => setIsOpen(!isOpen)}>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>
  <div className={`navbar-menu ${isOpen ? 'is-active' : ''}`}>
    <div className="navbar-start">
      <Link to="/" className="navbar-item" onClick={() => setIsOpen(false)}>Home</Link>
      <Link to="/blog" className="navbar-item" onClick={() => setIsOpen(false)}>Blog</Link>
      <Link to="/photography" className="navbar-item" onClick={() => setIsOpen(false)}>Photography</Link>
    </div>
  </div>
</nav> 
 );
};

export default MenuBar;