import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Cameron Giglio</h2>
            <p>Capturing moments that last a lifetime</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Navigation</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Services</h3>
              <ul>
                <li><a href="#gallery">Portrait Photography</a></li>
                <li><a href="#gallery">Automotive Photography</a></li>
                <li><a href="#gallery">Fitness Photography</a></li>
                <li><a href="#gallery">Sports Photography</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Connect</h3>
              <ul>
                <li><a href="https://www.instagram.com/flicks_bycam/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Cameron Giglio. All rights reserved.</p>
          <p>
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 