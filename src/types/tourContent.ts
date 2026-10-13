import type { SourceReference, SourceValidity, VerificationStatus } from "./source";

export interface ContentScope {
  entityType: "product" | "operator" | "boat" | "cabin" | "boat_option" | "source_document" | "operational_profile";
  entityId: string;
}

export interface ItineraryEntry {
  title: string;
  description?: string;
  time?: string;
  location?: string;
  notes?: string[];
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export interface ItineraryDay {
  day: number;
  title: string;
  entries: ItineraryEntry[];
  notes?: string[];
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export interface Inclusion {
  id: string;
  text: string;
  scope: ContentScope;
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export interface Exclusion {
  id: string;
  text: string;
  scope: ContentScope;
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export interface MeetingPoint {
  id: string;
  name: string;
  locationText?: string;
  time?: string;
  timeZone?: string;
  scope?: ContentScope;
  kind?: "meeting" | "pickup" | "dropoff" | "check_in";
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export interface DepartureSchedule {
  id: string;
  pattern?: string;
  date?: string;
  time?: string;
  timeZone?: string;
  meetingPointId?: string;
  boatOptionId?: string;
  scope?: ContentScope;
  notes?: string[];
  validity?: SourceValidity;
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export interface Term {
  id: string;
  category: string;
  text: string;
  scope: ContentScope;
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export interface OperationalItineraryEntry extends ItineraryEntry {
  id: string;
  sequence: number;
}

// Night One and Last Day retain their printed label without inventing a day number.
export interface OperationalItineraryDay extends Omit<ItineraryDay, "day" | "entries"> {
  id: string;
  sequence: number;
  day?: number;
  entries: OperationalItineraryEntry[];
}

export interface TourOperationalProfile {
  id: string;
  title: string;
  duration?: string;
  variant?: string;
  boatIds?: string[];
  itinerary: OperationalItineraryDay[];
  inclusionIds: string[];
  exclusionIds: string[];
  meetingPointIds: string[];
  departureScheduleIds: string[];
  termIds: string[];
  notes?: string[];
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

// Confirmation requires explicit evidence; neither relationship is live availability.
export interface ProductOperationalReference {
  id: string;
  productId: string;
  operationalProfileId: string;
  relationship: "candidate" | "confirmed";
  notes: string;
  sourceRefs: SourceReference[];
  status: VerificationStatus;
}

export interface OperationalIssue {
  id: string;
  kind: "conflict" | "unresolved";
  description: string;
  profileIds: string[];
  recordIds?: string[];
  claims?: { text: string; sourceRefs: SourceReference[] }[];
  sourceRefs: SourceReference[];
  status: "needs_confirmation";
}
