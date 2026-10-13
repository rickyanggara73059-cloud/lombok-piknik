import type { SourceDocument } from "../types/source";

// Audited 2026-10-10. Update dates and cover years are not validity periods.
// These historical/reference documents do not authorize Product selling prices.
export const sourceDocuments: SourceDocument[] = [
  { id: "pdf-nemmo", fileName: "NEMMO OT 2D1N PRIVATE_260714_141837.pdf", status: "needs_confirmation" },
  { id: "pdf-new-pandawa", fileName: "NEW PANDAWA OT 3D2N PRIVATE 2026.pdf", status: "needs_confirmation" },
  { id: "pdf-nusantara-karya", fileName: "Nusantara Karya by Mmb Komodo Tour Phinisi Labuan Bajo.pdf", status: "needs_confirmation" },
  { id: "pdf-3-island", fileName: "OPEN TRIP 3-ISLAND [ 3D2N ]_260606_150640.pdf", version: "2026 (cover)", status: "needs_confirmation" },
  { id: "pdf-arora", fileName: "OPEN TRIP ARORA [ 2D1N ]_260525_173317.pdf", version: "2026 (cover)", status: "needs_confirmation" },
  { id: "pdf-sailing-komodo", fileName: "OPENTRIP - Sailing Komodo (update 17 August 2016_260831_172542.pdf", publisher: "SUAVE BOATS", version: "UPDATE August, 2026 (page 1)", status: "needs_confirmation" },
  { id: "pdf-lombok-labuanbajo", fileName: "Opentrip 4D3N - Lombok to Labuanbajojpg_260424_210607.pdf", publisher: "SUAVE BOATS", version: "UPDATE April 1, 2026 (page 1)", status: "needs_confirmation" },
  { id: "pdf-labuanbajo-lombok", fileName: "Opentrip 4D4N - Labuanbajo to Lombok_260419_125935.pdf", version: "UPDATE April 1, 2026 (page 1)", status: "needs_confirmation" },
  { id: "pdf-king-cirox-2", fileName: "OT King Cirox 2 3H2M 2026 (Jan).pdf", validity: { validFrom: "2026-01-01", validUntil: "2026-07-31", notes: "Page 1: Valid January - July 2026; calendar-month bounds." }, status: "expired" },
  { id: "pdf-princes-nabila", fileName: "OT Nabila 3H2M 2026 (Jan).pdf", validity: { validFrom: "2026-01-01", validUntil: "2026-07-31", notes: "Page 1: Valid January - July 2026; calendar-month bounds." }, status: "expired" },
  { id: "pdf-princes-lala", fileName: "OT Princes Lala 2H1M 2026 baru.pdf", validity: { validFrom: "2026-01-01", validUntil: "2026-07-31", notes: "Page 1: Valid Jan - July 2026; calendar-month bounds." }, status: "expired" },
  { id: "pdf-anja", fileName: "Updaate 2026-1.pdf", status: "needs_confirmation" },
];
