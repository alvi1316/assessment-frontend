import React from "react";
import "~/styles/SingleProductSection.css";
import type { SingleProductSectionProp } from "~/types/component";
import { applyThemeStyles } from "~/util/theme";

interface MoneyV2 {
    amount: string;
    currencyCode: string;
}

interface ImageType {
    __typename?: string;
    id?: string;
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
}

interface ProductVariant {
    id: string;
    title: string;
    sku?: string | null;
    availableForSale: boolean;
    price: MoneyV2;
    compareAtPrice?: MoneyV2 | null;
    image?: ImageType | null;
    selectedOptions: Array<{ name: string; value: string }>;
    product: {
        title: string;
        handle: string;
    };
    unitPrice?: MoneyV2 | null;
}

interface SwatchType {
    color?: string | null;
    image?: {
        previewImage?: {
            url: string;
        } | null;
    } | null;
}

interface OptionValue {
    name: string;
    firstSelectableVariant?: ProductVariant | null;
    swatch?: SwatchType | null;
}

interface ProductOption {
    name: string;
    optionValues: OptionValue[];
}

export interface ProductData {
    id: string;
    title: string;
    vendor: string;
    handle: string;
    descriptionHtml: string;
    description: string;
    options: ProductOption[];
    selectedOrFirstAvailableVariant?: ProductVariant | null;
    seo: {
        title?: string | null;
        description?: string | null;
    };
}

interface ProductShowcaseProps {
    sanityComponent: SingleProductSectionProp;
    productData: { product: ProductData };
}

export default function SingleProductSection({ productData, sanityComponent }: ProductShowcaseProps) {
    
    if(!productData || !productData?.product) {
        return <div>Cannot find product!</div>
    }

    const product = productData?.product
    const variant = product?.selectedOrFirstAvailableVariant;
    const mainImage = variant?.image || { url: "", altText: product.title };

    const formatPrice = (money: MoneyV2) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: money.currencyCode,
        }).format(parseFloat(money.amount));
    };

    const isOnSale = variant?.compareAtPrice &&
        parseFloat(variant.compareAtPrice.amount) >
            parseFloat(variant.price.amount);

    return (
        <section className="product-showcase" style={{...applyThemeStyles(sanityComponent.theme)}}>
            <div className="product-showcase__container">
                <div className="product-showcase__media">
                    {mainImage.url
                        ? (
                            <img
                                src={mainImage.url}
                                alt={mainImage.altText || product.title}
                                width={mainImage.width || 600}
                                height={mainImage.height || 600}
                                className="product-showcase__image"
                            />
                        )
                        : (
                            <div className="product-showcase__image-placeholder">
                                No Image Available
                            </div>
                        )}
                </div>

                <div className="product-showcase__details">
                    <span className="product-showcase__vendor">
                        {product.vendor}
                    </span>
                    <h1 className="product-showcase__title">{product.title}</h1>

                    <div className="product-showcase__price-container">
                        {variant && (
                            <>
                                <span
                                    className={`product-showcase__price ${
                                        isOnSale
                                            ? "product-showcase__price--sale"
                                            : ""
                                    }`}
                                >
                                    {formatPrice(variant.price)}
                                </span>
                                {isOnSale && variant.compareAtPrice && (
                                    <span className="product-showcase__compare-price">
                                        {formatPrice(variant.compareAtPrice)}
                                    </span>
                                )}
                            </>
                        )}

                        {variant && !variant.availableForSale && (
                            <span className="product-showcase__badge product-showcase__badge--sold-out">
                                Sold Out
                            </span>
                        )}
                    </div>

                    <hr className="product-showcase__divider" />

                    {product.options &&
                        product.options.map((option) => (
                            <div
                                key={option.name}
                                className="product-showcase__option-group"
                            >
                                <h3 className="product-showcase__option-label">
                                    {option.name}
                                </h3>
                                <div className="product-showcase__option-values">
                                    {option.optionValues.map((value) => {
                                        const swatchStyle: React.CSSProperties =
                                            {};
                                        if (value.swatch?.color) {
                                            swatchStyle.backgroundColor =
                                                value.swatch.color;
                                        } else if (
                                            value.swatch?.image?.previewImage
                                                ?.url
                                        ) {
                                            swatchStyle.backgroundImage =
                                                `url(${value.swatch.image.previewImage.url})`;
                                        }

                                        const hasSwatch = value.swatch?.color ||
                                            value.swatch?.image?.previewImage
                                                ?.url;

                                        return (
                                            <div
                                                key={value.name}
                                                className={`product-showcase__option-value ${
                                                    hasSwatch
                                                        ? "product-showcase__option-value--swatch"
                                                        : ""
                                                }`}
                                                style={swatchStyle}
                                                title={value.name}
                                            >
                                                {!hasSwatch && value.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                    <div className="product-showcase__description-container">
                        <h3 className="product-showcase__description-label">
                            Description
                        </h3>
                        <div
                            className="product-showcase__description"
                            dangerouslySetInnerHTML={{
                                __html: product.descriptionHtml,
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
