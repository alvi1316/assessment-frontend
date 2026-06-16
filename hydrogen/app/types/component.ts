export interface ThemeConfig {
    _type: 'themeConfig';
    themeName?: string;
    colorTextPrimary?: string;
    colorTextSecondary?: string;
    colorTextAccent?: string;
    colorBgPrimary?: string;
    colorBgSecondary?: string;
    colorBgAccent?: string;
    colorBorderDefault?: string;
    colorBorderMuted?: string;
    colorBorderFocus?: string;
}

export interface PageData {
    _type: 'page';
    title: string;
    slug: string;
    theme: ThemeConfig;
    pageBuilder?: PageBlock[];
}

export interface SanityImage {
    _type: 'image';
    alt: string;
    asset: {
        _ref: string;
        _type: 'reference';
    };
    hotspot?: {
        x: number;
        y: number;
        height: number;
        width: number;
    };

}

export interface MenuItem {
    _key: string;
    label: string;
    url: string;
}

export interface NavBarProps {
    _type: 'navBar';
    _id: string;
    theme?: ThemeConfig;
    logo?: SanityImage;
    menuItems?: MenuItem[];
}

export interface HeroBannerProps {
    _type: 'heroBanner';
    _id: string;
    theme?: ThemeConfig;
    title: string;
    text?: any[];
    textPosition: 'left' | 'right' | 'center';
    backgroundImage?: SanityImage;
    ctaText?: string;
    ctaUrl?: string;
}

export interface CollectionSectionProps {
    _type: 'collectionSection';
    _id: string;
    title: string;
    description: string;
    theme?: ThemeConfig;
    collections: {
        _id: string;
        gid: string;
        title: string;
        collectionImage: SanityImage;
    }[]
}

export interface CollectionCarouselSliderProps {
    _type: 'carouselSlider';
    _id: string;
    title: string;
    theme?: ThemeConfig;
    carouselType: 'collections';
    collections: {
        _id: string;
        gid: string;
        title: string;
    }[]
}

export interface ProductsCarouselSliderProps {
    _type: 'carouselSlider';
    _id: string;
    title: string;
    theme?: ThemeConfig;
    cardStep: number;
    cardSpace: number;
    carouselType: 'products';
    products: {
        _id: string;
        numericalId: number,
        gid: string;
        title: string;
        previewImageUrl?: string;
        variants: {
            _id: string,
            _type: 'productVariant',
            sku: string,
            gid: string,
            price: number
        }[]
    }[];
}

export interface PromoSectionProp {
    _type: 'promoSection';
    _id: string;
    title: string;
    theme?: ThemeConfig; 
    rows: {
        _key: string;
        title: string;
        description: string;
        buttonText: string;
        image: SanityImage;
    }[]
}

export interface FooterSectionProps {
    _type: 'footerSection';
    _id: string;
    theme?: ThemeConfig; 
    copyrightText: string;
    links: {
        _key: string;
        label: string;
        url: string;
    }[];
}

export interface SingleProductSectionProp {
    _type: 'singleProductSection';
    _id: string;
    name: string;
    theme?: ThemeConfig;
}

export type PageBlock = {
    block: NavBarProps | HeroBannerProps | CollectionCarouselSliderProps | ProductsCarouselSliderProps | PromoSectionProp | CollectionSectionProps | FooterSectionProps | SingleProductSectionProp,
    isSticky: Boolean
};