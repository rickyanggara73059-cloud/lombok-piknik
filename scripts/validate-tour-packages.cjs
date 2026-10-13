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
const booking = load("src/utils/tourBooking.ts");
const TourDetail = load("src/pages/TourDetail.tsx").default;
const PackageCard = load("src/components/cards/PackageCard.tsx").default;
const { SITE } = load("src/config/site.ts");
const { formatTourDisplayPrice, formatTourPriceText } = load("src/utils/tourPriceDisplay.ts");
const initial = JSON.stringify(products);
const text = (value) => renderToStaticMarkup(React.createElement("span", null, value)).slice(6, -7);
assert.equal(products.length, 6);
assert.equal(new Set(products.map((p) => p.slug)).size, 6);
for (const product of products) {
  const body = React.createElement(Routes, null, React.createElement(Route, {
    path: "/tour/:slug", element: React.createElement(TourDetail),
  }));
  const html = renderToStaticMarkup(React.createElement(HelmetProvider, null,
    React.createElement(StaticRouter, { location: "/tour/" + product.slug }, body)));
  assert(!html.includes("Tour Not Found"));
  for (const value of [product.title, product.description, product.location, product.duration,
    product.overview, ...(product.highlights ?? []), ...(product.included ?? []),
    ...(product.excludes ?? []), ...(product.mealNotes ?? []),
    ...(product.itinerary ?? []).flatMap((day) => day.entries)].filter(Boolean)) {
    assert(html.includes(text(formatTourPriceText(value))), product.slug + ": missing content " + value);
  }
  const guests = booking.getGuestOptions(product)[0];
  const quote = booking.getTourQuote(product, guests);
  assert(quote);
  const message = booking.getTourBookingMessage(product, quote);
  assert(message.startsWith(formatTourPriceText(product.whatsappMessage)));
  assert(html.includes(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`));
  assert.equal(quote.totalPrice, quote.unitPrice * guests);
  assert.equal(booking.getTourQuote(product, 0), undefined);
  assert.equal(booking.getTourQuote(product, 1.5), undefined);
  const card = renderToStaticMarkup(React.createElement(StaticRouter, { location: "/" },
    React.createElement(PackageCard, { product })));
  assert(card.includes(`/tour/${product.slug}`));
  assert(card.includes(text(product.duration)));
  assert(card.includes(text(formatTourDisplayPrice(product))));
  assert(card.includes(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(formatTourPriceText(product.whatsappMessage))}`));
  assert(!card.includes("BEST SELLER"));
  console.log("PASS detail/card/content/booking:", product.slug);
}
const komodo = products.find((p) => p.id === "sailing-trip-komodo-3d2n");
for (const [guests, unitPrice] of [[10, 6500000], [11, 6250000], [12, 6000000], [13, 5500000]]) {
  assert.equal(booking.getTourQuote(komodo, guests).unitPrice, unitPrice);
}
assert.equal(booking.getTourQuote(komodo, 9), undefined);
assert.equal(booking.getTourQuote(komodo, 14), undefined);
const sailing = products.find((p) => p.id === "lombok-labuan-bajo-sailing-4d3n");
assert.equal(booking.getTourQuote(sailing, 2).unitPrice, 4750000);
for (const [index, tier] of sailing.pricingTiers.entries()) {
  const quote = booking.getTourQuote(sailing, 3, index);
  assert.equal(quote.unitPrice, tier.priceIdr);
  assert.equal(quote.totalPrice, tier.priceIdr * 3);
  assert(booking.getTourBookingMessage(sailing, quote).includes(tier.name));
}
assert.equal(booking.getTourQuote(sailing, 2, 99), undefined);
assert.equal(booking.getTourQuote(products.find((p) => p.id === "north-lombok-3d2n"), 3), undefined);
assert.equal(booking.getTourQuote(products.find((p) => p.id === "whale-shark-sumbawa"), 1), undefined);
assert.equal(JSON.stringify(products), initial);
console.log("PASS all tier calculations, minimums, invalid selections and no Product mutation");
