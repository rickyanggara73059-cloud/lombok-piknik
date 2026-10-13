import type { TourCatalogueProduct } from "../data/tourCatalogue";
import { formatEstimatedUsd, formatUsd } from "./formatCurrency";

export function formatTourDisplayPrice(product: TourCatalogueProduct, amount = product.priceIdr): string {
  return product.priceBasis === "per_boat"
    ? `US${formatUsd(product.usdDisplay.amount)} per boat`
    : formatEstimatedUsd(amount);
}

// Convert legacy tour price prose for display without rewriting documentary/base data.
export function formatTourPriceText(text: string): string {
  return text.replace(/\bIDR\s+(\d{1,3}(?:,\d{3})+|\d+)\b/g, (_, amount: string) =>
    formatEstimatedUsd(Number(amount.replaceAll(",", ""))),
  );
}
