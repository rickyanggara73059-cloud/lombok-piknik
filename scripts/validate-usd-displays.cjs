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
const booking = load("src/utils/tourBooking.ts");
const { formatTourDisplayPrice, formatTourPriceText } = load("src/utils/tourPriceDisplay.ts");
const { APPLICATION_IDR_PER_USD, toEstimatedUsd } = load("src/utils/formatCurrency.ts");
const App = load("src/App.tsx").default;
const PackageCard = load("src/components/cards/PackageCard.tsx").default;
const PackageDetailModal = load("src/components/cards/PackageDetailModal.tsx").default;
const { productSchema } = load("src/config/productSchema.ts");
assert.equal(APPLICATION_IDR_PER_USD, 17000);
assert.equal(toEstimatedUsd(6000000), 353);
assert.equal(toEstimatedUsd(5000000), 294);
assert.equal(toEstimatedUsd(2350000), 138);
function render(element, location = "/") {
  return renderToStaticMarkup(React.createElement(HelmetProvider, null,
    React.createElement(StaticRouter, { location }, element)));
}
function noIdrPrice(text, label) {
  assert(!/\bIDR\s*[\d]|Rp[\s.]*\d|"priceCurrency":"IDR"/.test(text), label + ": public IDR amount remains");
}
function messages(html) {
  return [...html.matchAll(/href="https:\/\/wa\.me\/[^"?]+\?text=([^"]+)"/g)].map(match => decodeURIComponent(match[1].replaceAll("&amp;", "&")));
}
for (const location of ["/", "/tours", ...tourCatalogue.map(p => "/tour/" + p.slug)]) {
  const html = render(React.createElement(App), location);
  noIdrPrice(html, location);
  for (const message of messages(html)) noIdrPrice(message, location + " WhatsApp");
  console.log("PASS public USD route:", location);
}
for (const product of tourCatalogue) {
  const isBoat = product.priceBasis === "per_boat";
  const unit = formatTourDisplayPrice(product);
  const card = render(React.createElement(PackageCard, { product }));
  assert(card.includes(isBoat ? unit.replace(" per boat", " / boat") : unit));
  noIdrPrice(card, product.slug + " card");
  for (const message of messages(card)) noIdrPrice(message, product.slug + " card message");
  const modal = render(React.createElement(PackageDetailModal, { product, isOpen: true, onClose() {} }));
  assert(modal.includes(unit));
  noIdrPrice(modal, product.slug + " modal");
  const modalMessages = messages(modal);
  assert.equal(modalMessages.length, 1);
  assert(modalMessages[0].includes(unit));
  noIdrPrice(modalMessages[0], product.slug + " modal message");
  for (const guests of booking.getGuestOptions(product)) {
    const tiers = product.pricingTiers?.length ? product.pricingTiers.map((_, i) => i) : [0];
    for (const tier of tiers) {
      const quote = booking.getTourQuote(product, guests, tier);
      assert(quote);
      assert.equal(quote.totalPrice, quote.unitPrice * (isBoat ? 1 : guests));
      const formatted = formatTourDisplayPrice(product, quote.totalPrice, quote.guests);
      if (!isBoat) assert.equal(toEstimatedUsd(quote.totalPrice), Math.round(quote.totalPrice / 17000));
      const message = booking.getTourBookingMessage(product, quote);
      assert(message.includes(formatTourDisplayPrice(product, quote.unitPrice)));
      assert(message.includes(formatted));
      noIdrPrice(message, product.slug + " generated quote message");
    }
  }
  for (const tier of product.pricingTiers ?? []) {
    assert(formatTourDisplayPrice(product, tier.priceIdr).startsWith("US$"));
  }
}
assert.deepEqual(products.map(p => p.priceIdr), [6000000, 5000000, 2350000, 3000000, 5500000, 4750000]);
for (const [i, schema] of productSchema.entries()) {
  assert.equal(schema.offers.priceCurrency, "USD");
  assert(!Object.hasOwn(schema.offers, "availability"));
  assert.equal(schema.offers.price, products[i].priceUsd);
  noIdrPrice(JSON.stringify(schema), "Product schema");
}
assert.equal(formatTourPriceText("IDR 6,250,000 / pax"), "US$368 / pax");
console.log("PASS all 9 cards/modals, generated WhatsApp messages, all tiers/passenger selections, internal IDR totals and USD structured offers");

assert.deepEqual(products.map(p => p.priceUsd), [381,322,166,204,352,307]);
for (const p of products) { assert.equal(p.priceUsd - toEstimatedUsd(p.priceIdr),28); for (const g of booking.getGuestOptions(p)) { for (let i=0;i<(p.pricingTiers?.length ?? 1);i++) {const q=booking.getTourQuote(p,g,i); assert.equal(formatTourDisplayPrice(p,q.totalPrice,g),"US$"+(toEstimatedUsd(q.totalPrice)+28*g).toLocaleString("en-US"));}}}
