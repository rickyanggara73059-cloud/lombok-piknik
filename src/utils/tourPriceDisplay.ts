import type { TourCatalogueProduct } from "../data/tourCatalogue";
import { formatEstimatedUsd, formatUsd, toEstimatedUsd } from "./formatCurrency";

// Canonical USD amount carries the approved adjustment once per person.
export function getTourUsdPrice(product: TourCatalogueProduct, amount = product.priceIdr, guests = 1): number {
  if (product.priceBasis === "per_boat") return product.usdDisplay.amount;
  return toEstimatedUsd(amount) + (product.priceUsd - toEstimatedUsd(product.priceIdr)) * guests;
}
export function formatTourDisplayPrice(product: TourCatalogueProduct, amount = product.priceIdr, guests = 1): string {
  return product.priceBasis === "per_boat"
    ? "US" + formatUsd(product.usdDisplay.amount) + " per boat"
    : "US" + formatUsd(getTourUsdPrice(product, amount, guests));
}
export function formatTourPriceText(text: string, product?: TourCatalogueProduct): string {
  return text.replace(/\bIDR\s+(\d{1,3}(?:,\d{3})+|\d+)\b/g, (_, amount: string) => {
    const idr = Number(amount.replaceAll(",", ""));
    return product ? formatTourDisplayPrice(product, idr) : formatEstimatedUsd(idr);
  });
}
