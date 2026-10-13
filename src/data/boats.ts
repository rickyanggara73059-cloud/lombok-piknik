import type { Boat, Cabin, CabinOperatorRate, Facility, Operator } from "../types/boat";
import type { SourceReference } from "../types/source";
import { sourceDocuments } from "./sources";

// Isolated PDF reference master. No Product import, booking logic or UI consumer.
// All rates require confirmation or are historical; none is a selling price.
function ref(documentId: string, pages: number[], notes?: string): SourceReference {
  const document = sourceDocuments.find((item) => item.id === documentId);
  if (!document) throw new Error(`Unknown PDF source: ${documentId}`);
  return { documentId, pages, status: document.status, ...(document.validity ? { validity: document.validity } : {}), ...(notes ? { notes } : {}) };
}

export const operators: Operator[] = [
  { id: "suave-boats", name: "SUAVE BOATS", sourceRefs: [
    ref("pdf-sailing-komodo", [1], "Named in fuel supplement policy. Commercial trip organiser; vessel ownership/management is not established."),
    ref("pdf-lombok-labuanbajo", [4], "Named in fuel supplement policy. Do not infer the physical operator of every advertised vessel."),
  ] },
];

export const boats: Boat[] = [];
export const cabins: Cabin[] = [];
export const facilities: Facility[] = [];

const key = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Facility IDs are scoped to a boat: evidence is never transferred to another boat.
function facility(boatId: string, name: string, refs: SourceReference[]): Facility {
  const id = `${boatId}-${key(name)}`;
  const existing = facilities.find((item) => item.id === id);
  if (existing) {
    for (const evidence of refs) {
      if (!existing.sourceRefs.some((item) => JSON.stringify(item) === JSON.stringify(evidence))) existing.sourceRefs.push(evidence);
    }
    return existing;
  }
  const item: Facility = { id, name, sourceRefs: [...refs], status: refs.every((item) => item.status === "expired") ? "expired" : "needs_confirmation", photoIds: [] };
  facilities.push(item);
  return item;
}

function boat(id: string, name: string, refs: SourceReference[], specs: Record<string, string>, facilityNames: string[], capacity?: number | [number, number], crew?: number): Boat {
  const item: Boat = { id, name, sourceRefs: refs, status: refs.every((item) => item.status === "expired") ? "expired" : "needs_confirmation", cabinIds: [], photoIds: [],
    specifications: Object.entries(specs).map(([name, value]) => ({ name, value, sourceRefs: refs })),
    facilityIds: facilityNames.map((name) => facility(id, name, refs).id),
    ...(typeof capacity === "number" ? { capacity } : capacity ? { capacityRange: { min: capacity[0], max: capacity[1] } } : {}),
    ...(crew === undefined ? {} : { crew }),
  };
  boats.push(item);
  return item;
}

interface CabinInput {
  name: string;
  type?: string;
  deck?: string;
  capacity?: number | [number, number];
  minimum?: number;
  facilities: string[];
  refs: SourceReference[];
  rate?: { price: number; extraBed?: number; extraPerson?: number; refs: SourceReference[] };
}

function cabin(parent: Boat, suffix: string, input: CabinInput): void {
  const id = `${parent.id}-${suffix}`;
  const rates: CabinOperatorRate[] = input.rate ? [{
    id: `${id}-source-rate`, priceIdr: input.rate.price, currency: "IDR", priceBasis: "per_person",
    // PDF source tariff; direct operator/net-rate basis is not established.
    rateKind: "unknown", status: input.rate.refs.every((item) => item.status === "expired") ? "expired" : "needs_confirmation", sourceRefs: input.rate.refs,
    ...(input.rate.refs[0].validity ? { validity: input.rate.refs[0].validity } : {}),
    ...(input.rate.extraBed === undefined ? {} : { extraBedPriceIdr: input.rate.extraBed }),
    ...(input.rate.extraPerson === undefined ? {} : { extraPersonPriceIdr: input.rate.extraPerson }),
  }] : [];
  cabins.push({ id, boatId: parent.id, name: input.name, ...(input.type ? { type: input.type } : {}), ...(input.deck ? { deck: input.deck } : {}),
    ...(typeof input.capacity === "number" ? { capacity: input.capacity } : input.capacity ? { capacityRange: { min: input.capacity[0], max: input.capacity[1] } } : {}),
    ...(input.minimum === undefined ? {} : { minimumBooking: { quantity: input.minimum, unit: "person" } }),
    facilities: input.facilities.map((name) => facility(parent.id, name, input.refs)), operatorRates: rates, photoIds: [], sourceRefs: input.refs, status: parent.status,
  });
  parent.cabinIds!.push(id);
}

const comfort = ["Air Conditioner", "Towel", "Charging Spot"];

const nemmo = boat("nemmo", "NEMMO", [ref("pdf-nemmo", [1, 2], "No validity or named operator stated.")],
  { Width: "4,24 M", Length: "20 M", "Main engine": "Mitsubishi 6D15", Cabin: "4 Cabin", Safety: "Life Jacket & Life Raft" }, ["Life Jacket", "Life Raft"], 10, 5);
[
  { name: "Master Room", deck: "Upper Deck", capacity: 2, price: 4000000, page: 3, minimum: 2, bed: "Double Bed" },
  { name: "Private Room I", deck: "Main Deck", capacity: 2, price: 3750000, page: 4, minimum: 2, bed: "Double Bed" },
  { name: "Private Room II", deck: "Main Deck", capacity: 2, price: 3750000, page: 5, minimum: 2, bed: "Double Bed" },
  { name: "Sharing Room", deck: "Main Deck", capacity: 4, price: 3000000, page: 6, minimum: 1, bed: "Double Bunk Bed" },
].forEach((item, index) => cabin(nemmo, `cabin-${index + 1}`, { ...item, refs: [ref("pdf-nemmo", [item.page, 8])], facilities: [...comfort, item.bed, "Private Bathroom"], rate: { price: item.price, refs: [ref("pdf-nemmo", [8], "Open Trip 2D1N; price explicitly /Person. Not a Product rate.")] } }));

const pandawa = boat("new-pandawa", "NEW PANDAWA", [ref("pdf-new-pandawa", [1, 2], "No validity. Page 2 calls cabins 3/4 Double Bed; pages 5/6 describe Double Bunk Bed / 3 Double Bed. Preserve both descriptions; confirm configuration.")],
  { Width: "3.8 M", Length: "19.2 M", "Main engine": "Mitsubishi 6D15", Cabin: "4 Cabin", "Water Supply": "4 Ton", Power: "10KW", Safety: "Life Jacket & Life Raft" }, ["Life Jacket", "Life Raft"], 15, 6);
[
  { name: "Master Room", deck: "Upper Deck", capacity: [2, 3] as [number, number], price: 5250000, extra: 2750000, page: 3, minimum: 2, bed: "Double Bed + Additional Bed", bathroom: "Private Bathroom" },
  { name: "Suite Room", deck: "Main Deck", capacity: 2, price: 4750000, page: 4, minimum: 2, bed: "Double Bed", bathroom: "Private Bathroom" },
  { name: "Family Room", deck: "Main Deck", capacity: [2, 4] as [number, number], price: 4250000, extra: 2750000, page: 5, minimum: 2, bed: "Double Bunk Bed", bathroom: "Private Bathroom" },
  { name: "Sharing Room", deck: "Main Deck", capacity: 6, price: 3750000, page: 6, minimum: 1, bed: "3 Double Bed", bathroom: "Sharing Bathroom" },
].forEach((item, index) => cabin(pandawa, `cabin-${index + 1}`, { ...item, refs: [ref("pdf-new-pandawa", [item.page, 8], index >= 2 ? (index === 2 ? "Page 2: Double Bed. Page 5: Double Bunk Bed. Bedding omitted pending confirmation." : "Page 2: Double Bed. Page 6: 3 Double Bed. Bedding omitted pending confirmation.") : undefined)], facilities: [...comfort, ...(index >= 2 ? [] : [item.bed]), item.bathroom], rate: { price: item.price, extraPerson: item.extra, refs: [ref("pdf-new-pandawa", [8], "Open Trip 3D2N; /Person. Add Person is retained separately from Extra Bed.")] } }));

const island = boat("3-island", "3 ISLAND LIVEABOARD", [ref("pdf-3-island", [1, 3])],
  { Length: "22m", Width: "6m", Engine: "Mitsubishi 6D15", "Cruise Speed": "7 - 8 Knot", Dinghy: "5m (Yamaha 15hp)", "Water Supply": "4000L", "Life Vest": "25 Set", Ringbouy: "2" },
  ["Rooms with AC", "TV & Karaoke Set", "Dining Area", "Kitchen", "Sundeck & Bean Bags", "Dispenser", "Canoe", "Life Vest", "Liferaft", "Ringbouy", "AIS", "Garmin GPS", "Compass", "Radio Communication", "Fire Extinguisher", "First Aid Kit"], 14);
for (let number = 1; number <= 4; number++) cabin(island, `private-${number}`, { name: `Private Cabin - ${number}`, type: "Private", capacity: number <= 2 ? [2, 3] : 2, facilities: ["Double Bed", ...(number <= 2 ? ["Extra Bed"] : []), "AC", "Ocean View", "Private Bathroom", "Shower (Cold)", "Wifi"], refs: [ref("pdf-3-island", [3, number + 4])], rate: { price: 4450000, ...(number <= 2 ? { extraBed: 3000000 } : {}), refs: [ref("pdf-3-island", [number + 4], "Open Trip 3D2N; IDR /pax.")] } });
cabin(island, "shared", { name: "Shared Cabin", type: "Shared", capacity: 4, facilities: ["Single Bed (4 person)", "AC", "Ocean View", "Private Bathroom", "Shower (Cold)", "Wifi"], refs: [ref("pdf-3-island", [3, 9])], rate: { price: 3450000, refs: [ref("pdf-3-island", [9], "Open Trip 3D2N; IDR /pax.")] } });

const arora = boat("arora", "ARORA CRUISE", [ref("pdf-arora", [1, 3])],
  { Length: "30m", Width: "5,4m", Engine: "Mitsubishi 6D16", "Cruise Speed": "15 Knot", "Power Generator": "Mitsubishi 4 cylinder", Dinghy: "5m (Yamaha 15hp)", "Water Supply": "5000L", "Life Vest": "30 Set", Ringbouy: "2" },
  ["Rooms with AC", "TV & Karaoke Set", "Dining Area", "Kitchen", "Sundeck & Bean Bags", "Dispenser", "Paddle Board", "Life Vest", "Liferaft", "Ringbouy", "AIS", "Garmin GPS", "Compass", "Radio Communication", "Fire Extinguisher", "First Aid Kit"], [15, 16]);
[
  { name: "Master Cabin", suffix: "master", page: 5, capacity: [2, 3] as [number, number], price: 4950000, extra: 2750000, balcony: true },
  { name: "Deluxe Cabin - 1", suffix: "deluxe-1", page: 6, capacity: 2, price: 4450000, balcony: true },
  { name: "Deluxe Cabin - 2", suffix: "deluxe-2", page: 6, capacity: 2, price: 4450000, balcony: true },
  { name: "Superior Cabin - 1", suffix: "superior-1", page: 7, capacity: 2, price: 3950000, balcony: false },
  { name: "Superior Cabin - 2", suffix: "superior-2", page: 7, capacity: 2, price: 3950000, balcony: false },
  { name: "Shared Cabin", suffix: "shared", page: 8, capacity: 4, price: 3350000, balcony: true },
].forEach((item) => cabin(arora, item.suffix, { ...item, refs: [ref("pdf-arora", [3, item.page])], facilities: ["Double Bed", "AC", "Ocean View", "Private Bathroom", "Shower (Cold)", "Wifi", ...(item.balcony ? ["Balcony"] : []), ...(item.extra ? ["Extra Bed"] : [])], rate: { price: item.price, extraBed: item.extra, refs: [ref("pdf-arora", [item.page], "Open Trip 2D1N; IDR /pax. Deluxe/Superior category applies to the two rooms explicitly listed on page 3.")] } }));

const historicFacilities = ["Tender Boat", "First Aid Kit", "Life Jacket", "Life Buoy", "Starlink Internet Wifi", "Dining Room", "Chef on Board", "Snorkling Gear", "Lazy Chair / Bean Bag", "Automatic Identification System", "Liferaft"];
const king = boat("king-cirox-2", "KING CIROX 2", [ref("pdf-king-cirox-2", [1, 2, 3])],
  { "Panjang Seluruh": "24.80 M", PBU: "22.20 M", "Lebar Dek": "3.20 M", Dalam: "1.90 M", "Fresh Water Tank Capacity": "4 Ton", "Fuel Oil Tank Capacity": "1 Ton", "Main Engine": "Mitsubishi 90 PK + 190 PK", Build: "2024", Finish: "2025" }, [...historicFacilities, "Kano / Kayak"], 23, 6);
[
  { name: "Cabin 1: Master Balcony - Malang Cabin", page: 4, capacity: [2, 4] as [number, number], minimum: 2, price: 4750000, extra: 3500000, bathroom: "Private Bathroom", balcony: true },
  { name: "Cabin 2: Private Cabin - Surabaya Cabin", page: 5, capacity: [2, 3] as [number, number], minimum: 2, price: 3900000, extra: 3000000, bathroom: "Private Bathroom" },
  { name: "Cabin 3: Share Cabin Share Bathroom - Gresik Cabin", page: 6, capacity: 4, price: 2750000, bathroom: "Share Bathroom" },
  { name: "Cabin 4: Private Cabin - Kediri Cabin", page: 7, capacity: [2, 4] as [number, number], minimum: 2, price: 3900000, extra: 3000000, bathroom: "Private Bathroom" },
  { name: "Cabin 5: Private Cabin - Jember Cabin", page: 8, capacity: [2, 3] as [number, number], minimum: 2, price: 3900000, extra: 3000000, bathroom: "Private Bathroom" },
  { name: "Cabin 6: Master Balcony - Madiun Cabin", page: 9, capacity: [2, 4] as [number, number], minimum: 2, price: 4950000, extra: 3500000, bathroom: "Private Bathroom", balcony: true, bath: true },
].forEach((item, index) => cabin(king, `cabin-${index + 1}`, { ...item, refs: [ref("pdf-king-cirox-2", [item.page])], facilities: ["Air Conditioner", "Sea View Window", "Plugs", "Towel", "Linen", item.bathroom, index === 2 ? "Single Bunk Bed" : "Double Size + Extra Bed", ...(item.balcony ? ["Private Balcony"] : []), ...(item.bath ? ["Bathtub"] : [])], rate: { price: item.price, extraBed: item.extra, refs: [ref("pdf-king-cirox-2", [1, item.page], "Historical 3D2N rate; Jan-Jul 2026, expired.")] } }));

const nabila = boat("princes-nabila", "PRINCES NABILA", [ref("pdf-princes-nabila", [1, 2, 3])],
  { "Overall Length": "33.00M", "Main Deck Length": "16.60M", "Midship Width (B)": "5.25M", "Midship Height (H)": "2.50M", "Ship's Draft (T)": "2.25M", "Fresh Water Tank Capacity": "6 Ton", "Fuel Oil Tank Capacity": "1 Ton", "Main Engine": "240HP", "Auxiliary Engine": "190HP", Build: "2024", Finish: "2025" }, [...historicFacilities, "Kano / Kayak", "Padle Board"], 25, 8);
[
  { name: "Cabin 1: Sumbawa Cabin - Master Cabin Sea View", price: 5500000, extra: 4000000, capacity: [2, 4] as [number, number], minimum: 2, balcony: true, bath: true },
  { name: "Cabin 2: Flores Cabin - Private Suite Balcony", price: 5150000, extra: 3500000, capacity: [2, 3] as [number, number], balcony: true },
  { name: "Cabin 3: Sulawesi Cabin - Private Sea View", price: 4850000, extra: 3500000, capacity: [2, 4] as [number, number], minimum: 2 },
  { name: "Cabin 4: Bali Cabin - Private Sea View", price: 4850000, extra: 3500000, capacity: [2, 4] as [number, number], minimum: 2 },
  { name: "Cabin 5: Papua Cabin - Private Sea View", price: 4850000, extra: 3500000, capacity: [2, 4] as [number, number], minimum: 2 },
  { name: "Cabin 6: Maluku Cabin - Private Sea View", price: 4850000, extra: 3500000, capacity: [2, 4] as [number, number], minimum: 2 },
  { name: "Cabin 7: Jawa Cabin - Master Kabin With Bathup", price: 5500000, extra: 4000000, capacity: [2, 4] as [number, number], minimum: 2, balcony: true, bath: true },
].forEach((item, index) => cabin(nabila, `cabin-${index + 1}`, { ...item, refs: [ref("pdf-princes-nabila", [index + 4])], facilities: ["Air Conditioner", "Double Size + Single Bed", "Sea View Window", "Plugs", "Towel", "Linen", "Private Bathroom", ...(item.balcony ? ["Private Balcony"] : []), ...(item.bath ? ["Bathtub"] : [])], rate: { price: item.price, extraBed: item.extra, refs: [ref("pdf-princes-nabila", [1, index + 4], "Historical 3D2N rate; Jan-Jul 2026, expired.")] } }));

const lala = boat("princes-lala", "PRINCES LALA", [ref("pdf-princes-lala", [1, 2], "Page 2 says 5 Bathroom (5 Private, 1 Share), an inconsistent total. Keep the original claim pending confirmation.")],
  { Cabin: "6 Comfort Cabin", Bathroom: "5 Bathroom (5 Private, 1 Share)" }, [...historicFacilities.filter((name) => name !== "Kano / Kayak"), "Padle Board"], 18);
[
  { name: "Cabin 1: Master Cabin", price: 3900000, extra: 2650000, capacity: [2, 3] as [number, number], minimum: 2, balcony: true, bathroom: "Private Bathroom" },
  { name: "Cabin 2: Private Cabin", price: 2900000, extra: 2000000, capacity: [2, 3] as [number, number], minimum: 2, bathroom: "Private Bathroom" },
  { name: "Cabin 3: Private Cabin", price: 2450000, extra: 2000000, capacity: [2, 3] as [number, number], minimum: 2, bathroom: "Share Bathroom" },
  { name: "Cabin 4: Private Cabin", price: 2900000, extra: 2000000, capacity: [2, 3] as [number, number], minimum: 2, bathroom: "Private Bathroom" },
  { name: "Cabin 5: Private Cabin", price: 2900000, extra: 2000000, capacity: [2, 3] as [number, number], minimum: 2, bathroom: "Private Bathroom" },
  { name: "Cabin 6: Master Cabin", price: 3800000, capacity: 2, balcony: true, bathroom: "Private Bathroom" },
].forEach((item, index) => cabin(lala, `cabin-${index + 1}`, { ...item, refs: [ref("pdf-princes-lala", [index + 3])], facilities: ["Air Conditioner", "Double Size + Single Bed", "Sea View Window", "Plugs", "Towel", "Linen", item.bathroom, ...(item.balcony ? ["Private Balcony"] : [])], rate: { price: item.price, extraPerson: item.extra, refs: [ref("pdf-princes-lala", [1, index + 3], "Historical 2D1N /Pax; Extra Person is not labelled Extra Bed; Jan-Jul 2026, expired.")] } }));

lala.status = "needs_confirmation"; // Expired source, plus unresolved bathroom-total conflict.

const anja = boat("anja", "Anja", [ref("pdf-anja", [1, 2], "Anja is explicitly named on pages 3-5. Instagram @asta.nirwana on page 15 is not proof of an operator company.")],
  { Length: "18 meters", Width: "3.2 meters", Cabin: "3 cabins, AC, 2 shared bathrooms", "Main Engine": "Mitsubishi 6D16", Speed: "+/- 7 knots", GT: "29 No. 316/OOm", Water: "2000 liters of fresh water", Electricity: "2 solar panels, inverter, genset 8000w", Built: "2022", Navigation: "2 VHF radio, 2 handy talky, emergency signal, GPS, binoculars, nautical map", "Safety Equipment": "3 fire extinguishers, first aid kit, 4 life buoys, 17 life jackets, tender boat" },
  ["AC", "2 Shared Bathrooms", "Tender Boat", "First Aid Kit", "Life Buoy", "Life Jacket", "Fire Extinguisher"], 8, 5);
for (const item of [
  { name: "Master Cabin", page: 3, fixtures: ["1 queen sized bed (160x200 cm)", "6 electrical socket", "Cozy lighting", "3 drawers under the bed"] },
  { name: "Deluxe Cabin", page: 4, capacity: 2, fixtures: ["1 large double sized bed (130x200 cm)", "4 electrical socket", "Cozy lighting", "3 drawers under the bed"] },
  { name: "Superior Cabin", page: 5, capacity: 4, fixtures: ["2 large double sized bed (130x200 cm)", "2 electrical socket", "Cozy lighting", "4 drawers"] },
]) cabin(anja, key(item.name), { ...item, facilities: ["Air Conditioning", ...item.fixtures], refs: [ref("pdf-anja", [item.page], item.page === 3 ? "Master capacity is not explicitly stated; do not infer from a queen bed. Page 12 contains whole-boat charter rates, not cabin rates." : "No cabin tariff supplied; whole-boat charter rates must not be assigned to a cabin.")] });
for (const name of ["Shower and faucet", "Toilet", "Jet shower", "Water heater", "Wash basin", "Mirror", "Soap & shampoo", "Toilet paper", "Trash bin", "1 electrical socket"]) anja.facilityIds!.push(facility(anja.id, name, [ref("pdf-anja", [6])]).id);
for (const [name, page] of [["Leisure Area (Upper Deck)", 7], ["Leisure Area (Lower Deck)", 8]] as const) anja.facilityIds!.push(facility(anja.id, name, [ref("pdf-anja", [page])]).id);

// Catalogue cabin groups below expand only the individually numbered rooms
// explicitly enumerated in each page's Cabin Information, not inferred counts.
interface CatalogGroup {
  label: string;
  type: string;
  count: number;
  deck: string;
  capacity: number | [number, number];
  minimum: number;
  price: number;
  extraPerson?: number;
  fixtures: string[];
  notes?: string;
  sourceLabel?: string;
  exactSourceName?: string;
  startNumber?: number;
  omitRate?: boolean;
}

function catalogBoat(id: string, name: string, page: number, capacity: number | [number, number], specs: Record<string, string>, names: string[], groups: CatalogGroup[], notes?: string): void {
  const refs = [ref("pdf-sailing-komodo", [page], notes)];
  const item = boat(id, name, refs, specs, names, capacity);
  groups.forEach((group) => {
    for (let number = 1; number <= group.count; number++) cabin(item, `${key(group.label)}-${number}`, {
      name: group.exactSourceName ?? (group.count === 1 ? (group.sourceLabel ?? group.label) : `${group.sourceLabel ?? group.label} ${number + (group.startNumber ?? 1) - 1}`), type: group.type, deck: group.deck, capacity: group.capacity, ...(group.omitRate ? {} : { minimum: group.minimum }),
      facilities: ["Air Conditioning", ...group.fixtures], refs: [ref("pdf-sailing-komodo", [page], group.notes)],
      ...(group.omitRate ? {} : { rate: { price: group.price, extraPerson: group.extraPerson, refs: [ref("pdf-sailing-komodo", [page], "Source catalogue Open Trip 3D2N /Pax; no validity. Add Pax is not assumed to be an Extra Bed price.")] } }),
    });
  });
}

function group(label: string, count: number, deck: string, capacity: number | [number, number], price: number, fixtures: string[], extraPerson?: number, minimum = 2, type = label): CatalogGroup {
  return { label, type, count, deck, capacity, minimum, price, fixtures, ...(extraPerson === undefined ? {} : { extraPerson }) };
}

const share = ["4x Single Bunkbed", "Share Bathroom"];
const queenPrivate = ["Queen Bed", "Private Bathroom"];
const queenExtra = ["Queen Bed + Extra Bed", "Private Bathroom"];
const queenBalcony = [...queenExtra, "Private Balcony"];
const safety = "Liferaft, Life Jacket, Ring Bouy, Fire extinguisher, First Aid Kit";
const nav = "AIS, Radar, Compass, Gps, Map.";
const radio = "SBB Radio,Vhf Radio";
const speedboat = "6 meter Fiberglass with Engine Yamaha 15 HP";
// Shared strings reproduce identical printed specification values, not defaults.
const superiorFacilities = ["Comfort cabin with AC", "Lazy Chair", "Bean Bag", "Sun Deck", "Life Jacket", "Snorkeling Gear", "Dispenser"];
const deluxeFacilities = ["Comfort cabin with AC", "Large Outdoor area", "Bean Bag", "Life Jacket", "Snorkeling gear", "Bluetooth Sound System", "Refrigerator", "Dispenser", "Lazy Chair", "Jacuzzi"];
const luxuryFacilities = ["AC cabin", "Comfortable restorant area", "Front sun deck area", "Top sun deck area", "Sun chair, Bean Bag", "Hot & cold water", "Snorkeling Equipment", "Karaoke set", "Bar", "Bluetooth Sound System", "Fridge", "Dispenser"];

catalogBoat("lamborajo-1", "LAMBORAJO 1", 3, [22, 24], { Length: "26 Meters", Beam: "5 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "8000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Mitsubishi 6D16", Generator: "ps120-30kVA, ps120-22kVA", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, [...superiorFacilities, "Karaoke Set"], [
  group("Share", 3, "Main Deck", 4, 3000000, share, undefined, 1, "Share Cabin"),
  group("Full", 1, "Main Deck", [2, 4], 3550000, ["Queen Bed + 2x Single BunkBed", "Share Bathroom"], 2750000, 2, "Full Ocean"),
  group("Master", 2, "Upper Deck", [2, 4], 4550000, ["Queen Bed + 2x Extra Single Bed", "Private Bathroom"], 2750000, 2, "Master Ocean"),
]);
catalogBoat("pesona-bajo", "PESONA BAJO", 4, 15, { Length: "23 Meters", Beam: "4 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "5000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Yanmar 6 Cylinder TY 160", Generator: "30KVA, Emergency 7500watt", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, [...superiorFacilities, "Karaoke Set", "Show Case Fridge"], [
  group("Share", 1, "Main Deck", 4, 3000000, share, undefined, 1, "Share Cabin"),
  group("Double", 1, "Main Deck", 2, 3550000, ["Queen Bed", "Share Bathroom"], undefined, 2, "Private Double"),
  group("Triple", 1, "Main Deck", [2, 3], 3550000, ["Queen Bed + Single Bunkbed", "Share Bathroom"], 2750000, 2, "Private Triple"),
  group("Deluxe", 2, "Main Deck", 2, 4050000, queenPrivate, undefined, 2, "Deluxe Ocean"),
  { ...group("Master", 1, "Upper Deck", [2, 3], 4450000, queenExtra, undefined, 2, "Master Ocean"), notes: "Cabin Information says 2-3 Pax with Extra Bed; price card says 2 Pax and does not supply Add Pax price. Both claims retained; confirm capacity/rate applicability." },
], "Master capacity differs between Cabin Information (2-3) and price card (2); no Add Pax tariff supplied.");
catalogBoat("almadira", "ALMADIRA", 5, [17, 18], { Length: "26 Meters", Beam: "4.6 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "6000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Mitsubishi 6D16", Generator: "30KVA, Emergency 7500watt", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, [...superiorFacilities.filter((name) => name !== "Bean Bag"), "Show Case Fridge", "Bluetooth Speaker"], [
  group("Share 1", 1, "Lower Deck", 5, 3000000, ["2x Queen Bed + Single Bed", "Share Bathroom"], undefined, 1, "Share Cabin"),
  { ...group("Share 2", 1, "Lower Deck", [2, 3], 3550000, ["Queen Bed + Single Bed", "Share Bathroom"], 2750000, 2, "Share"), omitRate: true, notes: "Cabin Information labels this room Share 2, not Private Cabin. No rate assigned because mapping to the price categories is unproven; confirm with source." },
  group("Private", 1, "Lower Deck", [2, 3], 3550000, ["Queen Bed + Single Bunk Bed", "Share Bathroom"], 2750000, 2, "Private Cabin"),
  group("Master", 1, "Main Deck", [2, 3], 4450000, queenExtra, 2750000, 2, "Master Ocean"),
  group("Deluxe", 2, "Upper Deck", 2, 4050000, queenPrivate, undefined, 2, "Deluxe Ocean"),
]);
catalogBoat("balaraja", "BALARAJA", 6, [20, 22], { Length: "33 Meters", Beam: "5.8 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "5000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Mitsubishi 6D16", Generator: "30KVA, Emergency 7500watt", Navigations: nav, Radio: radio, Safety: safety, Speedboat: "Fiberglass with Engine Yamaha 40 HP" }, superiorFacilities, [group("Share", 4, "Main Deck", 4, 3000000, share, undefined, 1, "Share Cabin"), group("Master", 2, "Upper Deck", [2, 3], 4550000, queenExtra, 2750000, 2, "Master Ocean")]);
catalogBoat("flores-utama-indah", "FLORES UTAMA INDAH", 7, [22, 24], { Length: "25,76 Meters", Beam: "5.27 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "5000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Mitsubishi 6D16", Generator: "30KVA, Emergency 7500watt", Navigations: nav, Radio: radio, Safety: safety, Speedboat: "Fiberglass with Engine Yamaha 15 HP" }, superiorFacilities.filter((name) => name !== "Lazy Chair"), [group("Share", 4, "Main Deck", 4, 3000000, share, undefined, 1, "Share Cabin"), group("Master", 2, "Upper Deck", [2, 3], 4550000, queenExtra, 2750000, 2, "Master Ocean"), group("Royal", 1, "Upper Deck", [2, 3], 5050000, queenBalcony, 2750000, 2, "Royal Master")]);
catalogBoat("yukai", "YUKAI", 9, 12, { Length: "22 Meters", Beam: "4,2 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "5000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Mitsubishi 6D16", Generator: "30KVA, Emergency 7500watt", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, [...deluxeFacilities.filter((name) => name !== "Lazy Chair"), "TV", "Karaoke Set", "Hot Shower"], [group("Signature", 2, "Main Deck", 2, 4950000, queenPrivate, undefined, 2, "Signature Ocean"), { ...group("Deluxe Main", 2, "Main Deck", 2, 4650000, queenPrivate, undefined, 2, "Deluxe Cabin"), sourceLabel: "Deluxe", startNumber: 1 }, { ...group("Deluxe Upper", 2, "Upper Deck", 2, 4650000, queenPrivate, undefined, 2, "Deluxe Cabin"), sourceLabel: "Deluxe", startNumber: 3 }]);
catalogBoat("nk-jaya-1", "NK JAYA 1", 10, 14, { Length: "22 Meters", Beam: "4,5 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "6000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Mitsubishi 6D16", Generator: "2 Generator & Genset 8kvA", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, deluxeFacilities.filter((name) => name !== "Lazy Chair"), [group("Superior", 3, "Lower Deck", 2, 4350000, queenPrivate, undefined, 2, "Superior Cabin"), group("Full", 4, "Main Deck", 2, 5350000, queenPrivate, undefined, 2, "Full Ocean")]);
catalogBoat("nk-jaya-2", "NK JAYA 2", 11, [12, 13], { Length: "21 Meters", Beam: "5 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "8000 Litres", "Fuel Capacity": "5000 Litres", Engine: "Mitsubishi 8D C9 Cylinder", Generator: "30KVA, Emergency 7500watt", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, [...deluxeFacilities, "Indoor Dining Room"], [group("Superior", 3, "Lower Deck", 2, 4350000, queenPrivate, undefined, 2, "Superior Cabin"), group("Full", 2, "Main Deck", 2, 5350000, queenPrivate, undefined, 2, "Full Ocean"), group("Master", 1, "Upper Deck", [2, 3], 6050000, queenExtra, 3850000, 2, "Master Ocean")]);
catalogBoat("alfathran", "ALFATHRAN", 12, [14, 16], { Length: "27 Meters", Beam: "5.5 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "5000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Yanmar 6 Cylinder Ty160", Generator: "30KVA, Emergency 7500watt", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, deluxeFacilities, [group("Family", 1, "Lower Deck", [2, 4], 5000000, ["2x Queen Bed", "Private Bathroom"], 3850000, 2, "Superior family Cabin"), group("Superior", 2, "Lower Deck", 2, 4600000, queenPrivate, undefined, 2, "Superior Cabin"), group("Full", 1, "Main Deck", 2, 5350000, queenPrivate, undefined, 2, "Full Ocean"), group("Deluxe", 1, "Upper Deck", [2, 3], 5750000, queenExtra, 3850000, 2, "Deluxe Ocean"), group("Master", 1, "Upper Deck", [2, 3], 6050000, queenExtra, 3850000, 2, "Master Ocean")], "Not merged with Alfathran 3 in the Lombok route PDFs; similar names are insufficient identity evidence.");
catalogBoat("hatira-hela", "HATIRA HELA", 13, [16, 24], { Length: "32 Meters", Beam: "5.6 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "7000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Mitsubishi 6d 22 Cylinder", Generator: "Double Ps120", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, deluxeFacilities, [group("Deluxe", 6, "Main Deck", [2, 3], 5300000, queenExtra, 3850000, 2, "Deluxe Cabin"), group("Master", 2, "Upper Deck", [2, 3], 5850000, queenExtra, 3850000, 2, "Master Cabin")]);
catalogBoat("nox", "NOX", 14, [16, 20], { Length: "30 Meters", Beam: "6.5 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "13000 Litres", "Fuel Capacity": "8000 Litres", Engine: "Mitsubishi 8D C9 Cylinder", Generator: "PS120-30Kva, PS 120-22Kva", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, [...deluxeFacilities, "Indoor Dining Room"], [group("Superior", 2, "Lower Deck", 2, 4550000, queenPrivate, undefined, 2, "Superior Cabin"), group("Signature", 2, "Main Deck", [2, 3], 5750000, queenBalcony, 3850000, 2, "Signature Ocean"), group("Deluxe", 2, "Upper Deck", 2, 5250000, queenPrivate, undefined, 2, "Deluxe Ocean"), group("Master", 2, "Upper Deck", [2, 3], 6250000, queenBalcony, 3850000, 2, "Master Ocean")], "Header says NOX while hull photograph reads MAHESWARI. Retain published identity and flag alias/registration for confirmation; do not create a second inferred boat.");
catalogBoat("gaisan", "GAISAN", 15, [18, 19], { Length: "30 Meters", Beam: "6.5 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "13000 Litres", "Fuel Capacity": "8000 Litres", Engine: "Mitsubishi 8d c9", Generator: "ps120-30kVA, ps120-22kVA", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, [...deluxeFacilities, "Karaoke Set", "Hot Shower", "Indoor & Outdoor Dining Room"], [group("Superior", 4, "Lower Deck", 2, 4550000, queenPrivate, undefined, 2, "Superior Cabin"), group("Signature", 2, "Main Deck", 2, 5750000, queenPrivate, undefined, 2, "Signature Ocean"), group("Deluxe", 1, "Upper Deck", [2, 3], 5250000, queenExtra, 3850000, 2, "Deluxe Ocean"), group("Master", 2, "Upper Deck", 2, 6250000, [...queenPrivate, "Private Balcony"], undefined, 2, "Master Ocean")]);
catalogBoat("solana", "SOLANA", 16, 30, { Length: "34 Meters", Beam: "6 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "13000 Litres", "Fuel Capacity": "8000 Litres", Engine: "Mitsubishi 8d c9", Generator: "ps120-30kVA, ps120-22kVA", Navigations: nav, Radio: radio, Safety: safety, Speedboat: speedboat }, [...deluxeFacilities.filter((name) => !["Bean Bag", "Lazy Chair", "Bluetooth Sound System", "Jacuzzi"].includes(name)), "Indoor & Outdoor Dining Room"], [group("Manta", 2, "Lower Deck", [2, 4], 4550000, ["Queen Bed + 2x Single Bunk Bed", "Private Bathroom"], 3850000, 2, "Manta Cabin"), group("Komodo", 4, "Main Deck", [2, 3], 5250000, queenExtra, 3850000, 2, "Komodo Cabin"), { ...group("Pink Beach", 2, "Upper Deck", [2, 3], 5750000, queenExtra, 3850000, 2, "Pink Beach Cabin"), exactSourceName: "Pink Beach 1", notes: "Two entries both say Pink Beach 1. Internal sequence IDs distinguish source entries only; physical room numbering requires confirmation." }, group("Padar (VIP)", 1, "Upper Deck", [2, 4], 6500000, ["Queen Bed + 2x Extra Bed", "Private Bathroom", "Private Balcony"], 3850000)], "Boat capacity is printed 30 Pax, but listed room maxima total 30 while minimum configurations differ. Duplicate Pink Beach 1 labels are retained in notes.");
catalogBoat("lamborajo-2", "LAMBORAJO 2", 18, [21, 25], { Length: "30 Meters", Beam: "7,2 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "8000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Mitsubishi 6D 22 Cylinder", Generator: "Double Ps120", Navigations: nav, Radio: radio, Safety: safety, Speedboat: "6 Meter Fiberglass with Engine Yamaha 40 HP" }, [...luxuryFacilities, "Canoe", "Paddle Board", "Jacuzzi", "TV", "Starlink Wifi"], [group("Superior", 5, "Lower Deck", [2, 3], 5200000, ["Queen Bed + Single Bed", "Private Bathroom"], 4700000, 2, "Superior Cabin"), group("Family", 1, "Main Deck", [2, 4], 7200000, ["Queen Bed + 2x Extra Bed", "Private Bathroom"], 4700000, 2, "Family Ocean"), group("Master", 2, "Upper Deck", [2, 3], 7450000, queenBalcony, 4700000, 2, "Royal Master Cabin")]);
catalogBoat("yumana", "YUMANA", 19, [21, 25], { Length: "32 Meters", Beam: "6 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "13000 Litres", "Fuel Capacity": "8000 Litres", Engine: "Mitsubishi 8D C9 Cylinder", Generator: "Double Ps120", Navigations: nav, Radio: radio, Safety: safety, Speedboat: "6 Meter Fiberglass with Engine Yamaha 40 HP" }, [...luxuryFacilities, "TV", "Large Jacuzzi"], [group("Superior", 2, "Lower Deck", [2, 3], 5450000, queenExtra, 4700000, 2, "Superior Cabin"), group("Deluxe", 2, "Main Deck", [2, 3], 6800000, queenExtra, 4700000, 2, "Deluxe Cabin"), { ...group("Signature Main", 1, "Main Deck", [2, 3], 7450000, queenExtra, 4700000, 2, "Signature Cabin"), sourceLabel: "Signature 1" }, { ...group("Signature Upper", 2, "Upper Deck", [2, 3], 7450000, queenExtra, 4700000, 2, "Signature Cabin"), sourceLabel: "Signature", startNumber: 2 }, group("Royal Suite", 1, "Upper Deck", [2, 4], 9700000, ["Queen Bed + 2x Extra Bed", "Private Bathroom", "Private Balcony", "Jacuzzi"], 4700000, 2, "Royal Master Cabin")]);
catalogBoat("lamborajo-3", "LAMBORAJO 3", 20, [21, 25], { Length: "38 Meters", Beam: "6,8 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "13000 Litres", "Fuel Capacity": "8000 Litres", Engine: "Mitsubishi 8D C9 Cylinder", Generator: "Double Ps120", Navigations: nav, Radio: radio, Safety: safety, Speedboat: "6 Meter Fiberglass with Engine Yamaha 40 HP" }, [...luxuryFacilities, "Paddle Board", "Large Jacuzzi", "Starlink wifi"], [group("Superior", 4, "Lower Deck", 2, 5750000, queenPrivate, undefined, 2, "Superior Cabin"), group("Master", 2, "Main Deck", [2, 3], 9700000, [...queenBalcony, "Jacuzzi"], 4700000, 2, "Master Ocean"), group("Royal", 2, "Upper Deck", [2, 4], 10950000, ["Queen Bed + 2x Extra Bed", "Private Bathroom", "Private Balcony", "Jacuzzi"], 4700000, 2, "Royal Master Cabin")], "Printed capacity 21-25 Pax conflicts with enumerated room range total 16-22. Preserve stated boat range and individual cabin ranges; confirm certified guest capacity.");
catalogBoat("ocean-pro", "OCEAN PRO", 21, [20, 26], { Length: "38 Meters", Beam: "9,5 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "25.000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Mitsubishi 6D 22 Cylinder", Generator: "Double Ps120", Navigations: nav, Radio: radio, Safety: safety, Speedboat: "2 Unit Fiberglass with Engine Yamaha 40 HP" }, [...luxuryFacilities, "Canoe", "Paddle Board", "Daily Housekeeping", "TV", "Indoor & Outdoor dining"], [group("Double", 6, "Main Deck", [2, 3], 6850000, queenExtra, 4700000, 2, "Ocean Double"), group("Twin", 4, "Upper Deck", 2, 5850000, ["2x Single Bunk Bed", "Private Bathroom"], undefined, 2, "Ocean Twin")]);
catalogBoat("kanhaloka", "KANHALOKA", 22, [22, 25], { Length: "34 Meters", Beam: "6,5 Meters", "Cruising Speed": "7-10 Knot", "Fresh Water Capacity": "8.000 Litres", "Fuel Capacity": "3000 Litres", Engine: "Mitsubishi 6D 22 Cylinder", Generator: "Double Ps120", Navigations: nav, Radio: radio, Safety: safety, Speedboat: "1 Unit Fiberglass with Engine Yamaha 40 HP" }, [...luxuryFacilities, "Paddle Board", "Indoor dining room"], [group("Share", 1, "Lower Deck", 8, 4500000, ["4x Queen Bed", "Share Bathroom"], undefined, 2, "Share Cabin"), group("Superior", 2, "Lower Deck", 2, 6000000, queenPrivate, undefined, 2, "Superior Cabin"), { ...group("Family", 1, "Main Deck", [2, 4], 6000000, ["Private Bathroom"], 5100000, 4, "Family Ocean"), notes: "Cabin Information says Queen Bag + Extra Bed / 2-4 Pax; card says 2x Queen Bed / 4 Pax and Min 4 Pax. Keep both claims; bedding/capacity and Add Pax applicability require confirmation." }, group("Deluxe", 2, "Upper Deck", [2, 3], 7800000, queenExtra, 5100000, 2, "Deluxe Ocean"), group("Master", 1, "Upper Deck", [2, 3], 8400000, queenExtra, 5100000, 2, "Master Ocean")], "Family room bedding/capacity differs between Cabin Information and price card; no silent resolution.");

const routeRefs = [ref("pdf-lombok-labuanbajo", [5, 6], "Same vessel identity, photos, specification and room chart as reverse-route PDF; no validity stated."), ref("pdf-labuanbajo-lombok", [5, 6], "Same printed master page as forward-route PDF. Page 6 spells the vessel Alfathran 3.")];
const alfathran3 = boat("alfathran-3", "Alfathran 3", routeRefs,
  { Length: "29,30 Meters", Beam: "7 Meters", "Cruising Speed": "7-11 Knot", "Fresh Water Capacity": "9.000 Litres", "Fuel Capacity": "5500 Litres", Engine: "Nissan Diesel", Generator: "30Kva, 40 Kva & Emergency 8000 watt", Navigations: "Compass, Gps, Ais, Map", Radio: "SSB Radio,Vhf Radio, Handy Talky", "Safety Equipment": "Life Raft for 50 person, 30 life jacket, 2 fire extinguisher, first aid, Lifebuoy", Speedboat: "1 unit fiberglass with Engine 1x Yamaha 40 HP", Cabin: "12 cabins; 12 private ensuite bathrooms" },
  ["AC cabin", "Large Sundeck Area", "Sun chair", "Bean Bag", "Snorkeling Equipment", "Bluetooth Sound System", "Indoor Dining room", "Fridge", "Dispenser", "Jacuzzi", "Starlink Wifi"], [44, 50], 9);
const routeGroups = [
  { ...group("Senggigi Room", 2, "Upper Deck", [2, 5], 11500000, ["Queen Bed + 3x Extra Bed", "Private Bathroom", "Private Balcony"], 4000000), numbers: [1, 2] },
  { ...group("Flores Room", 2, "Upper Deck", [2, 3], 9000000, ["Queen Bed + Single Bed", "Private Bathroom"], 4000000), numbers: [3, 4], notes: "Page 6 says Private Bathroom, Balcony; page 5 card does not list Balcony. Presence requires confirmation; both source pages retained." },
  { ...group("Rinjani Room 02", 1, "Main Deck", [2, 4], 10000000, ["Private Bathroom"], 4000000), numbers: [5], notes: "Page 5 assigns cabin 5 Queen Bed + 2x Single Bed; page 6 calls cabin 5 Rinjani Room 02 and says Queen Bed + 2x Extra Single Bed (Main Deck). Confirm bedding; no silent resolution." },
  { ...group("Rinjani Room 01", 1, "Main Deck", [2, 4], 10000000, ["Queen Bed + Queen Bed", "Private Bathroom"], 4000000), numbers: [6] },
  { ...group("Gili Room", 4, "Lower Deck", [2, 4], 6500000, ["Queen Bed + 2x Single Bunk Bed", "Private Bathroom"], 4000000), numbers: [7, 8, 9, 10] },
  { ...group("Sumbawa Room", 2, "Lower Deck", [1, 5], 5250000, ["5x Single Bunk Bed", "Private Bathroom"], undefined, 1), numbers: [11, 12] },
];
for (const item of routeGroups) for (const number of item.numbers) cabin(alfathran3, `cabin-${number}`, {
  ...item, name: `${item.label} (Cabin ${number})`, facilities: ["Air Conditioning", ...item.fixtures], refs: routeRefs.map((evidence) => ({ ...evidence, ...(item.notes ? { notes: item.notes } : {}) })),
  rate: { price: item.price, extraPerson: item.extraPerson, refs: [ref("pdf-lombok-labuanbajo", [5], "Printed source /Pax tariff, no validity. Route applicability (4D3N vs 4D4N) requires confirmation."), ref("pdf-labuanbajo-lombok", [5], "Identical printed source /Pax tariff; not a second rate and not a Product price.")] },
});
