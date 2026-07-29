import { SITE } from "./site";

export const travelAgencySchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",

  name: SITE.name,
  url: SITE.website,
  description: SITE.description,
  image: "/images/og-image.jpg",
  logo: SITE.logo,
  telephone: SITE.phone,
  email: SITE.email,

  address: {
    "@type": "PostalAddress",
    addressLocality: "Lombok",
    addressRegion: "West Nusa Tenggara",
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