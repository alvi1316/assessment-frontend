import React from 'react';
import '~/styles/CollectionSection.css'; 
import type { CollectionSectionProps } from '~/types/component';
import { urlFor } from '~/util/imageUrl';

export const CollectionSection: React.FC<CollectionSectionProps> = ({_id, _type, title, description, collections}) => {

  return (
    <section className="collection-showcase">
      <div className="collection-header">
        <h2 className="collection-main-title">{title}</h2>
        <p className="collection-subtitle">{description}</p>
      </div>

      <div className="collection-grid">
        {
            collections.map((collection) => {
                const optimizedImageUrl = collection.collectionImage?.asset?._ref ? urlFor(collection.collectionImage).url() : undefined;
                return (
                    <div 
                        key={collection._id} 
                        className="collection-card"
                        onClick={() => {}}
                        role="button"
                    >
                        <div className="collection-image-wrapper">
                        <img 
                            src={optimizedImageUrl} 
                            alt={collection.title} 
                            className="collection-image" 
                            loading="lazy"
                        />
                        </div>
                        
                        <div className="collection-overlay">
                        <h3 className="collection-card-title">{collection.title}</h3>
                        <span className="collection-view-button">Explore Collection &rarr;</span>
                        </div>
                    </div>
                )
            })
        }
      </div>
    </section>
  );
};