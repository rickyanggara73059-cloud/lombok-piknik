// Focused local validation using existing TypeScript and React dependencies.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { StaticRouter, Routes, Route } = require("react-router-dom");
const { HelmetProvider } = require("react-helmet-async");
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function("require", "module", "exports", code)((id) => {
    if (!id.startsWith(".")) return require(id);
    const base = path.resolve(path.dirname(file), id);
    return load([base + ".ts", base + ".tsx"].find(fs.existsSync) ?? base);
  }, module, module.exports);
  return module.exports;
}

const { products } = load("src/data/products.ts");
const { tourCatalogue } = load("src/data/tourCatalogue.ts");
const { privateSpeedboatPackageDrafts: drafts } = load("src/data/privateSpeedboatPackages.ts");
const booking = load("src/utils/tourBooking.ts");
const { formatTourDisplayPrice } = load("src/utils/tourPriceDisplay.ts");
const App = load("src/App.tsx").default;
const TourDetail = load("src/pages/TourDetail.tsx").default;
const Tours = load("src/pages/Tours.tsx").default;
const TourSection = load("src/components/sections/TourSection.tsx").default;
const { SITE } = load("src/config/site.ts");
const expectedPrices = ["US$560 per boat", "US$840 per boat", "US$1,120 per boat"];
const detailSource = fs.readFileSync("src/pages/TourDetail.tsx", "utf8");
assert.match(detailSource, /name="robots" content=\{isPendingSpeedboat \? "noindex, nofollow"/);
const actualTours = render(React.createElement(App), "/tours");
for (const draft of drafts) {
  assert(actualTours.includes("/tour/" + draft.slug));
  const actualDetail = render(React.createElement(App), "/tour/" + draft.slug);
  assert(actualDetail.includes(draft.description));
}
assert.equal(products.length, 6);
assert.equal(tourCatalogue.length, 9);
assert.deepEqual(tourCatalogue.slice(0, 6), products);
function render(element, location = "/tours", context = {}) {
  return renderToStaticMarkup(React.createElement(HelmetProvider, { context },
    React.createElement(StaticRouter, { location }, element)));
}
for (const screen of [Tours, TourSection]) {
  const html = render(React.createElement(screen));
  for (const [i, draft] of drafts.entries()) {
    assert(html.includes("/tour/" + draft.slug));
    assert(html.includes(expectedPrices[i].replace(" per boat", " / boat")));
    assert(html.includes(`src="${draft.image}"`));
    assert(!html.includes("Reference image pending"));
  }
}
for (const [i, draft] of drafts.entries()) {
  assert.equal(draft.image, "/images/destinations/labuan-bajo-komodo/" + ["YAR07628.jpeg", "DJI_0501.jpeg", "DSCF8873.jpeg"][i]);
  assert.equal(draft.imageSource, draft.image);
  assert(!draft.image.includes("/packages/labuan-bajo/"));
  assert.equal(draft.assetStatus, "reference_image_available");
  const poster = fs.readFileSync(path.resolve("public" + draft.image));
  assert(poster.length > 4 && poster[0] === 0xff && poster[1] === 0xd8);
  assert.equal(draft.isPlaceholder, true);
  assert.equal(draft.sellingPriceStatus, "needs_confirmation");
  assert.equal(draft.operationalStatus, "needs_confirmation");
  assert.equal(draft.priceIdr, [10000000, 15000000, 20000000][i]);
  assert.equal(draft.usdDisplay.idrPerUsd, 17884);
  assert.equal(draft.usdDisplay.rateDate, "2026-10-12");
  assert.equal(draft.usdDisplay.preciseAmount, draft.priceIdr / 17884);
  const guests = booking.getGuestOptions(draft);
  assert.deepEqual(guests, Array.from({ length: draft.groupRange.max - draft.groupRange.min + 1 }, (_, j) => draft.groupRange.min + j));
  for (const count of guests) {
    const quote = booking.getTourQuote(draft, count);
    assert.equal(quote.totalPrice, draft.priceIdr);
    assert.equal(formatTourDisplayPrice(draft, quote.totalPrice), expectedPrices[i]);
    const message = booking.getTourBookingMessage(draft, quote);
    assert(message.includes(expectedPrices[i]));
    assert(message.includes("pending operator"));
    assert(!/IDR|Rp/.test(message));
    assert(!message.includes("Price / Pax"));
  }
  for (const invalid of [0, NaN, 1.5, draft.groupRange.min - 1, draft.groupRange.max + 1]) {
    assert.equal(booking.getTourQuote(draft, invalid), undefined);
  }
  const context = {};
  const html = render(React.createElement(Routes, null, React.createElement(Route, {
    path: "/tour/:slug", element: React.createElement(TourDetail),
  })), "/tour/" + draft.slug, context);
  assert(!html.includes("Tour Not Found"));
  assert(html.includes(expectedPrices[i]));
  assert(html.includes(`src="${draft.image}"`));
  assert(!html.includes("Reference image pending"));
  for (const content of [...draft.highlights, ...draft.included, ...draft.excludes, ...draft.itinerary[0].entries]) {
    assert(html.includes(content));
  }
  const message = booking.getTourBookingMessage(draft, booking.getTourQuote(draft, guests[0]));
  assert(html.includes("https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(message)));
  assert(!html.includes('"offers"'));
  console.log("PASS speedboat catalogue/detail/per-boat booking:", draft.slug);
}
console.log("PASS 9 browsable records, all passenger-band boundaries, pending metadata and omitted unapproved offers");
