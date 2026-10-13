import { products } from "./products";
import { privateSpeedboatPackageDrafts } from "./privateSpeedboatPackages";
import type { Product } from "../types/product";
import type { PrivateSpeedboatPackageDraft } from "./privateSpeedboatPackages";

export type TourCatalogueProduct = Product | PrivateSpeedboatPackageDraft;

// These three explicitly requested reference packages may be browsed while pending.
// Other placeholders stay excluded; this does not promote any verification status.
export const tourCatalogue: TourCatalogueProduct[] = [
  ...products.filter((product) => !product.isPlaceholder),
  ...privateSpeedboatPackageDrafts,
];
