import React, { useState, useEffect } from 'react';
import '../styles/Gallery.css';

// Define categories for the gallery
const categories = ['All', 'Portrait', 'Automotive', 'Fitness', 'Sports'];

interface CarouselItem {
  id: string;
  type: string;
  url: string;
  thumbnail: string;
}

interface InstagramPost {
  id: string;
  type: string;
  url?: string;
  thumbnail?: string;
  items?: CarouselItem[];
  permalink: string;
  caption: string;
  category: string;
}

const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<InstagramPost[]>([]);

  // Fetch Instagram images on component mount
  useEffect(() => {
    const loadInstagramImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/instagram/media');
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch Instagram media');
        }

        // Flatten categorized media into a single array
        const allMedia = Object.values(result.data).flat() as InstagramPost[];
        
        if (allMedia.length > 0) {
          setGalleryImages(allMedia);
        } else {
          throw new Error('No images found');
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to load Instagram images:', err);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadInstagramImages();
  }, []);

  // Filter images based on active category
  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category.toLowerCase() === activeCategory.toLowerCase());

  // Open full-screen image view
  const openFullScreen = (post: InstagramPost, initialImageUrl?: string) => {
    setSelectedPost(post);
    if (post.type === 'carousel' && post.items) {
      const initialIndex = initialImageUrl 
        ? post.items.findIndex(item => item.url === initialImageUrl)
        : 0;
      setCurrentImageIndex(initialIndex >= 0 ? initialIndex : 0);
      setSelectedImage(post.items[initialIndex >= 0 ? initialIndex : 0].url);
    } else if (post.url) {
      setSelectedImage(post.url);
      setCurrentImageIndex(0);
    }
    document.body.style.overflow = 'hidden';
  };

  // Close full-screen image view
  const closeFullScreen = () => {
    setSelectedImage(null);
    setSelectedPost(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'auto';
  };

  // Navigate carousel
  const navigateCarousel = (direction: 'prev' | 'next') => {
    if (selectedPost?.type === 'carousel' && selectedPost.items) {
      const newIndex = direction === 'next'
        ? (currentImageIndex + 1) % selectedPost.items.length
        : (currentImageIndex - 1 + selectedPost.items.length) % selectedPost.items.length;
      setCurrentImageIndex(newIndex);
      setSelectedImage(selectedPost.items[newIndex].url);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          navigateCarousel('prev');
          break;
        case 'ArrowRight':
          navigateCarousel('next');
          break;
        case 'Escape':
          closeFullScreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, currentImageIndex, selectedPost]);

  // Handle click on modal area
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const modalWidth = e.currentTarget.clientWidth;
    const clickX = e.clientX;
    const clickArea = clickX / modalWidth;

    // If clicking on the image itself, don't navigate
    if ((e.target as HTMLElement).classList.contains('fullscreen-image')) {
      return;
    }

    if (selectedPost?.type === 'carousel' && selectedPost.items) {
      if (clickArea < 0.3) {
        // Left 30% of screen - go to previous
        navigateCarousel('prev');
      } else if (clickArea > 0.7) {
        // Right 30% of screen - go to next
        navigateCarousel('next');
      } else {
        // Middle 40% of screen - close modal
        closeFullScreen();
      }
    } else {
      // If not a carousel, any click closes the modal
      closeFullScreen();
    }
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
            {filteredImages.map(post => (
              <div key={post.id} className="gallery-item">
                <div 
                  className="gallery-image-container" 
                  onClick={() => openFullScreen(post, post.type === 'carousel' ? post.items?.[0].url : post.url)}
                >
                  <img 
                    src={post.type === 'carousel' ? post.items?.[0].thumbnail : (post.thumbnail || post.url)} 
                    alt={post.caption} 
                    className="gallery-image"
                    loading="lazy"
                  />
                  {post.type === 'carousel' && (
                    <div className="carousel-indicator">
                      <span className="carousel-icon">◇</span>
                    </div>
                  )}
                </div>
                <div className="image-overlay">
                  <p>{post.category}</p>
                  {post.caption && (
                    <p className="image-caption">
                      {post.caption.length > 100 
                        ? `${post.caption.substring(0, 100)}...` 
                        : post.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen image modal */}
      {selectedImage && selectedPost && (
        <div 
          className="fullscreen-modal" 
          onClick={handleModalClick}
        >
          <span 
            className="close-modal" 
            onClick={(e) => {
              e.stopPropagation();
              closeFullScreen();
            }}
          >
            &times;
          </span>
          
          <img 
            src={selectedImage} 
            alt="Full-screen view" 
            className="fullscreen-image"
            onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking the image
          />
          
          {selectedPost.type === 'carousel' && selectedPost.items && selectedPost.items.length > 1 && (
            <>
              {/* Click areas for navigation */}
              <div className="click-area left" onClick={(e) => {
                e.stopPropagation();
                navigateCarousel('prev');
              }} />
              <div className="click-area right" onClick={(e) => {
                e.stopPropagation();
                navigateCarousel('next');
              }} />

              {/* Existing carousel navigation buttons */}
              <button 
                className="carousel-nav prev"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateCarousel('prev');
                }}
              >
                ❮
              </button>
              <button 
                className="carousel-nav next"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateCarousel('next');
                }}
              >
                ❯
              </button>

              {/* Existing carousel dots */}
              <div className="carousel-dots">
                {selectedPost.items.map((_, index) => (
                  <span 
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                      setSelectedImage(selectedPost.items![index].url);
                    }}
                  />
                ))}
              </div>
            </>
          )}
          
          <a 
            href={selectedPost.permalink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="view-on-instagram"
            onClick={e => e.stopPropagation()}
          >
            View on Instagram
          </a>
        </div>
      )}
    </section>
  );
};

export default Gallery; 