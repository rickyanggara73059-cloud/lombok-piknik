import type { Service } from "../types/service";

export const services: Service[] = [
  // DUMMY / PLACEHOLDER: all information and prices below must be replaced
  // with verified service data before production.
  {
    id: "lombok-senaru-transport",
    title: "Lombok Senaru Transport",
    category: "Private Transport & Airport Transfer",
    description:
      "Private transportation service for airport transfers, Senaru, Mataram, Kuta Lombok, and Rinjani trekking transfers.",
    icon: "car",
    services: [
      "Lombok Airport → Senaru",
      "Senaru → Lombok Airport",
      "Mataram → Senaru",
      "Senaru → Kuta Lombok",
      "Private Vehicle",
      "Rinjani Trekking Transfer",
    ],
    // Dummy amount only. Price unit, vehicle type, and capacity are unknown.
    startingPriceIdr: 350000,
    isPlaceholder: true,
  },
  // Legacy service descriptions are also pending verification for production.
  {
    id: "airport-transfer",
    title: "Airport Transfer",
    description:
      "Comfortable airport pickup and drop service in Lombok.",
    icon: "car",
    isPlaceholder: true,
  },

  {
    id: "private-tour",
    title: "Private Tour",
    description:
      "Flexible private tour with experienced local guide.",
    icon: "map",
    isPlaceholder: true,
  },

  {
    id: "hotel-booking",
    title: "Hotel Booking",
    description:
      "Find the best accommodation in Lombok.",
    icon: "hotel",
    isPlaceholder: true,
  }
];