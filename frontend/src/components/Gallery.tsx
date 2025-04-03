import React, { useState, useEffect } from 'react';
import '../styles/Gallery.css';
import { fetchInstagramMedia, InstagramMedia } from '../services/instagramService';

// Import the snowboarding image for fallback
import tylerSnowboard from '../assets/images/tyler_snowboard.jpg';

// Define categories for the gallery
const categories = ['All', 'Portrait', 'Automotive', 'Fitness', 'Sports'];

const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  // Fetch Instagram images on component mount
  useEffect(() => {
    const loadInstagramImages = async () => {
      try {
        setLoading(true);
        const instagramMedia = await fetchInstagramMedia(20); // Fetch up to 20 images
        
        if (instagramMedia.length > 0) {
          setGalleryImages(instagramMedia);
        } else {
          // Fallback to local images if no Instagram images are available
          setGalleryImages([
            { id: 1, category: 'Portrait', title: 'Portrait 1', image: null },
            { id: 2, category: 'Automotive', title: 'Automotive 1', image: null },
            { id: 3, category: 'Fitness', title: 'Fitness 1', image: null },
            { id: 4, category: 'Sports', title: 'Snowboarding Action', image: tylerSnowboard },
            { id: 5, category: 'Portrait', title: 'Portrait 2', image: null },
            { id: 6, category: 'Automotive', title: 'Automotive 2', image: null },
            { id: 7, category: 'Fitness', title: 'Fitness 2', image: null },
            { id: 8, category: 'Sports', title: 'Sports 2', image: null },
            { id: 9, category: 'Portrait', title: 'Portrait 3', image: null },
          ]);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to load Instagram images:', err);
        setError('Failed to load images. Using fallback images instead.');
        
        // Use fallback images
        setGalleryImages([
          { id: 1, category: 'Portrait', title: 'Portrait 1', image: null },
          { id: 2, category: 'Automotive', title: 'Automotive 1', image: null },
          { id: 3, category: 'Fitness', title: 'Fitness 1', image: null },
          { id: 4, category: 'Sports', title: 'Snowboarding Action', image: tylerSnowboard },
          { id: 5, category: 'Portrait', title: 'Portrait 2', image: null },
          { id: 6, category: 'Automotive', title: 'Automotive 2', image: null },
          { id: 7, category: 'Fitness', title: 'Fitness 2', image: null },
          { id: 8, category: 'Sports', title: 'Sports 2', image: null },
          { id: 9, category: 'Portrait', title: 'Portrait 3', image: null },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadInstagramImages();
  }, []);

  // Filter images based on active category
  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  // Open full-screen image view
  const openFullScreen = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close full-screen image view
  const closeFullScreen = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        <h2 className="section-title">My Portfolio</h2>
        
        <div className="gallery-categories">
          {categories.map(category => (
            <button 
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="loading-container">
            <p>Loading gallery images...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="no-images-message">
            <p>No images found in this category.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredImages.map(image => (
              <div key={image.id} className="gallery-item">
                {image.image ? (
                  <div 
                    className="gallery-image-container" 
                    onClick={() => image.image && openFullScreen(image.image)}
                  >
                    <img src={image.image} alt={image.title} className="gallery-image" />
                  </div>
                ) : (
                  <div className="placeholder-image">
                    <p>{image.title}</p>
                    <p>400 x 300px</p>
                  </div>
                )}
                <div className="image-overlay">
                  <h3>{image.title}</h3>
                  <p>{image.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen image modal */}
      {selectedImage && (
        <div className="fullscreen-modal" onClick={closeFullScreen}>
          <span className="close-modal">&times;</span>
          <img src={selectedImage} alt="Full-screen view" className="fullscreen-image" />
        </div>
      )}
    </section>
  );
};

export default Gallery; 