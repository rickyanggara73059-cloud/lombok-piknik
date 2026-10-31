import { responsivePhotos } from "../data/responsivePhotos";

const widths = [320, 480, 640, 768, 960, 1280, 1600];
function unsplashVariant(src: string, width: number) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("fit", "max");
  url.searchParams.set("fm", "webp");
  url.searchParams.set("q", "78");
  return url.href;
}

export function responsivePhoto(src: string | undefined | null, sizes: string) {
  const photo = src ? responsivePhotos[src] : undefined;
  if (photo) {
    const { fallbackSrc, ...attributes } = photo;
    return { ...attributes, src: fallbackSrc, sizes };
  }
  if (src?.startsWith("https://images.unsplash.com/")) {
    return {
      src: unsplashVariant(src, 640),
      srcSet: widths.map(width => `${unsplashVariant(src, width)} ${width}w`).join(", "),
      sizes,
    };
  }
  return {};
}
