import { boats, cabins, facilities, operators } from "../data/boats";
import { sourceDocuments } from "../data/sources";
import type { Boat, Cabin, Facility } from "../types/boat";
import type { SourceReference } from "../types/source";
import { getSourceVerificationStatus } from "./sourceVerification";

type ReadonlyView<T> = T extends object
  ? { readonly [K in keyof T]: ReadonlyView<T[K]> }
  : T;

function required<T extends { id: string }>(items: readonly T[], id: string): T {
  const item = items.find((entry) => entry.id === id);
  if (!item) throw new Error(`Missing catalog reference: ${id}`);
  return item;
}

function provenance(refs: SourceReference[], asOf: Date) {
  return {
    referenceOnly: true as const,
    currentUseAllowed: false as const,
    sourceStatus: getSourceVerificationStatus(refs, asOf),
    sourceDocuments: [...new Set(refs.map((ref) => ref.documentId))]
      .map((id) => required(sourceDocuments, id)),
    // Keep source wording; a note is not automatically a resolved/conflicting claim.
    sourceNotes: [...new Map(refs.filter((ref) => ref.notes).map((ref) =>
      [JSON.stringify(ref), { sourceRef: ref, note: ref.notes }],
    )).values()],
  };
}

function facilityView(facility: Facility, asOf: Date) {
  const { photoIds, ...information } = facility;
  void photoIds;
  return { information, ...provenance(facility.sourceRefs, asOf) };
}

function cabinView(cabin: Cabin, asOf: Date) {
  const { photoIds, facilities: cabinFacilities, operatorRates, ...information } = cabin;
  void photoIds;
  return {
    information,
    ...provenance(cabin.sourceRefs, asOf),
    facilities: (cabinFacilities ?? []).map((facility) =>
      facilityView(required(facilities, facility.id), asOf),
    ),
    operatorRates: (operatorRates ?? []).map((rate) => ({
      information: rate,
      ...provenance(rate.sourceRefs, asOf),
      sellingPrice: false as const,
    })),
  };
}

function children(boat: Boat, asOf: Date) {
  return (boat.cabinIds ?? []).map((id) => {
    const cabin = required(cabins, id);
    if (cabin.boatId !== boat.id) throw new Error("Catalog cabin/boat scope mismatch");
    return cabinView(cabin, asOf);
  });
}

function boatView(boat: Boat, asOf: Date) {
  const { photoIds, ...information } = boat;
  void photoIds;
  const operator = boat.operatorId ? required(operators, boat.operatorId) : undefined;
  return {
    information,
    ...provenance([
      ...boat.sourceRefs,
      ...(boat.specifications ?? []).flatMap((specification) => specification.sourceRefs),
    ], asOf),
    operator: operator ? { information: operator, ...provenance(operator.sourceRefs, asOf) } : undefined,
    facilities: (boat.facilityIds ?? []).map((id) => facilityView(required(facilities, id), asOf)),
    cabins: children(boat, asOf),
  };
}

export type BoatCatalogEntry = ReadonlyView<ReturnType<typeof boatView>>;
export type CabinCatalogEntry = ReadonlyView<ReturnType<typeof cabinView>>;

// Independent reference catalogue: no Product assignment, availability or photos.
export function selectBoatCatalog(asOf: Date = new Date()): readonly BoatCatalogEntry[] {
  return boats.map((boat) => boatView(boat, asOf));
}

export function selectBoatById(
  boatId: string,
  asOf: Date = new Date(),
): BoatCatalogEntry | undefined {
  const boat = boats.find((entry) => entry.id === boatId);
  return boat ? boatView(boat, asOf) : undefined;
}

export function selectCabinsByBoatId(
  boatId: string,
  asOf: Date = new Date(),
): readonly CabinCatalogEntry[] {
  const boat = boats.find((entry) => entry.id === boatId);
  return boat ? children(boat, asOf) : [];
}
