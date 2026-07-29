import { products } from "../data/products";

export const productSchema = products.map((product) => ({
  "@context": "https://schema.org",
  "@type": "Product",

  name: product.title,
  description: product.description,
  image: product.image,

  category: product.category,

  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: product.rating,
    reviewCount: product.reviewsCount,
  },

  offers: {
    "@type": "Offer",
    price: product.priceIdr,
    priceCurrency: "IDR",
    availability: "https://schema.org/InStock",
  },
}));