export type VerificationStatus =
  | "verified"
  | "needs_confirmation"
  | "expired";

// ISO dates, only when explicitly known. Missing bounds imply no known bound.
// Missing validity does not imply current validity.
export interface SourceValidity {
  validFrom?: string;
  validUntil?: string;
  notes?: string;
}

export interface SourceDocument {
  id: string;
  fileName: string;
  validity?: SourceValidity;
  status: VerificationStatus;
  publisher?: string;
  operatorId?: string;
  version?: string;
}

export interface SourceReference {
  documentId: string;
  // PDF page numbers start at 1; omit if not known.
  pages?: number[];
  notes?: string;
  validity?: SourceValidity;
  status: VerificationStatus;
}
