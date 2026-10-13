export interface Service {
  id: string;
  title: string;
  category?: string;
  description: string;
  icon: string;
  services?: string[];
  startingPriceIdr?: number;
  // Omitted when the price basis has not been supplied; never assume per pax.
  priceUnit?: string;
  // True until service information and any prices are verified for production.
  isPlaceholder: boolean;
}
