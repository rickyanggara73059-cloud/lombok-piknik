import { products } from "../data/products";
import { SITE } from "./site";
import { formatTourPriceText, getTourUsdPrice } from "../utils/tourPriceDisplay";

export const productSchema = products.filter((product) => !product.isPlaceholder).map((product) => ({
  "@context": "https://schema.org",
  "@type": "Product",

  name: product.title,
  description: formatTourPriceText(product.description, product),
  image: product.image.startsWith("/") ? `${SITE.website.replace(/\/$/, "")}${product.image}` : product.image,

  category: product.category,

  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: product.rating,
    reviewCount: product.reviewsCount,
  },

  offers: {
    "@type": "Offer",
    price: getTourUsdPrice(product),
    priceCurrency: "USD",
    description: "Estimated USD display price; original IDR base retained.",
  },
}));
