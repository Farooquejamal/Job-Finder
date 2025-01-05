import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); 
  }, []);

  const handleLogout = () => {
    
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/'); 
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {!isLoggedIn ? (
          <>
            <li><Link to="/" className="navbar-link">Login</Link></li>
            <li><Link to="/register" className="navbar-link">Register</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
            <li><Link to="/upload-resume" className="navbar-link">Upload Resume</Link></li>
            <li>
              <button onClick={handleLogout} className="navbar-link logout-button">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
