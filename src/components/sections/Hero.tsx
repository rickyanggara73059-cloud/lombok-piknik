import { useEffect, useState } from "react";
import { SITE } from "../../config/site";

const images: { src: string; desktopSrc?: string; alt: string; position: string }[] = [
  {
    "src": "/images/hero/hero-yar07628.webp",
    "desktopSrc": "/images/hero/hero-yar07628-desktop.webp",
    "alt": "Lanskap bukit dan teluk pada cahaya golden hour",
    "position": "object-[55%_55%] lg:object-[50%_50%]"
  },
  {
    "src": "/images/hero/hero-dji-0501.webp",
    "desktopSrc": "/images/hero/hero-dji-0501-desktop.webp",
    "alt": "Garis pantai berpasir merah muda dan laut turquoise",
    "position": "object-[52%_60%] lg:object-[50%_50%]"
  },
  {
    "src": "/images/hero/hero-dsc05461.webp",
    "alt": "Wisatawan menikmati panorama bukit dan teluk",
    "position": "object-[48%_58%] lg:object-[50%_55%]"
  },
  {
    "src": "/images/hero/hero-wil07136.webp",
    "desktopSrc": "/images/hero/hero-wil07136-desktop.webp",
    "alt": "Satwa komodo dengan latar laut",
    "position": "object-[60%_65%] lg:object-[60%_50%]"
  },
  {
    "src": "/images/hero/hero-dsc05537.webp",
    "desktopSrc": "/images/hero/hero-dsc05537-desktop.webp",
    "alt": "Wisatawan duduk di bukit saat golden hour",
    "position": "object-[54%_60%] lg:object-[50%_50%]"
  },
  {
    "src": "/images/hero/hero-dji-0507.webp",
    "desktopSrc": "/images/hero/hero-dji-0507-desktop.webp",
    "alt": "Dua wisatawan bersantai di tepi pantai berpasir merah muda",
    "position": "object-[50%_60%] lg:object-[50%_50%]"
  },
  {
    "src": "/images/hero/hero-dscf8617.webp",
    "desktopSrc": "/images/hero/hero-dscf8617-desktop.webp",
    "alt": "Rombongan wisatawan di haluan kapal",
    "position": "object-[46%_60%] lg:object-[50%_50%]"
  },
  {
    "src": "/images/hero/hero-gp016686.webp",
    "alt": "Pasangan wisatawan dengan latar panorama bukit dan teluk",
    "position": "object-[49%_52%] lg:object-[50%_50%]"
  },
  {
    "src": "/images/hero/hero-sunset-fca280.webp",
    "alt": "Rombongan wisatawan di kapal dengan langit senja",
    "position": "object-[54%_50%] lg:object-[50%_50%]"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full min-w-0 max-w-full supports-[height:100dvh]:min-h-dvh"
    >
      {/* Background Slider */}
      <div className="absolute inset-0 w-full min-w-0 max-w-full overflow-hidden">

        {images.map((image, index) => (
          <picture key={image.src}>
            {image.desktopSrc && (
              <source media="(min-width: 1024px)" srcSet={image.desktopSrc} />
            )}
            <img
              src={image.src}
              alt={image.alt}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              className={`
                absolute
                inset-0
                h-full
                w-full
                max-w-full
                object-cover
                ${image.position}
                transition-opacity
                duration-[2000ms]
                ease-in-out
                ${index === current ? "opacity-100 animate-kenburns" : "opacity-0"}
              `}
            />
          </picture>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/25" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full min-w-0 max-w-7xl items-start px-6 pb-12 pt-24 supports-[height:100dvh]:min-h-dvh sm:px-8 sm:pb-16 lg:items-center lg:px-8 lg:pt-28">

        <div className="w-full min-w-0 max-w-2xl [overflow-wrap:anywhere]">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-yellow-400 sm:mb-4 sm:text-sm sm:tracking-[5px] lg:mb-5 lg:text-base lg:tracking-[8px]">
            Welcome To Paradise
          </p>

          <h1 className="break-words text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {SITE.name}
          </h1>

          <p className="mt-4 break-words text-base leading-6 text-white/90 sm:mt-5 sm:text-lg sm:leading-8 lg:mt-6 lg:text-xl">
            {SITE.description}
          </p>


          {/* Indicator */}

          <div className="mt-5 flex gap-2 sm:mt-6 sm:gap-3 lg:mt-8">

            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  current === index
                    ? "w-10 bg-yellow-400"
                    : "w-2 bg-white/50"
                }`}
              />
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}
