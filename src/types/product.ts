export interface Product {
  id: string;
  title: string;
  category: string;
  location: string;
  duration: string;

  priceIdr: number;
  priceUsd: number;

  rating: number;
  reviewsCount: number;

  image: string;

  featured: boolean;

  description: string;

  // Tambahan
  badge?: string;
  maxPeople?: number;
  includes?: string[];
}