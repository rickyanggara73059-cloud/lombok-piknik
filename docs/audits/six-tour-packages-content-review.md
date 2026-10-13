# Six active tour packages — implementation and remaining content review

Implemented from the active `src/data/products.ts` catalog. Exactly six existing Products and slugs retained; no audited PDF candidate/profile/boat/photo was activated. All original descriptions, highlights, itinerary entries, inclusions/exclusions, minimum strings, images, prices, tier names/amounts and stored WhatsApp messages remain unchanged. Two sailing overviews summarize only their existing itinerary. Four Komodo price tiers gain optional `groupSize` metadata matching their existing explicit participant counts.

## Active content coverage

| Product ID / detail slug | Active selling price | Itinerary days | Content requiring review |
| --- | --- | --- | --- |
| lombok-island-5d4n / lombok-island-5d4n | IDR 6,000,000 | 5 | Exclusions, numeric minimum, confirmed price basis and booking policies not supplied. General meal inclusion conflicts with specific excluded meals; existing Meal Notes now displayed. Day 3 contains “Trip Finish” despite subsequent days; original order/text preserved for review. |
| lombok-island-4d3n / lombok-island-4d3n | IDR 5,000,000 | 4 | Exclusions, numeric minimum, confirmed price basis and booking policies not supplied. Final day ends at a hotel near the airport; no extra airport transfer or extra accommodation promise added. |
| north-lombok-3d2n / north-lombok-3d2n | IDR 2,350,000 | 3 | Minimum 4 persons retained. Exclusions, independently confirmed price basis and booking policies not supplied. |
| whale-shark-sumbawa / whale-shark-sumbawa | IDR 3,000,000 | 1 | Minimum 2 persons retained. Inclusions empty; exclusions, confirmed price basis and policies not supplied. Itinerary mentions breakfast/snack and photography, but these do not automatically establish price inclusions. No exact departure time, sighting guarantee or pickup coverage invented. |
| sailing-trip-komodo-3d2n / komodo-sailing-3d2n | Starting IDR 5,500,000/pax at 13 pax | 3 | Minimum 10 pax retained; exact group rates 10:6,500,000 / 11:6,250,000 / 12:6,000,000 / 13:5,500,000. Rates outside these group sizes, departure schedule, exact pickup/meeting details, boat allocation, deposit/refund policies and availability require confirmation. |
| lombok-labuan-bajo-sailing-4d3n / lombok-labuan-bajo-4d3n | Starting IDR 4,750,000/pax, Sharing Room Deck | 4 | Five original named price tiers selectable, unchanged. Numeric minimum, exact meeting/pickup times, departure schedule, physical boat/cabin allocation, deposit/refund policies and availability require confirmation. Existing route/pickup wording retained without expansion. |

Unknown information stays in this review document; missing lists are omitted from the customer page rather than presented as “nothing excluded” or populated with guesses. Existing source-specific candidates and prior conflict registers remain intact. No operator rate is copied into Product selling prices. The active application’s existing per-pax basis is retained for calculations; this implementation does not independently certify unspecified commercial basis or availability.

## Detail and booking behavior

- Existing hero image, category, title, location, duration, overview/highlights, two-column layout, sidebar, classes, typography, colors and CTA target retained.
- Existing left content column now renders ordered day-by-day itinerary, `included`, available exclusions and meal notes using existing heading/list styles. Page height grows to show the requested content; no new layout, CSS or route introduced.
- Known minimum strings enforce guest-selection minimums. Missing minimum is not filled as a business requirement; the existing guest range remains a request input, not certified vessel capacity.
- Komodo uses only the four explicitly priced group sizes. Unsupported sizes return no quote instead of using the cheapest rate.
- Sailing 4D3N uses the original selectable tier names/prices. Default is the existing starting-price tier, Sharing Room Deck. Selecting a price option does not certify physical cabin assignment or availability.
- Total is selected active per-pax price multiplied by selected guests. WhatsApp retains each stored Product message and appends the selected option, guest count, unit price and total. Existing `SITE.whatsapp` target unchanged; no message sent.
- PackageCard and TourSection require no change: they already consume the six active Products, starting prices, duration and slugs; all featured flags remain false, so no Best Seller claim appears.

## Local validation

`node scripts/validate-tour-packages.cjs`: PASS. Actual React server rendering checks all six `/tour/:slug` routes and cards, overview/highlights/itinerary/inclusions/exclusions/meal notes, generated WhatsApp URLs, all four group rates and five selectable sailing tiers, minimums, invalid/non-integer selections, unsupported group sizes and no Product mutation. No browser E2E claim.

`npm run build`: PASS, including TypeScript. `git diff --check`: PASS. Final checks compare exact baseline Product values (tier prices/names preserved), all original UI/config/asset/master files outside the allowed changes, and build output.

Production comparison: 74 artifacts before and after; 72 are byte-identical. The two expected differences are the JS bundle and its HTML script reference from the requested detail/booking integration. Replacing only the new JS reference with the original filename restores the exact original HTML hash. CSS remains byte-identical. Exact comparison confirms every original Product value is unchanged after removing only the newly added overview/groupSize metadata. No branding, contact target, SEO configuration, testimonials, home sections, routing, photos, PDF master data, dependencies or lockfiles changed. The server-render validation emits the pre-existing React warning about multiple children in the detail `<title>`; SEO/title implementation is left unchanged as requested.

Files: `src/data/products.ts`, `src/types/product.ts`, `src/pages/TourDetail.tsx`, new `src/utils/tourBooking.ts`, new `scripts/validate-tour-packages.cjs`, and this review document. No commit, push, deployment or external communication.
