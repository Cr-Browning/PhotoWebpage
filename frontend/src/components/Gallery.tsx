import React, { useState, useEffect } from 'react';
import '../styles/Gallery.css';

// Define categories for the gallery
const categories = ['All', 'Portrait', 'Automotive', 'Fitness', 'Sports', 'Architecture', 'Misc'];

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
  const [arrowPositions, setArrowPositions] = useState({ left: 0, right: 0 });
  const [displayCount, setDisplayCount] = useState(6);
  const [hasMore, setHasMore] = useState(false);

  // Update arrow positions when image changes
  useEffect(() => {
    const updateArrowPositions = () => {
      const imageElement = document.querySelector('.fullscreen-image');
      if (imageElement) {
        const bounds = imageElement.getBoundingClientRect();
        setArrowPositions({
          left: bounds.left - 110,
          right: bounds.right + 50
        });
      }
    };

    if (selectedImage) {
      // Wait for image to load before calculating positions
      const img = new Image();
      img.src = selectedImage;
      img.onload = updateArrowPositions;

      // Also add a resize listener to update positions when window is resized
      window.addEventListener('resize', updateArrowPositions);
      return () => window.removeEventListener('resize', updateArrowPositions);
    }
  }, [selectedImage]);

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

  // Reset display count when category changes
  useEffect(() => {
    setDisplayCount(6);
  }, [activeCategory]);

  // Filter images based on active category
  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category.toLowerCase() === activeCategory.toLowerCase());

  // Get the currently displayed images
  const displayedImages = filteredImages.slice(0, displayCount);
  
  // Check if there are more images to show
  useEffect(() => {
    setHasMore(displayCount < filteredImages.length);
  }, [displayCount, filteredImages.length]);

  // Handle "Show More" button click
  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 6);
  };

  // Handle "Show Less" button click
  const handleShowLess = () => {
    const newCount = Math.max(6, displayCount - 6);
    setDisplayCount(newCount);
    
    // Wait for the DOM to update with the new count
    setTimeout(() => {
      // Get all gallery items
      const galleryItems = document.querySelectorAll('.gallery-item');
      if (galleryItems.length > 0) {
        // Calculate the index of the first item in the last batch
        const targetIndex = newCount - 6;
        if (targetIndex >= 0) {
          // Scroll to the first item of the last batch
          galleryItems[targetIndex].scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }, 100); // Small delay to ensure DOM has updated
  };

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
    // Get the image element
    const imageElement = document.querySelector('.fullscreen-image') as HTMLImageElement;
    if (!imageElement) return;

    // Get image boundaries
    const imageBounds = imageElement.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    // If clicking on the close button, don't handle the click here
    if ((e.target as HTMLElement).classList.contains('close-modal')) {
      return;
    }

    // If clicking on navigation buttons or dots, don't handle
    if (
      (e.target as HTMLElement).classList.contains('carousel-nav') ||
      (e.target as HTMLElement).closest('.carousel-dots')
    ) {
      return;
    }

    // Define the vertical click zone (100px above and below the center of the image)
    const imageVerticalCenter = imageBounds.top + imageBounds.height / 2;
    const isInVerticalRange = Math.abs(clickY - imageVerticalCenter) <= 100;

    if (selectedPost?.type === 'carousel' && selectedPost.items && isInVerticalRange) {
      // Check if click is in the navigation zones (outside image bounds)
      const navWidth = 60; // Width of navigation zone
      
      if (clickX >= imageBounds.left - 110 && clickX <= imageBounds.left) {
        // Left navigation zone
        navigateCarousel('prev');
        return;
      } else if (clickX >= imageBounds.right && clickX <= imageBounds.right + 110) {
        // Right navigation zone
        navigateCarousel('next');
        return;
      }
    }

    // If click is outside navigation zones, close the modal
    closeFullScreen();
  };

  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        <h2 className="section-title">Portfolio</h2>
        
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
        ) : displayedImages.length === 0 ? (
          <div className="no-images-message">
            <p>No images found in this category.</p>
          </div>
        ) : (
          <>
            <div className="gallery-grid">
              {displayedImages.map(post => (
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
            
            {hasMore && (
              <div className="show-more-container">
                <button className="show-more-btn" onClick={handleShowMore}>
                  Show More
                </button>
              </div>
            )}
            
            {displayCount > 6 && (
              <div className="show-less-container">
                <button className="show-less-btn" onClick={handleShowLess}>
                  Show Less
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full-screen image modal */}
      {selectedImage && selectedPost && (
        <div 
          className="fullscreen-modal" 
          onClick={handleModalClick}
        >
          <button 
            className="close-modal" 
            onClick={(e) => {
              e.stopPropagation();
              closeFullScreen();
            }}
            aria-label="Close full screen view"
          >
            &times;
          </button>
          
          <img 
            src={selectedImage} 
            alt="Full-screen view" 
            className="fullscreen-image"
            onClick={(e) => e.stopPropagation()}
          />
          
          {selectedPost.type === 'carousel' && selectedPost.items && selectedPost.items.length > 1 && (
            <>
              {/* Navigation buttons */}
              <button 
                className="carousel-nav prev"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateCarousel('prev');
                }}
                style={{
                  position: 'absolute',
                  left: `${arrowPositions.left}px`
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
                style={{
                  position: 'absolute',
                  left: `${arrowPositions.right}px`
                }}
              >
                ❯
              </button>

              {/* Carousel dots */}
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