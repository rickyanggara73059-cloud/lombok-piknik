import type { SourceReference, VerificationStatus } from "./source";

export type PhotoCategory = "boat" | "cabin" | "facility" | "destination" | "food" | "activity";

export interface PhotoSubject {
  entityType: "product" | "boat" | "cabin" | "facility" | "destination" | "food" | "activity";
  entityId: string;
}

export interface Photo {
  id: string;
  path: string;
  alt: string;
  caption?: string;
  category: PhotoCategory;
  subjects: PhotoSubject[];
  sourceRefs: SourceReference[];
  status: VerificationStatus;
  // Printed destination label only; no invented destination master ID.
  relatedDestination?: string;
  notes?: string[];
  // Provenance of the decoded image or photographic crop, in source-image pixels.
  extraction?: {
    method: "embedded_image" | "embedded_image_crop" | "page_render_crop";
    sourceImageId: string;
    sourceWidth: number;
    sourceHeight: number;
    crop?: { x: number; y: number; width: number; height: number };
  };
}

// Original regions remain immutable provenance records; canonical IDs use a separate namespace.
export interface CanonicalPhoto extends Photo {
  regionIds: string[];
  mappingNotes: string[];
  marketingUse: "needs_confirmation" | "historical_only";
}

export interface PhotoDeduplicationRecord {
  regionId: string;
  canonicalPhotoId: string;
  matchedRegionId?: string;
  method: "canonical" | "exact_duplicate" | "crop_duplicate";
  evidence: string;
}

export type PhotoMarketingStatus = "reference" | "marketing_candidate" | "marketing_approved";
export type PhotoMappingStatus = "confirmed" | "needs_confirmation" | "unmapped";

// Source associations only; these IDs never authorize Product marketing or booking.
export interface PhotoSubjectMapping {
  boatId?: string;
  cabinId?: string;
  facilityIds?: string[];
  productIds?: string[];
  destination?: string;
  activity?: string;
  food?: string;
}

export interface CuratedPhotoSelection {
  photoId: string;
  purpose: "reference_preview";
  marketingStatus?: PhotoMarketingStatus;
  mappingStatus?: PhotoMappingStatus;
  subjectMapping?: PhotoSubjectMapping;
  mappingSourceRefs?: SourceReference[];
  readinessNotes?: string[];
  status: VerificationStatus;
  notes: string[];
}

export interface PhotoCurationDecision {
  photoId: string;
  included: boolean;
  reasons: string[];
}
