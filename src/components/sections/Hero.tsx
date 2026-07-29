import { SITE } from "../../config/site";

export default function Hero() {
  return (
    <section
  id="home"
  className="relative min-h-screen overflow-hidden"
>

      {/* Background Image */}
      <img
        src="/images/hero/hero-lombok.jpg"
        alt="Lombok Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content */}
      <div className="relative z-10 h-screen max-w-7xl mx-auto px-8 flex items-center">
        <div className="max-w-2xl -mt-32">

          <p className="text-yellow-400 uppercase tracking-[6px] mb-4">
            Welcome to Paradise
          </p>

          <h1 className="text-white text-7xl font-black leading-tight">
            {SITE.name.split(" ")[0]}
            <br />
            {SITE.name.split(" ").slice(1).join(" ")}
          </h1>

          <p className="text-white/80 text-xl mt-6 max-w-xl">
            {SITE.description}
          </p>

          <div className="mt-10 flex gap-4">
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              className="bg-yellow-400 hover:bg-yellow-300 px-8 py-4 rounded-full font-bold text-black"
            >
              Book Now
            </a>

            <button className="border border-white text-white px-8 py-4 rounded-full">
              Explore Tours
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}