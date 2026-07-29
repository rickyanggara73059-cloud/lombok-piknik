import { useEffect, useState } from "react";
import { SITE } from "../../config/site";

const images = [
  "/images/hero/giligede.jpg",
  "/images/hero/giligede1.jpg",
  "/images/hero/hero.webp",
  "/images/hero/hero-lombok.jpg",
  "/images/hero/merese.jpg",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background Slider */}
      <div className="absolute inset-0">

        {images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`Lombok ${index + 1}`}
            className={`
              absolute
              inset-0
              h-full
              w-full
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
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 lg:px-8">

        <div className="max-w-2xl">

          <p className="mb-5 tracking-[8px] uppercase text-yellow-400 font-semibold">
            Welcome To Paradise
          </p>

          <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">
            {SITE.name}
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/90 md:text-xl">
            {SITE.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300"
            >
              Book Now
            </a>

            <a
              href="#tours"
              className="rounded-full border border-white px-8 py-4 font-bold text-white transition hover:bg-white hover:text-black"
            >
              Explore Tours
            </a>

          </div>

          {/* Indicator */}

          <div className="mt-12 flex gap-3">

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