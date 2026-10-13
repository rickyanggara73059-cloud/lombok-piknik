import type { ProductBoatOption } from "./boat";
import type { SourceReference, VerificationStatus } from "./source";
import type { DepartureSchedule, Exclusion, Inclusion, ItineraryDay, MeetingPoint, Term } from "./tourContent";
import type { OperationalIssue, ProductOperationalReference } from "./tourContent";

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  duration: string;

  // Lombok Awesome Tour selling price; never an operator/cabin source rate.
  priceIdr: number;
  priceUsd: number;

  rating: number;
  reviewsCount: number;

  image: string;

  featured: boolean;
  isPlaceholder?: boolean;
  pricingTiers?: { name: string; priceIdr: number; groupSize?: number }[];
  excludes?: string[];

  description: string;
  overview?: string;
  highlights: string[];
  included: string[];
  minimum?: string;
  minAvailable?: number;
  mealNotes?: string[];
  itinerary?: { title: string; entries: string[] }[];
  imageSource?: string;
  imageCredit?: { author: string; license: string; licenseUrl: string };
  whatsappMessage: string;

  // Retain optional fields from the previous standalone contract.
  badge?: string;
  maxPeople?: number;
  includes?: string[];

  // Optional PDF enrichment; legacy content above remains unchanged.
  availableBoats?: ProductBoatOption[];
  destinationPhotoIds?: string[];
  meetingPoints?: MeetingPoint[];
  departureSchedules?: DepartureSchedule[];
  terms?: Term[];
  sourceRefs?: SourceReference[];
  pdfItinerary?: ItineraryDay[];
  inclusions?: Inclusion[];
  exclusions?: Exclusion[];
  priceBasis?: "per_person" | "per_package" | "per_trip" | "unknown";
  sellingPriceStatus?: VerificationStatus;
  sellingPriceSourceRefs?: SourceReference[];
}

// Review metadata is stored separately from active Product selling content.
export interface ProductBoatCandidate {
  boatId: string;
  relationship: Extract<ProductOperationalReference["relationship"], "candidate">;
  status: VerificationStatus;
  operationalProfileIds: string[];
  cabinIds: string[];
  operatorRateIds: string[];
  facilityIds: string[];
  sourceRefs: SourceReference[];
  notes: string[];
}

export interface ProductReconciliationConflict {
  id: string;
  productId: string;
  kind: OperationalIssue["kind"];
  aspect: string;
  // Snapshots of compared values; null means the existing field is absent.
  existingValue: unknown;
  sourceValue: unknown;
  operationalProfileIds: string[];
  sourceRecordIds: string[];
  sourceRefs: SourceReference[];
  status: VerificationStatus;
  notes: string[];
}

export interface ProductContentReconciliation {
  id: string;
  productId: string;
  status: VerificationStatus;
  operationalReferenceIds: string[];
  boatCandidates: ProductBoatCandidate[];
  itineraryDayIds: string[];
  itineraryEntryIds: string[];
  inclusionIds: string[];
  exclusionIds: string[];
  meetingPointIds: string[];
  departureScheduleIds: string[];
  termIds: string[];
  // Only evidence-backed Product photo associations belong here, never a same-source match.
  photoIds: string[];
  sourceRefs: SourceReference[];
  conflictIds: string[];
  operationalIssueIds: string[];
  unresolvedNotes: string[];
  notes: string[];
}
