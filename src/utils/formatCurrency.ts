export function formatIdr(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatUsd(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

// Fixed existing application estimate convention; no live exchange-rate lookup.
// This is a display estimate, not an official operator USD tariff or payment rate.
export const APPLICATION_IDR_PER_USD = 17000;

export function toEstimatedUsd(priceIdr: number): number {
  return Math.round(priceIdr / APPLICATION_IDR_PER_USD);
}

export function formatEstimatedUsd(priceIdr: number): string {
  return `US${formatUsd(toEstimatedUsd(priceIdr))}`;
}
