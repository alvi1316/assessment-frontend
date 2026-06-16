import React, { useState } from 'react';
import '~/styles/Carousel.css';
import type { CollectionCarouselSliderProps } from '~/types/component';

export const CollectionCarousel: React.FC<CollectionCarouselSliderProps> = ({ _id, _type, carouselType, collections, theme }) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = collections.length;

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
      <h2 className="carousel-title">{"title"}</h2>
      
      <div className="carousel-container">
        <div className="carousel-stage">
          {collections.map((item, index) => {
            
            let offset = index - activeIndex;
            if (offset < -totalItems / 2) offset += totalItems;
            if (offset > totalItems / 2) offset -= totalItems;

            const absOffset = Math.abs(offset);
            const isActive = offset === 0;
            const zIndex = 100 - absOffset;

            const isVisible = absOffset <= 2 || totalItems <= 5;

            return (
              <div
                key={item._id}
                className={`carousel-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                style={{
                  '--offset': offset,
                  '--abs-offset': absOffset,
                  zIndex: zIndex,
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isVisible ? 'auto' : 'none',
                } as React.CSSProperties}
              >
                <div className="card-visual-wrapper">
                  <div className="card-image-placeholder" />
                  <div className="card-overlay">
                    <span className="card-tag">{carouselType}</span>
                    <h3 className="card-heading">Destination Item</h3>
                    <p className="card-description">
                      Ref: {item.gid}
                    </p>
                    <button className="card-action-btn">Explore Details</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="nav-btn prev" onClick={handlePrev} aria-label="Previous">
          &#10094;
        </button>
        <button className="nav-btn next" onClick={handleNext} aria-label="Next">
          &#10095;
        </button>
      </div>

      <div className="carousel-dots">
        {collections.map((_, index) => (
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