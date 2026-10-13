import type { SourceReference, SourceValidity, VerificationStatus } from "./source";

export interface Operator {
  id: string;
  name: string;
  sourceRefs: SourceReference[];
}

export interface Facility {
  id: string;
  name: string;
  description?: string;
  photoIds?: string[];
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export interface Boat {
  id: string;
  name: string;
  operatorId?: string;
  capacity?: number;
  capacityRange?: { min: number; max: number };
  crew?: number;
  specifications?: { name: string; value: string; sourceRefs: SourceReference[] }[];
  facilityIds?: string[];
  cabinIds?: string[];
  photoIds?: string[];
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export type OperatorPriceBasis = "per_person" | "per_cabin" | "per_trip" | "unknown";

// Source/operator prices only. Never a fallback for Product.priceIdr.
export interface CabinOperatorRate {
  id: string;
  priceIdr: number;
  extraBedPriceIdr?: number;
  // Preserve an explicit Add Person rate separately from an Extra Bed rate.
  extraPersonPriceIdr?: number;
  currency: "IDR";
  priceBasis: OperatorPriceBasis;
  rateKind: "operator" | "unknown";
  validity?: SourceValidity;
  status: VerificationStatus;
  sourceRefs: SourceReference[];
}

export interface Cabin {
  id: string;
  boatId: string;
  name: string;
  type?: string;
  deck?: string;
  capacity?: number;
  capacityRange?: { min: number; max: number };
  minimumBooking?: { quantity: number; unit: "person" | "cabin" | "night" | "trip" };
  facilities?: Facility[];
  operatorRates?: CabinOperatorRate[];
  photoIds?: string[];
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export interface ProductBoatOption {
  id: string;
  productId: string;
  boatId: string;
  cabinIds?: string[];
  scheduleIds?: string[];
  status: VerificationStatus;
  sourceRefs: SourceReference[];
}
