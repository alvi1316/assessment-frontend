import React from "react";
import { PortableText } from "@portabletext/react";
import { applyThemeStyles } from "~/util/theme";
import type { HeroBannerProps } from "~/types/component";
import { urlFor } from '~/util/imageUrl';
import { stegaClean } from "@sanity/client/stega";
import "~/styles/HeroBanner.css";

export const HeroBanner: React.FC<HeroBannerProps> = ({
    theme,
    text,
    textPosition,
    backgroundImage,
    ctaText,
    ctaUrl,
}) => {
    const localThemeStyles = applyThemeStyles(theme);
    const optimizedBgUrl = backgroundImage?.asset?._ref
        ? urlFor(backgroundImage).url()
        : undefined;

    return (
        <section
            className={`hero-banner text-align-${stegaClean(textPosition)}`}
            style={{
                ...localThemeStyles,
                backgroundImage: `url(${optimizedBgUrl})`
            }}
        >
            {backgroundImage && <div className="hero-banner-overlay" />}

            <div className="hero-banner-container">
                {text && (
                    <div className="hero-banner-rich-text">
                        <PortableText value={text} />
                    </div>
                )}

                {ctaText && ctaUrl && (
                    <button className="hero-banner-button">{ctaText}</button>
                )}
            </div>
        </section>
    );
};
