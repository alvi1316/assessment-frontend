import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

const builder = createImageUrlBuilder({
    projectId: `puu9huwr`,
    dataset: `production`,
});

export const urlFor = (source: SanityImageSource) => {
    return builder.image(source);
};