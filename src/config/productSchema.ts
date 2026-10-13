import { products } from "../data/products";
import { SITE } from "./site";
import { toEstimatedUsd } from "../utils/formatCurrency";
import { formatTourPriceText } from "../utils/tourPriceDisplay";

export const productSchema = products.filter((product) => !product.isPlaceholder).map((product) => ({
  "@context": "https://schema.org",
  "@type": "Product",

  name: product.title,
  description: formatTourPriceText(product.description),
  image: product.image.startsWith("/") ? `${SITE.website.replace(/\/$/, "")}${product.image}` : product.image,

  category: product.category,

  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: product.rating,
    reviewCount: product.reviewsCount,
  },

  offers: {
    "@type": "Offer",
    price: toEstimatedUsd(product.priceIdr),
    priceCurrency: "USD",
    description: "Estimated USD display price; original IDR base retained.",
  },
}));
