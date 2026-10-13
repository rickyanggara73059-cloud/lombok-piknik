# Stage 7E — USD tour display audit

Scope: display-only conversion for all public tour packages. No source tariff, priceIdr, tier amount, payment record, approval status, or image mapping was changed. Existing unrelated working-tree changes were preserved.

## Conversion policy

- Regular tours reuse the existing fixed application convention: IDR 17,000 per USD. One shared constant and converter in formatCurrency.ts; no live lookup.
- USD amounts use US$ with grouped numbers and round to the nearest whole dollar. Unit and total displays are rounded independently. Total displays convert the original computed IDR total, not the rounded USD unit multiplied by guests. This distinction is explained on detail pages and in modal booking messages.
- Speedboats retain US$560 / US$840 / US$1,120 per boat, the existing provisional IDR 17,884/USD metadata dated 12 October 2026, and needs_confirmation status. Fixed per-boat totals never multiply by passengers.
- Legacy IDR description and WhatsApp text remains in source data and is converted at display/message boundaries. No official operator USD tariff is inferred.

## Audited public paths

| Path | USD coverage |
| --- | --- |
| Home / and Tours section | All nine cards, descriptions, compact speedboat labels, card WhatsApp links |
| /tours | All nine cards; catalogue has no existing category/filter implementation |
| /tour/:slug | All nine actual detail routes, starting/unit prices, tier options, totals, descriptions, metadata and generated WhatsApp links |
| PackageDetailModal | All nine records tested directly; currently not imported by a public route, but its price and message path is converted |
| Contact form | Package name and customer-supplied message only; no generated tour price/total |
| Structured data | Existing six Product/Offer and detail offers now match estimated USD; speedboat price offers remain omitted |
| Shared Price component | Existing empty file; no rendering path |
| Payment/confirmation screens | No payment processing or separate confirmation screen exists in this source; generated WhatsApp messages are the confirmation/request path |

## Changed files

- src/utils/formatCurrency.ts
- src/utils/tourPriceDisplay.ts
- src/utils/tourBooking.ts
- src/components/cards/PackageCard.tsx
- src/pages/TourDetail.tsx
- src/config/productSchema.ts
- src/components/cards/PackageDetailModal.tsx
- scripts/validate-tour-packages.cjs
- scripts/validate-usd-displays.cjs
- docs/audits/stage-7e-usd-display-audit.md

## Complete inspected-file inventory

- index.html
- package.json
- scripts/generate-sitemap.mjs
- scripts/validate-speedboat-packages.cjs
- scripts/validate-tour-packages.cjs
- src/App.tsx
- src/components/cards/GalleryCard.tsx
- src/components/cards/PackageCard.tsx
- src/components/cards/PackageDetailModal.tsx
- src/components/cards/TestimonialCard.tsx
- src/components/common/Badge.tsx
- src/components/common/Button.tsx
- src/components/common/Card.tsx
- src/components/common/Container.tsx
- src/components/common/Modal.tsx
- src/components/common/Price.tsx
- src/components/common/Rating.tsx
- src/components/common/ScrollReveal.tsx
- src/components/common/SectionTitle.tsx
- src/components/layout/Footer.tsx
- src/components/layout/Navbar.tsx
- src/components/layout/ScrollToTop.tsx
- src/components/sections/Contact.tsx
- src/components/sections/FAQ.tsx
- src/components/sections/FeatureBar.tsx
- src/components/sections/Gallery.tsx
- src/components/sections/Hero.tsx
- src/components/sections/Testimonials.tsx
- src/components/sections/TourSection.tsx
- src/config/faqSchema.ts
- src/config/menu.ts
- src/config/productSchema.ts
- src/config/schema.ts
- src/config/seo.ts
- src/config/site.ts
- src/config/theme.ts
- src/constants/animations.ts
- src/constants/colors.ts
- src/constants/icons.ts
- src/constants/social.ts
- src/data/boats.ts
- src/data/curatedPhotos.ts
- src/data/faq.ts
- src/data/gallery.ts
- src/data/menu.ts
- src/data/photos.ts
- src/data/privateSpeedboatPackages.ts
- src/data/productReconciliation.ts
- src/data/products.ts
- src/data/services.ts
- src/data/sources.ts
- src/data/testimonials.ts
- src/data/tourCatalogue.ts
- src/data/tourOperations.ts
- src/main.tsx
- src/pages/About.tsx
- src/pages/Contact.tsx
- src/pages/Gallery.tsx
- src/pages/Home.tsx
- src/pages/TourDetail.tsx
- src/pages/Tours.tsx
- src/types/boat.ts
- src/types/faq.ts
- src/types/gallery.ts
- src/types/photo.ts
- src/types/product.ts
- src/types/service.ts
- src/types/site.ts
- src/types/source.ts
- src/types/testimonial.ts
- src/types/tourContent.ts
- src/utils/boatCatalog.ts
- src/utils/formatCurrency.ts
- src/utils/photoPresentation.ts
- src/utils/productPresentation.ts
- src/utils/scroll.ts
- src/utils/seo.ts
- src/utils/servicePresentation.ts
- src/utils/slug.ts
- src/utils/sourceVerification.ts
- src/utils/tourBooking.ts
- src/utils/tourContentPresentation.ts
- src/utils/tourPriceDisplay.ts
- src/utils/whatsapp.ts
- scripts/validate-usd-displays.cjs

## Remaining IDR-related occurrences

These are intentionally retained. Rendered-route/card/modal and decoded-message tests found no numeric IDR tour price or IDR priceCurrency offer. This table records every remaining matching source line, including comments and reference masters; line numbers are locators, not approval.

| File | Lines | Classification |
| --- | --- | --- |
| src/components/cards/PackageDetailModal.tsx | 56 | Customer/crawler explanatory text naming the original base currency; no numeric IDR price is displayed. |
| src/config/productSchema.ts | 25 | Customer/crawler explanatory text naming the original base currency; no numeric IDR price is displayed. |
| src/data/boats.ts | 66, 104, 105, 117 | Internal source master/type or reference reconciliation evidence, not a public selling-price path. |
| src/data/privateSpeedboatPackages.ts | 57, 74 | Preserved provisional conversion metadata and internal comment. |
| src/data/productReconciliation.ts | 16, 19, 24, 27 | Internal source master/type or reference reconciliation evidence, not a public selling-price path. |
| src/data/products.ts | 331, 348, 363, 381 | Original IDR descriptions/templates; every public use is passed through formatTourPriceText. Internal values retained. |
| src/data/tourOperations.ts | 195, 196, 202, 203, 208, 209, 393, 427, 429, 430, 506 | Internal source master/type or reference reconciliation evidence, not a public selling-price path. |
| src/pages/TourDetail.tsx | 84, 422 | Customer/crawler explanatory text naming the original base currency; no numeric IDR price is displayed. |
| src/types/boat.ts | 42 | Internal source master/type or reference reconciliation evidence, not a public selling-price path. |
| src/utils/formatCurrency.ts | 1, 4, 19 | IDR formatter retained for internal/reference uses; fixed display conversion constant. No public tour component calls formatIdr. |

## Validation

- Existing tour-package regressions: PASS; original IDR amount/tier/minimum/guest arithmetic assertions retained.
- Speedboat regressions: PASS; every passenger-band boundary, fixed per-boat total, photo mapping, pending labels and no structured offers verified.
- USD display regressions: PASS; actual App /, /tours and nine detail routes, all nine cards/modals, all tiers/passenger selections, decoded WhatsApp messages, USD offers and preserved IDR bases.
- TypeScript: PASS (zero diagnostics). Production build: PASS. git diff --check: PASS.
- Protected-source hash comparison: all src/data and src/types files, source asset/photo bytes, prior audit records and unrelated source files unchanged; only the eight implementation/test files listed above differ.
- Tests render React server-side; no browser E2E or visual verification is claimed. Existing SSR title warnings remain outside this currency change.
- No messages sent, commit, push or deployment. Existing owner-dependent approvals remain pending.
