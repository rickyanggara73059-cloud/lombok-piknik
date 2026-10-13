import { sourceDocuments } from "../data/sources";
import type { SourceReference, VerificationStatus } from "../types/source";

// Effective source state is separate from the original record/relationship status.
// Missing evidence or unknown validity is never proof of current use.
export function getSourceVerificationStatus(
  refs: readonly SourceReference[],
  asOf: Date = new Date(),
): VerificationStatus {
  if (!Number.isFinite(asOf.getTime())) throw new Error("Invalid verification date");
  const date = asOf.toISOString().slice(0, 10);
  let uncertain = refs.length === 0;
  for (const ref of refs) {
    const document = sourceDocuments.find((item) => item.id === ref.documentId);
    const validities = [ref.validity, document?.validity];
    if (ref.status === "expired" || document?.status === "expired" ||
      validities.some((validity) => validity?.validUntil && validity.validUntil < date)) {
      return "expired";
    }
    if (!document || ref.status !== "verified" || document.status !== "verified" ||
      !document.validity?.validUntil ||
      validities.some((validity) => validity?.validFrom && validity.validFrom > date)) {
      uncertain = true;
    }
  }
  return uncertain ? "needs_confirmation" : "verified";
}
