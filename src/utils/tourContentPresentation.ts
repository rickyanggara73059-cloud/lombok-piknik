import {
  operationalProfiles, inclusions, exclusions, meetingPoints,
  departureSchedules, operationalTerms, operationalIssues,
} from "../data/tourOperations";
import { sourceDocuments } from "../data/sources";
import type { SourceReference } from "../types/source";
import type { ContentScope } from "../types/tourContent";
import { getSourceVerificationStatus } from "./sourceVerification";

type ReadonlyView<T> = T extends object
  ? { readonly [K in keyof T]: ReadonlyView<T[K]> }
  : T;

function required<T extends { id: string }>(items: readonly T[], id: string): T {
  const item = items.find((record) => record.id === id);
  if (!item) throw new Error(`Missing tour content reference: ${id}`);
  return item;
}

function provenance(refs: SourceReference[], asOf: Date) {
  return {
    referenceOnly: true as const,
    currentUseAllowed: false as const,
    sourceStatus: getSourceVerificationStatus(refs, asOf),
    sourceDocuments: [...new Set(refs.map((ref) => ref.documentId))]
      .map((id) => required(sourceDocuments, id)),
  };
}

function presentation(profileId: string, asOf: Date) {
  const profile = operationalProfiles.find((record) => record.id === profileId);
  if (!profile) return undefined;
  const scoped = <T extends { id: string; scope?: ContentScope }>(items: readonly T[], id: string): T => {
    const record = required(items, id);
    const scope = record.scope;
    const supported = scope?.entityType === "operational_profile"
      ? scope.entityId === profile.id
      : scope?.entityType === "source_document" && profile.sourceRefs.some((ref) =>
        ref.documentId === scope.entityId,
      );
    if (!supported) throw new Error("Tour content/profile scope mismatch");
    return record;
  };
  const selectedInclusions = profile.inclusionIds.map((id) => scoped(inclusions, id));
  const selectedExclusions = profile.exclusionIds.map((id) => scoped(exclusions, id));
  const selectedMeetingPoints = profile.meetingPointIds.map((id) => scoped(meetingPoints, id));
  const selectedSchedules = profile.departureScheduleIds.map((id) => scoped(departureSchedules, id));
  const selectedTerms = profile.termIds.map((id) => scoped(operationalTerms, id));
  for (const schedule of selectedSchedules) {
    if (schedule.meetingPointId && !selectedMeetingPoints.some((point) =>
      point.id === schedule.meetingPointId,
    )) throw new Error("Tour content/schedule meeting point scope mismatch");
  }
  const issues = operationalIssues.filter((issue) => issue.profileIds.includes(profile.id));
  const evidence = [
    ...profile.sourceRefs,
    ...profile.itinerary.flatMap((day) => [
      ...day.sourceRefs, ...day.entries.flatMap((entry) => entry.sourceRefs),
    ]),
    ...[...selectedInclusions, ...selectedExclusions, ...selectedMeetingPoints,
      ...selectedSchedules, ...selectedTerms, ...issues]
      .flatMap((record) => record.sourceRefs),
  ];
  return {
    operationalProfileId: profile.id,
    profile: {
      id: profile.id,
      title: profile.title,
      duration: profile.duration,
      variant: profile.variant,
      status: profile.status,
      notes: profile.notes,
      sourceRefs: profile.sourceRefs,
    },
    ...provenance(evidence, asOf),
    itinerary: profile.itinerary.map((day) => {
      const { entries, ...information } = day;
      return {
        operationalProfileId: profile.id,
        information,
        ...provenance([...day.sourceRefs, ...entries.flatMap((entry) => entry.sourceRefs)], asOf),
        entries: entries.map((entry) => ({
          operationalProfileId: profile.id,
          itineraryDayId: day.id,
          information: entry,
          ...provenance(entry.sourceRefs, asOf),
        })),
      };
    }),
    inclusions: selectedInclusions.map((information) => ({
      operationalProfileId: profile.id,
      information,
      ...provenance(information.sourceRefs, asOf),
    })),
    exclusions: selectedExclusions.map((information) => ({
      operationalProfileId: profile.id,
      information,
      ...provenance(information.sourceRefs, asOf),
    })),
    meetingPoints: selectedMeetingPoints.map((information) => ({
      operationalProfileId: profile.id,
      information,
      ...provenance(information.sourceRefs, asOf),
    })),
    departureSchedules: selectedSchedules.map((information) => ({
      operationalProfileId: profile.id,
      information,
      ...provenance(information.sourceRefs, asOf),
    })),
    terms: selectedTerms.map((information) => ({
      operationalProfileId: profile.id,
      information,
      ...provenance(information.sourceRefs, asOf),
    })),
    issues,
  };
}

export type OperationalContentPresentation = ReadonlyView<NonNullable<ReturnType<typeof presentation>>>;

// Exact profile reference only. Product applicability is decided by productPresentation.
// Preserve master order/wording; never merge, sort or invent missing information.
export function selectOperationalContentByProfileId(
  profileId: string,
  asOf: Date = new Date(),
): OperationalContentPresentation | undefined {
  return presentation(profileId, asOf);
}
