import type { TourCatalogueProduct } from "../data/tourCatalogue";
import { formatTourDisplayPrice, formatTourPriceText } from "./tourPriceDisplay";

// Uses the six existing selling records and the explicitly requested provisional
// speedboat references; never imports PDF/operator rates or other candidate inventory.
export function getMinimumGuests(product: TourCatalogueProduct): number | undefined {
  const minimum = product.minimum?.match(/^(\d+)\s+(?:persons?|pax)$/i);
  return minimum ? Number(minimum[1]) : undefined;
}

export function getGuestOptions(product: TourCatalogueProduct): number[] {
  if (product.priceBasis === "per_boat") {
    return Array.from({ length: product.groupRange.max - product.groupRange.min + 1 }, (_, index) => product.groupRange.min + index);
  }
  const tiers = product.pricingTiers;
  if (tiers?.some((tier) => tier.groupSize !== undefined)) {
    return tiers.flatMap((tier) => tier.groupSize === undefined ? [] : [tier.groupSize]);
  }
  const minimum = getMinimumGuests(product) ?? 1;
  // Retain the existing guest selector range; this is not capacity/availability.
  return Array.from({ length: Math.max(10, minimum) - minimum + 1 }, (_, index) => minimum + index);
}

export function getDefaultTierIndex(product: TourCatalogueProduct): number {
  const index = product.pricingTiers?.findIndex((tier) => tier.priceIdr === product.priceIdr);
  return index === undefined || index < 0 ? 0 : index;
}

export function getTourQuote(product: TourCatalogueProduct, guests: number, tierIndex = getDefaultTierIndex(product)) {
  if (!Number.isInteger(guests) || guests < (getMinimumGuests(product) ?? 1)) return undefined;
  if (product.priceBasis === "per_boat") {
    if (guests > product.groupRange.max) return undefined;
    return { guests, unitPrice: product.priceIdr, totalPrice: product.priceIdr, tierName: undefined };
  }
  const tiers = product.pricingTiers;
  const groupPricing = tiers?.some((tier) => tier.groupSize !== undefined);
  const tier = groupPricing
    ? tiers?.find((tier) => tier.groupSize === guests)
    : tiers?.[tierIndex];
  if (tiers?.length && !tier) return undefined;
  const unitPrice = tier?.priceIdr ?? product.priceIdr;
  // Preserve the application's current per-pax selling calculation.
  return { guests, unitPrice, totalPrice: unitPrice * guests, tierName: tier?.name };
}

export type TourQuote = NonNullable<ReturnType<typeof getTourQuote>>;

export function getTourBookingMessage(product: TourCatalogueProduct, quote: TourQuote): string {
  if (product.priceBasis === "per_boat") {
    return `${formatTourPriceText(product.whatsappMessage, product)}\n\nGuest: ${quote.guests} persons\nProvisional total: ${formatTourDisplayPrice(product)}\nPrice and schedule pending operator verification. Please confirm availability and booking details.`;
  }
  return `${formatTourPriceText(product.whatsappMessage, product)}\n\nPackage: ${product.title}${quote.tierName ? `\nPrice option: ${quote.tierName}` : ""}\nGuest: ${quote.guests} Pax\nEstimated price / Pax: ${formatTourDisplayPrice(product, quote.unitPrice)}\nEstimated total price: ${formatTourDisplayPrice(product, quote.totalPrice, quote.guests)}\n\nPlease confirm availability and booking details.`;
}
