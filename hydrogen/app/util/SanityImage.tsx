import React from "react";
import { urlFor } from "./imageUrl";
import type { SanityImage as SanityImageType } from "~/types/component";

interface SanityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    image: SanityImageType;
    width?: number;
    height?: number;
}

export const SanityImage: React.FC<SanityImageProps> = ({
    image,
    width,
    height,
    alt,
    className,
    ...props
}) => {
    if (!image?.asset?._ref) return null;

    // 1. Build the base image source using hotspot/crop details from Sanity
    let imageBuilder = urlFor(image).auto("format");

    if (width) imageBuilder = imageBuilder.width(width);
    if (height) imageBuilder = imageBuilder.height(height);

    const src = imageBuilder.url();

    // 2. Generate a clean srcSet for responsive viewport sizes
    const srcSet = [640, 768, 1024, 1366, 1600, 1920]
        .map((w) => {
            // Calculate proportional height if a specific aspect ratio was requested
            const h = width && height
                ? Math.round((height / width) * w)
                : undefined;
            let scaledBuilder = urlFor(image).width(w).auto("format");
            if (h) scaledBuilder = scaledBuilder.height(h);
            return `${scaledBuilder.url()} ${w}w`;
        })
        .join(", ");

    return (
        <img
            src={src}
            srcSet={srcSet}
            sizes={props.sizes || "(max-width: 768px) 100vw, 50vw"}
            alt={alt || image.alt || "Image asset"}
            className={className}
            loading={props.loading || "lazy"}
            {...props}
        />
    );
};
