import type { Route } from "./+types/pages.$handle";
import { defineQuery } from "groq";
import { Query } from "hydrogen-sanity";
import { CollectionCarousel } from "~/components/CollectionCarousel";
import { CollectionSection } from "~/components/CollectionSection";
import { FooterSection } from "~/components/FooterSection";
import { HeroBanner } from "~/components/HeroBanner";
import { Navbar } from "~/components/Navbar";
import { ProductCarousel } from "~/components/ProductCarousel";
import { PromoSection } from "~/components/PromoSection";
import SingleProductSection, { type ProductData } from "~/components/SingleProductSection";
import type { PageData } from "~/types/component";
import { applyThemeStyles } from "~/util/theme";

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product($id: ID!) {
    product(id: $id) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const CUSTOM_PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _type,
    title,
    "slug": slug.current,
    theme -> {
      _type,
      "colorBgAccent": colorBgAccent.value,
      "colorBgPrimary": colorBgPrimary.value,
      "colorBgSecondary": colorBgSecondary.value,
      "colorBorderDefault": colorBorderDefault.value,
      "colorBorderFocus": colorBorderFocus.value,
      "colorBorderMuted": colorBorderMuted.value,
      "colorTextAccent": colorTextAccent.value,
      "colorTextPrimary": colorTextPrimary.value,
      "colorTextSecondary": colorTextSecondary.value,
      themeName, 
    },
    pageBuilder[] {
      isSticky,
      block -> {
         _id,
        _type,
        "theme": select(
          theme->themeName != "Default Theme" => theme -> {
            _type,
            themeName, 
            "colorBgAccent": colorBgAccent.value,
            "colorBgPrimary": colorBgPrimary.value,
            "colorBgSecondary": colorBgSecondary.value,
            "colorBorderDefault": colorBorderDefault.value,
            "colorBorderFocus": colorBorderFocus.value,
            "colorBorderMuted": colorBorderMuted.value,
            "colorTextAccent": colorTextAccent.value,
            "colorTextPrimary": colorTextPrimary.value,
            "colorTextSecondary": colorTextSecondary.value,
          },
          null
        ),
        _type == "navBar" => {
          logo,
          menuItems[] {
            _key,
            label,
            url
          }
        },
        _type == "heroBanner" => {
          title,
          backgroundImage ,
          text,
          textPosition,
          ctaText,
          ctaUrl
        },
        _type == "carouselSlider" => {
          carouselType,
          title,
          cardSpace,
          cardStep,
          carouselType == "collections" => {
            collections [] -> {
              _id,
              "gid": store.gid,
              "title": store.title,
            }
          },
          carouselType == "products" => {
            products [] -> {
              _id,
              "numericalId": store.id,
              "gid": store.gid,
              "title": store.title,
              "previewImageUrl": store.previewImageUrl,
              "variants": store.variants [] -> {
                _id,
                _type,
                "sku": store.sku,
                "gid": store.gid,
                "price": store.price,
              }
            }
          },
        },
        _type == "promoSection" => {
          title,
          rows [] {
            _key,
            title,
            description,
            buttonText,
            image
          }
        },
        _type == "collectionSection" => {
          title,
          description,
          collections [] -> {
            _id,
            "gid": store.gid,
            "title": store.title,
            collectionImage
          }
        },
        _type == "footerSection" => {
          copyrightText,
          links[] 
        },
      }
    },
  }
`);

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen` }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData(
  { context, request, params }: Route.LoaderArgs,
) {
  if (!params.handle) {
    throw new Error("Missing page handle");
  }

  const url = new URL(request.url);
  const productQueryParam = url.searchParams.get('product');
  let productData: any = await context.storefront.query(
      PRODUCT_QUERY, {
        variables: { id : `gid://shopify/Product/${productQueryParam}` }
      }
    ).catch(e => {
      return null
    })

  const initial = await context.sanity.query(CUSTOM_PAGE_QUERY, {
    slug: params.handle,
  });

  if (!initial) {
    throw new Response("Not Found", { status: 404 });
  }

  return { initial, slug: params.handle, product: productData?.product };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Page(
  { loaderData }: { loaderData: { initial: any; slug: string; product?: ProductData } },
) {
  const { initial, slug, product } = loaderData;
  return (
    <Query query={CUSTOM_PAGE_QUERY} params={{ slug }} options={{ initial }}>
      {(homepage: PageData, encodeDataAttribute) => {
        const globalPageStyles = applyThemeStyles(homepage.theme);
        return (
          <div
            className="page-builder-container"
            style={{ ...globalPageStyles }}
          >
            {homepage.pageBuilder?.map((elements, index) => {
              const component = elements.block;
              const isSticky = elements.isSticky;
              return (
                <div
                  key={component._id + index}
                  style={{
                    zIndex: 10 + index,
                    position: isSticky ? "sticky" : "relative",
                    top: isSticky ? 0 : undefined,
                  }}
                >
                  {(() => {
                    switch (component._type) {
                      case "navBar":
                        return <Navbar {...component} />;
                      case "heroBanner":
                        return <HeroBanner {...component} />;
                      case "carouselSlider":
                        switch (component.carouselType) {
                          case "collections":
                            return <CollectionCarousel {...component} />;
                          case "products":
                            return <ProductCarousel {...component} />;
                          default:
                            return null;
                        }
                      case "promoSection": 
                        return <PromoSection {...component}/>
                      case "collectionSection": 
                        return <CollectionSection {...component}/>
                      case "footerSection":
                        return <FooterSection {...component}/>
                      case "singleProductSection":
                        return <SingleProductSection product={product} sanityComponent={component} />;
                      default:
                        return null;
                    }
                  })()}
                </div>
              );
            })}
          </div>
        );
      }}
    </Query>
  );
}
