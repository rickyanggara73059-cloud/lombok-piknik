import { formatUsd } from "../utils/formatCurrency";
import type { Product } from "../types/product";
import type { VerificationStatus } from "../types/source";

// Explicitly included in Tours as provisional reference packages by owner request.
// Existing local destination photography replaces the original reference posters.
// Prices and schedules remain pending operator approval.
// Booking must use a fixed per-boat total, never the existing per-person calculation.
export type PrivateSpeedboatPackageDraft = Omit<Product, "image" | "priceBasis"> & {
  image: string;
  imagePosition: string;
  priceBasis: "per_boat";
  groupRange: { min: number; max: number };
  operationalStatus: VerificationStatus;
  assetStatus: "reference_image_available";
  usdDisplay: {
    amount: number;
    preciseAmount: number;
    currency: "USD";
    basis: "per_boat";
    idrPerUsd: number;
    rateDate: "2026-10-12";
    provisional: true;
    approvalStatus: "needs_confirmation";
    label: string;
  };
};

const destinations = [
  "Padar Island", "Komodo Island", "Pink Beach",
  "Taka Makassar", "Manta Point", "Kanawa Island",
];

const referenceItinerary = [
  "06:00 Hotel pickup.",
  "06:30 Departure from Labuan Bajo.",
  "08:00 Padar Island.",
  "10:00 Komodo Island.",
  "12:00 Pink Beach and lunch.",
  "13:30 Taka Makassar.",
  "14:30 Manta Point.",
  "16:00 Kanawa Island.",
  "17:30 Return to Labuan Bajo.",
];

const included = [
  "Private speedboat", "Captain and crew", "Lunch box",
  "Snorkeling gear", "Mineral water",
];
const excludes = [
  "National park fees", "Komodo ranger fees", "Personal expenses",
  "Hotel", "Flights",
];

// User-specified provisional reference rate dated 12 October 2026.
// Fixed for draft review only; not a live rate or an approved operator USD quote.
const PROVISIONAL_IDR_PER_USD = 17884;

// Explicit US$ prefix and per-boat basis for all draft-facing price text.
const formatDraftBoatPrice = (amount: number) => `US${formatUsd(amount)} per boat`;

export const privateSpeedboatPackageDrafts: PrivateSpeedboatPackageDraft[] = [
  { min: 1, max: 5, priceIdr: 10000000, usdDisplayPrice: 560, photo: "YAR07628.jpeg", imagePosition: "50% 75%" },
  { min: 6, max: 10, priceIdr: 15000000, usdDisplayPrice: 840, photo: "DJI_0501.jpeg", imagePosition: "50% 65%" },
  { min: 11, max: 15, priceIdr: 20000000, usdDisplayPrice: 1120, photo: "DSCF8873.jpeg", imagePosition: "50% 60%" },
].map(({ min, max, priceIdr, usdDisplayPrice, photo, imagePosition }) => ({
  id: `private-speedboat-labuan-bajo-${min}-${max}-persons`,
  slug: `private-speedboat-labuan-bajo-${min}-${max}-persons`,
  title: `Private Speedboat Labuan Bajo — ${min}–${max} Persons`,
  category: "Private Speedboat",
  location: "Labuan Bajo",
  duration: "1 Day",
  priceIdr,
  priceUsd: usdDisplayPrice, // Provisional marketing display only; IDR remains the base price.
  usdDisplay: {
    amount: usdDisplayPrice,
    preciseAmount: priceIdr / PROVISIONAL_IDR_PER_USD, // Unrounded calculation retained for review.
    currency: "USD" as const,
    basis: "per_boat" as const,
    idrPerUsd: PROVISIONAL_IDR_PER_USD,
    rateDate: "2026-10-12" as const,
    provisional: true as const,
    approvalStatus: "needs_confirmation" as const,
    label: `${formatDraftBoatPrice(usdDisplayPrice)} — provisional; pending operator approval`,
  },
  priceBasis: "per_boat" as const,
  sellingPriceStatus: "needs_confirmation" as const,
  operationalStatus: "needs_confirmation" as const,
  groupRange: { min, max }, // Requested pricing band, not certified vessel capacity.
  minimum: `${min} persons`,
  rating: 0,
  reviewsCount: 0,
  featured: false,
  isPlaceholder: true,
  // Reused from the existing local Labuan Bajo/Komodo photo-pack gallery.
  image: `/images/destinations/labuan-bajo-komodo/${photo}`,
  imageSource: `/images/destinations/labuan-bajo-komodo/${photo}`,
  imagePosition,
  assetStatus: "reference_image_available" as const,
  description: `Reference package for ${min}–${max} persons at ${formatDraftBoatPrice(usdDisplayPrice)}. Provisional price pending operator approval; schedule and operational details are pending operator verification.`,
  highlights: [...destinations],
  included: [...included],
  excludes: [...excludes],
  itinerary: [{ title: "Day 1 — Reference schedule; pending operator verification", entries: [...referenceItinerary] }],
  whatsappMessage: `Hello, I would like information about Private Speedboat Labuan Bajo for ${min}–${max} persons. Provisional reference price: ${formatDraftBoatPrice(usdDisplayPrice)}, pending operator approval. Please confirm the price, schedule, availability, and booking details.`,
}));
