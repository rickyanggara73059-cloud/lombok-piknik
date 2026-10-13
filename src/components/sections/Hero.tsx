import { useEffect, useState } from "react";
import { SITE } from "../../config/site";

const images = [
  "/images/hero/lombok-beach.webp",
  "/images/hero/lombok-waterfall.webp",
  "/images/hero/komodo-padarisland.webp",
  "/images/hero/komodo-pink-beach.webp",
  "/images/hero/komodo-coast.webp",
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
          <img
            key={image}
            src={image}
            alt={`Lombok ${index + 1}`}
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
              transition-opacity
              duration-[2000ms]
              ease-in-out
              ${index === current ? "opacity-100 animate-kenburns" : "opacity-0"}
            `}
          />
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

          <div className="mt-6 flex min-w-0 max-w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4 lg:mt-10">

            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-yellow-400 px-6 py-3 text-center font-bold text-black transition hover:bg-yellow-300 sm:px-8 sm:py-4"
            >
              Book Now
            </a>

            <a
              href="#tours"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white px-6 py-3 text-center font-bold text-white transition hover:bg-white hover:text-black sm:px-8 sm:py-4"
            >
              Explore Tours
            </a>

          </div>

          {/* Indicator */}

          <div className="mt-6 flex gap-2 sm:mt-8 sm:gap-3 lg:mt-12">

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
