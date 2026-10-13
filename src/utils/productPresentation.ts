import { getSourceVerificationStatus } from "./sourceVerification";
export { getSourceVerificationStatus } from "./sourceVerification";
import { products } from "../data/products";
import { sourceDocuments } from "../data/sources";
import {
  productReconciliations,
  productReconciliationConflicts,
} from "../data/productReconciliation";
import {
  operationalProfiles,
  productOperationalReferences,
  inclusions,
  exclusions,
  meetingPoints,
  departureSchedules,
  operationalTerms,
  operationalIssues,
} from "../data/tourOperations";
import type { SourceReference, VerificationStatus } from "../types/source";

type ReadonlyView<T> = T extends object
  ? { readonly [K in keyof T]: ReadonlyView<T[K]> }
  : T;

// Commercial fields only: optional PDF enrichment is never spread into this view.
const commercialKeys = [
  "id", "slug", "title", "category", "location", "image", "featured", "isPlaceholder",
  "rating", "reviewsCount", "priceIdr", "priceUsd", "pricingTiers",
  "duration", "minimum", "minAvailable", "description", "highlights",
  "included", "excludes", "mealNotes", "itinerary", "whatsappMessage",
] as const;

function required<T extends { id: string }>(items: readonly T[], id: string): T {
  const item = items.find((entry) => entry.id === id);
  if (!item) throw new Error(`Missing presentation reference: ${id}`);
  return item;
}


function presentation(productId: string, asOf: Date) {
  const product = products.find((item) => item.id === productId);
  if (!product) return undefined;
  const commercial = Object.fromEntries(
    commercialKeys.filter((key) => key in product).map((key) => [key, product[key]]),
  ) as Pick<typeof product, typeof commercialKeys[number]>;
  const reconciliation = productReconciliations.find((item) => item.productId === productId);
  const links = (reconciliation?.operationalReferenceIds ?? []).map((id) =>
    required(productOperationalReferences, id),
  );
  const conflicts = (reconciliation?.conflictIds ?? []).map((id) =>
    required(productReconciliationConflicts, id),
  );
  const issues = [...new Set([
    ...(reconciliation?.operationalIssueIds ?? []),
    ...operationalIssues.filter((issue) => links.some((link) =>
      issue.profileIds.includes(link.operationalProfileId),
    )).map((issue) => issue.id),
  ])].map((id) => required(operationalIssues, id));
  const operationalCandidates = links.map((link) => {
    if (link.productId !== productId) throw new Error("Presentation Product scope mismatch");
    const profile = required(operationalProfiles, link.operationalProfileId);
    const content = {
      id: profile.id,
      title: profile.title,
      duration: profile.duration,
      variant: profile.variant,
      status: profile.status,
      itinerary: profile.itinerary,
      inclusions: profile.inclusionIds.map((id) => required(inclusions, id)),
      exclusions: profile.exclusionIds.map((id) => required(exclusions, id)),
      meetingPoints: profile.meetingPointIds.map((id) => required(meetingPoints, id)),
      departureSchedules: profile.departureScheduleIds.map((id) => required(departureSchedules, id)),
      terms: profile.termIds.map((id) => required(operationalTerms, id)),
      notes: profile.notes,
      sourceRefs: profile.sourceRefs,
    };
    const evidence = [
      ...link.sourceRefs, ...(reconciliation?.sourceRefs ?? []), ...profile.sourceRefs,
      ...profile.itinerary.flatMap((day) => [
        ...day.sourceRefs, ...day.entries.flatMap((entry) => entry.sourceRefs),
      ]),
      ...[...content.inclusions, ...content.exclusions, ...content.meetingPoints,
        ...content.departureSchedules, ...content.terms].flatMap((record) => record.sourceRefs),
    ];
    const sourceStatus = getSourceVerificationStatus(evidence, asOf);
    const verified = (record: { status: VerificationStatus; sourceRefs: SourceReference[] }) =>
      record.status === "verified" && getSourceVerificationStatus(record.sourceRefs, asOf) === "verified";
    const recordsVerified = verified(profile) &&
      profile.itinerary.every((day) => verified(day) && day.entries.every(verified)) &&
      [...content.inclusions, ...content.exclusions, ...content.meetingPoints,
        ...content.departureSchedules, ...content.terms].every(verified);
    const currentUseAllowed = link.relationship === "confirmed" &&
      link.status === "verified" && reconciliation?.status === "verified" &&
      sourceStatus === "verified" && recordsVerified &&
      !conflicts.some((conflict) => conflict.operationalProfileIds.length === 0 ||
        conflict.operationalProfileIds.includes(profile.id)) &&
      !issues.some((issue) => issue.profileIds.length === 0 || issue.profileIds.includes(profile.id));
    return {
      id: link.id,
      relationship: link.relationship,
      status: link.status,
      referenceOnly: !currentUseAllowed,
      currentUseAllowed,
      sourceStatus,
      sourceRefs: link.sourceRefs,
      sourceDocuments: [...new Set(evidence.map((ref) => ref.documentId))]
        .map((id) => required(sourceDocuments, id)),
      notes: link.notes,
      content,
    };
  });
  const eligible = operationalCandidates.filter((candidate) => candidate.currentUseAllowed);
  // Multiple eligible variants still require a choice; never select one by array order.
  const operational = eligible.length === 1 ? eligible[0] : undefined;
  return {
    commercial,
    operational,
    reference: {
      status: reconciliation?.status,
      referenceOnly: true as const,
      currentUseAllowed: false as const,
      sourceStatus: getSourceVerificationStatus(reconciliation?.sourceRefs ?? [], asOf),
      sourceRefs: reconciliation?.sourceRefs ?? [],
      operationalCandidates: operationalCandidates.filter((candidate) => candidate !== operational)
        .map((candidate) => ({ ...candidate, referenceOnly: true as const, currentUseAllowed: false as const })),
      conflicts,
      issues,
      unresolvedNotes: reconciliation?.unresolvedNotes ?? [],
    },
  };
}

export type ProductPresentation = ReadonlyView<NonNullable<ReturnType<typeof presentation>>>;

// Prepared for a future consumer; existing UI/booking imports remain unchanged.
// These are computed read-only views, not copies of master datasets or new selling facts.
export function selectProductPresentation(
  productId: string,
  asOf: Date = new Date(),
): ProductPresentation | undefined {
  return presentation(productId, asOf);
}
