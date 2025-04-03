import React from 'react';
import '../styles/Hero.css';
// Import the hero image
import heroImage from '../assets/images/background.jpg';

const Hero: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>Cameron Giglio Photography</h1>
        <p>Capturing moments in portrait, automotive, fitness, and sports</p>
        <div className="hero-buttons">
          <a href="#gallery" className="btn">View Gallery</a>
          <a href="#contact" className="btn">Contact Me</a>
        </div>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Cameron Giglio Photography" />
      </div>
    </section>
  );
};

export default Hero; 