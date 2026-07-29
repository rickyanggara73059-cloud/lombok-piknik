export interface Product {
  id: string;
  slug: string;
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

  highlights: string[];
  included: string[];

  whatsappMessage: string;
}


// Kurs USD
const USD_RATE = 17000;


// Konversi otomatis Rupiah ke Dollar
const toUsd = (idr: number) => {
  return Math.round(idr / USD_RATE);
};



export const products: Product[] = [

  {
    id: "gili-3-islands",
    slug: "gili-3-islands-tour-lombok",

    title: "Gili 3 Islands Tour",

    category: "Gili Tour",
    location: "North West Lombok",
    duration: "1 Day",

    priceIdr: 450000,
    priceUsd: toUsd(450000),

    rating: 4.9,
    reviewsCount: 312,

    image: "/images/packages/sunsetgili.jpg",

    featured: true,


    description:
      "Explore Gili Trawangan, Gili Meno, and Gili Air with snorkeling experience.",


    highlights: [
      "Visit Gili Trawangan, Gili Meno & Gili Air",
      "Snorkeling with beautiful marine life",
      "Crystal clear tropical ocean",
      "Island hopping experience"
    ],


    included: [
      "Private transport",
      "Boat ticket",
      "Snorkeling equipment",
      "Local guide"
    ],


    whatsappMessage:
      "Hello Pacific Lombok, I want to book Gili 3 Islands Tour."
  },





  {
    id: "sembalun-rinjani",

    slug: "sembalun-rinjani-experience-lombok",

    title: "Sembalun Rinjani Experience",

    category: "Mountain Tour",

    location: "Sembalun Lombok",

    duration: "2 Days",


    priceIdr: 1500000,
    priceUsd: toUsd(1500000),


    rating: 4.8,

    reviewsCount: 120,


    image: "/images/packages/sembalun.jpg",

    featured: true,


    description:
      "Enjoy the beauty of Mount Rinjani area and traditional villages.",


    highlights: [
      "Amazing Sembalun valley view",
      "Traditional Sasak village visit",
      "Mount Rinjani landscape",
      "Beautiful sunrise scenery"
    ],


    included: [
      "Private transport",
      "Local guide",
      "Entrance ticket",
      "Mineral water"
    ],


    whatsappMessage:
      "Hello Pacific Lombok, I want to book Sembalun Rinjani Experience."
  },





  {
    id: "kuta-mandalika-tour",

    slug: "kuta-mandalika-tour-lombok",

    title: "Kuta Mandalika Tour",

    category: "Beach Tour",

    location: "South Lombok",

    duration: "1 Day",


    priceIdr: 500000,
    priceUsd: toUsd(500000),


    rating: 4.8,

    reviewsCount: 95,


    image: "/images/packages/surfing.jpg",

    featured: true,


    description:
      "Discover Kuta Beach, Mandalika Circuit, and stunning southern Lombok landscapes.",


    highlights: [
      "Visit Kuta Mandalika Beach",
      "Photo stop at Mandalika Circuit",
      "Explore southern Lombok coastline",
      "Amazing ocean views"
    ],


    included: [
      "Private car",
      "Driver",
      "Fuel",
      "Parking fee"
    ],


    whatsappMessage:
      "Hello Pacific Lombok, I want to book Kuta Mandalika Tour."
  },





  {
    id: "lombok-waterfall-tour",

    slug: "lombok-waterfall-adventure",

    title: "Lombok Waterfall Adventure",

    category: "Nature Tour",

    location: "Central Lombok",

    duration: "1 Day",


    priceIdr: 450000,
    priceUsd: toUsd(450000),


    rating: 4.7,

    reviewsCount: 80,


    image: "/images/packages/tiukelep.jpg",

    featured: false,


    description:
      "Experience the natural beauty of Lombok waterfalls and local villages.",


    highlights: [
      "Visit stunning waterfalls",
      "Nature adventure experience",
      "Fresh mountain atmosphere",
      "Local village exploration"
    ],


    included: [
      "Transport",
      "Driver",
      "Entrance ticket",
      "Parking fee"
    ],


    whatsappMessage:
      "Hello Pacific Lombok, I want to book Lombok Waterfall Adventure."
  },





  {
    id: "rinjani-trekking",

    slug: "mount-rinjani-trekking-lombok",

    title: "Mount Rinjani Trekking",

    category: "Adventure Tour",

    location: "Sembalun, Lombok",

    duration: "2 Days 1 Night",


    priceIdr: 2500000,
    priceUsd: toUsd(2500000),


    rating: 4.9,

    reviewsCount: 210,


    image: "/images/packages/sunsetrinjani.jpg",

    featured: true,


    description:
      "Experience an unforgettable adventure trekking Mount Rinjani with professional local guides.",


    highlights: [
      "Professional trekking guide",
      "Amazing Mount Rinjani scenery",
      "Sunrise adventure",
      "Memorable hiking experience"
    ],


    included: [
      "Trekking guide",
      "Camping equipment",
      "Meals",
      "Permit ticket"
    ],


    whatsappMessage:
      "Hello Pacific Lombok, I want to book Mount Rinjani Trekking."
  },





  {
    id: "lombok-city-tour",

    slug: "lombok-city-tour-souvenir",

    title: "Lombok City Tour & Souvenir",

    category: "City Tour",

    location: "Lombok Island",

    duration: "1 Day",


    priceIdr: 400000,
    priceUsd: toUsd(400000),


    rating: 4.8,

    reviewsCount: 145,


    image: "/images/packages/islamic.jpg",

    featured: false,


    description:
      "Explore Lombok city attractions, local culture, traditional markets, and authentic souvenirs.",


    highlights: [
      "Explore Lombok culture",
      "Visit traditional market",
      "Local souvenir shopping",
      "City sightseeing"
    ],


    included: [
      "Private transport",
      "Driver",
      "Fuel",
      "Parking fee"
    ],


    whatsappMessage:
      "Hello Pacific Lombok, I want to book Lombok City Tour & Souvenir."
  }

];