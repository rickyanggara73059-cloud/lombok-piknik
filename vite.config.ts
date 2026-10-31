import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { responsivePhotos } from "./src/data/responsivePhotos.ts";

// Use the same candidates as Hero's first picture so the preload is reused.
// The pathname guard avoids downloading homepage artwork on tour entry URLs.
const firstHeroPreloads = [
  { media: "(width < 1024px)", ...responsivePhotos["/images/hero/hero-yar07628.webp"] },
  { media: "(width >= 1024px)", ...responsivePhotos["/images/hero/hero-yar07628-desktop.webp"] },
];
const heroPreloadScript = `(() => {
  if (window.location.pathname !== "/") return;
  for (const photo of ${JSON.stringify(firstHeroPreloads)}) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.type = "image/webp";
    link.media = photo.media;
    link.setAttribute("imagesrcset", photo.srcSet);
    link.setAttribute("imagesizes", "100vw");
    link.setAttribute("fetchpriority", "high");
    link.href = photo.fallbackSrc;
    document.head.appendChild(link);
  }
})();`;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "homepage-hero-preload",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          // Run before stylesheets/modules, while keeping charset and viewport first.
          const viewport = /<meta name="viewport"[^>]*>/;
          if (!viewport.test(html)) throw new Error("Viewport tag missing for hero preload");
          return html.replace(viewport, (tag) => tag + '\n<script data-hero-preload="true">' + heroPreloadScript + '</script>');
        },
      },
    },
  ],
});
