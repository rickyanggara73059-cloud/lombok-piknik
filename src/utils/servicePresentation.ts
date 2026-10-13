import { services } from "../data/services";

type ReadonlyView<T> = T extends object
  ? { readonly [K in keyof T]: ReadonlyView<T[K]> }
  : T;

function presentation(serviceId: string) {
  const service = services.find((record) => record.id === serviceId);
  if (!service) return undefined;
  const { startingPriceIdr, priceUnit, ...information } = service;
  // The existing schema uses isPlaceholder as its verification gate.
  // Missing price basis must never become a default per-person/per-vehicle price.
  const pricing = service.isPlaceholder === false &&
    typeof startingPriceIdr === "number" && Number.isFinite(startingPriceIdr) &&
    startingPriceIdr > 0 && typeof priceUnit === "string" && priceUnit.trim().length > 0
    ? { startingPriceIdr, priceUnit }
    : undefined;
  return {
    information,
    pricing,
    priceUseAllowed: pricing !== undefined,
    currentUseAllowed: service.isPlaceholder === false,
    referenceOnly: service.isPlaceholder !== false,
    reference: {
      referenceOnly: true as const,
      currentUseAllowed: false as const,
      isPlaceholder: service.isPlaceholder,
      startingPriceIdr,
      priceUnit,
    },
  };
}

export type ServicePresentation = ReadonlyView<NonNullable<ReturnType<typeof presentation>>>;

// Independent service reference only; no Product, booking or source inference.
export function selectServiceById(serviceId: string): ServicePresentation | undefined {
  return presentation(serviceId);
}
