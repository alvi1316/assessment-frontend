import type { CSSProperties } from 'react';
import { stegaClean } from '@sanity/client/stega';

export const applyCarouselThemeStyles = (cardStep: number | null, cardSpace: number | null): CSSProperties => {
    return {
        '--card-step': `${stegaClean(cardStep)}px` || '-80px',
        '--card-space': `${stegaClean(cardSpace)}px` || '300px',
    } as CSSProperties;
};