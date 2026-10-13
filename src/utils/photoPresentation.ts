import { rawPhotoInventory, photos, photoDeduplication } from "../data/photos";
import { curatedPhotos, photoCurationDecisions } from "../data/curatedPhotos";
import { sourceDocuments } from "../data/sources";
import { getSourceVerificationStatus } from "./sourceVerification";

type ReadonlyView<T> = T extends object
  ? { readonly [K in keyof T]: ReadonlyView<T[K]> }
  : T;

function required<T>(item: T | undefined, description: string): T {
  if (!item) throw new Error(`Missing photo presentation reference: ${description}`);
  return item;
}

function presentation(photoId: string, asOf: Date) {
  const region = rawPhotoInventory.find((photo) => photo.id === photoId);
  const resolution = region ? required(photoDeduplication.find((entry) =>
    entry.regionId === region.id,
  ), region.id) : undefined;
  const canonicalId = resolution?.canonicalPhotoId ?? photoId;
  const canonical = photos.find((photo) => photo.id === canonicalId);
  if (!canonical) {
    if (region) throw new Error(`Missing photo presentation reference: ${canonicalId}`);
    return undefined;
  }
  if (region && !canonical.regionIds.includes(region.id)) {
    throw new Error("Photo presentation canonical/region scope mismatch");
  }
  const regions = canonical.regionIds.map((id) => required(
    rawPhotoInventory.find((photo) => photo.id === id), id,
  ));
  const selection = curatedPhotos.find((photo) => photo.photoId === canonical.id);
  const curation = required(photoCurationDecisions.find((decision) =>
    decision.photoId === canonical.id,
  ), canonical.id);
  const evidence = [...canonical.sourceRefs, ...regions.flatMap((photo) => photo.sourceRefs),
    ...(selection?.mappingSourceRefs ?? [])];
  const sourceStatus = getSourceVerificationStatus(evidence, asOf);
  const reasons: string[] = [];
  if (!selection) reasons.push("not_curated");
  if (!curation.included) reasons.push("curation_rejected");
  if (selection?.marketingStatus !== "marketing_approved") reasons.push("not_marketing_approved");
  if (canonical.status !== "verified" || regions.some((photo) => photo.status !== "verified") ||
    selection?.status !== "verified") reasons.push("verification_incomplete");
  if (sourceStatus !== "verified") reasons.push(`source_${sourceStatus}`);
  if (canonical.marketingUse === "historical_only") reasons.push("historical_only");
  else reasons.push("image_use_needs_confirmation");
  if (selection?.mappingStatus !== "confirmed") reasons.push("subject_mapping_unconfirmed");
  if (canonical.mappingNotes.length) reasons.push("mapping_notes_require_review");
  const marketingEligible = reasons.length === 0;
  return {
    requestedId: photoId,
    canonicalId: canonical.id,
    information: canonical,
    requestedRegion: region,
    resolution,
    regions,
    curated: selection,
    curation,
    marketingStatus: selection?.marketingStatus ?? "reference",
    sourceStatus,
    sourceDocuments: [...new Set(evidence.map((ref) => ref.documentId))].map((id) =>
      required(sourceDocuments.find((document) => document.id === id), id),
    ),
    referenceOnly: !marketingEligible,
    marketingEligible,
    currentUseAllowed: marketingEligible,
    exclusionReasons: reasons,
  };
}

export type PhotoPresentation = ReadonlyView<NonNullable<ReturnType<typeof presentation>>>;

// Internal source paths are provenance, not new browser asset routes.
// Curated reference_preview never grants image-use approval or Product ownership.
export function selectPhotoById(photoId: string, asOf: Date = new Date()): PhotoPresentation | undefined {
  return presentation(photoId, asOf);
}

export function selectCuratedPhotoById(
  photoId: string, asOf: Date = new Date(),
): PhotoPresentation | undefined {
  const photo = presentation(photoId, asOf);
  return photo?.curated ? photo : undefined;
}

export function selectCuratedPhotoReferences(asOf: Date = new Date()): readonly PhotoPresentation[] {
  return curatedPhotos.map((selection) => required(presentation(selection.photoId, asOf), selection.photoId));
}

export function selectPublicMarketingPhotos(asOf: Date = new Date()): readonly PhotoPresentation[] {
  return selectCuratedPhotoReferences(asOf).filter((photo) => photo.marketingEligible);
}
