import React from 'react';
import '../styles/About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        
        <div className="about-content">
          <div className="about-image">
            {/* Placeholder for photographer's image */}
            <div className="placeholder-image">
              <p>Photographer Image</p>
              <p>400 x 500px</p>
            </div>
          </div>
          
          <div className="about-text">
            <h3>Cameron Giglio</h3>
            <p className="about-subtitle">Professional Photographer</p>
            
            <p>
              I am a professional photographer with a passion for capturing the beauty of the world around us.
            </p>
            
            <div className="about-details">
              <div className="detail-item">
                <h4>Experience</h4>
                <p>2 Years</p>
              </div>
              <div className="detail-item">
                <h4>Specialization</h4>
                <p>Portrait, Automotive, Fitness, Sports</p>
              </div>
              <div className="detail-item">
                <h4>Location</h4>
                <p>Charlottesville VA, USA</p>
              </div>
            </div>
            
            <a href="#contact" className="btn">Get In Touch</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 