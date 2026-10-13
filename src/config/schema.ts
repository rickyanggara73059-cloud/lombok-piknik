import { SITE } from "./site";

export const travelAgencySchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",

  name: SITE.name,
  url: SITE.website,
  description: SITE.description,
  email: SITE.email,

  address: {
    "@type": "PostalAddress",
    addressLocality: "Senaru",
    addressRegion: "Lombok Utara",
    addressCountry: "ID",
  },

  areaServed: {
    "@type": "Place",
    name: "Lombok",
  },

  sameAs: [
    // isi nanti
  ]
};
