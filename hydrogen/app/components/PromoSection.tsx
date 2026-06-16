import React from 'react';
import '~/styles/PromoSection.css';
import type { PromoSectionProp } from '~/types/component';
import { urlFor } from '~/util/imageUrl';
import { applyThemeStyles } from '~/util/theme';

export const PromoSection: React.FC<PromoSectionProp> = ({ _id, _type, rows, title, theme }) => {
  return (
    <div className="promo-container" style={{...applyThemeStyles(theme)}}>
      {rows.map((section, index) => {
        const imageLeft = index % 2 === 0
        const rowLayoutClass = imageLeft ? 'promo-grid-row image-left' : 'promo-grid-row image-right';
        const textPositionClass = imageLeft ? 'order-2' : 'order-1';
        const imagePositionClass = imageLeft ? 'order-1' : 'order-2';
        const optimizedImageURL = section.image?.asset?._ref
                ? urlFor(section.image).url()
                : undefined;

        return (
          <div key={section._key} className={rowLayoutClass}>
            <div className={`promo-text-block ${textPositionClass}`}>
              <div className="promo-text-inner">
                <h2 className="promo-title">{section.title}</h2>
                <p className="promo-description">{section.description}</p>
                <button className="promo-button">
                  {section.buttonText}
                </button>
              </div>
            </div>

            <div className={`promo-image-block ${imagePositionClass}`}>
              <img 
                src={optimizedImageURL} 
                className="promo-image" 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PromoSection;