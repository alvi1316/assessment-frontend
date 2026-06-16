import React, { useState } from 'react';
import '~/styles/Carousel.css';
import type { ProductsCarouselSliderProps } from '~/types/component';

export const ProductCarousel: React.FC<ProductsCarouselSliderProps> = ({ _id, _type, carouselType, products, theme, title }) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = products.length;

  if (totalItems === 0) {
    return <div className="carousel-empty">No items found</div>;
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">{title}</h2>
      
      <div className="carousel-container">
        <div className="carousel-stage">
          {products.map((item, index) => {
            // Calculate the shortest signed distance from the active index loop
            let offset = index - activeIndex;
            if (offset < -totalItems / 2) offset += totalItems;
            if (offset > totalItems / 2) offset -= totalItems;

            const absOffset = Math.abs(offset);
            const isActive = offset === 0;
            
            // Mathematically manage layered arrangement visibility
            const zIndex = 100 - absOffset;

            // Optional: Hide items that are too far behind to keep view clean
            const isVisible = absOffset <= 2 || totalItems <= 8;
            
            return (
              <div
                key={item._id}
                className={`carousel-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)} // Click background card to bring to front
                style={{
                  '--offset': offset,
                  '--abs-offset': absOffset,
                  zIndex: zIndex,
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isVisible ? 'auto' : 'none',
                } as React.CSSProperties}
              >
                <div className="card-visual-wrapper">
                  {/* Decorative Image/Gradient placeholder for Location UI */}
                  <div className="card-image-placeholder">
                    <img src={item.previewImageUrl}/>
                  </div>
                  
                  <div className="card-overlay">
                    <h3 className="card-heading">{item.title}</h3>
                    <button className="card-action-btn">Explore Details</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* JQuery Style Navigation Controls */}
        <button className="nav-btn prev" onClick={handlePrev} aria-label="Previous">
          &#10094;
        </button>
        <button className="nav-btn next" onClick={handleNext} aria-label="Next">
          &#10095;
        </button>
      </div>

      {/* Pagination Dots Indicators */}
      <div className="carousel-dots">
        {products.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};