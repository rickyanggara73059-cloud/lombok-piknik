import { useState } from "react";
import { SITE } from "../../config/site";
import { MENU } from "../../data/menu";

const NAVBAR_MENU = MENU.filter((item) => item.name !== "Testimonials");

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 w-full max-w-full z-50 border-b border-white/10 bg-black/40 text-white backdrop-blur-xl">
      <div className="mx-auto flex w-full min-w-0 min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:h-20 lg:px-8 lg:py-0">
        <a
          href="#home"
          className="flex min-h-11 min-w-0 max-w-full flex-1 flex-col justify-center lg:flex-none"
          onClick={() => setOpen(false)}
          aria-label={`${SITE.name} home`}
        >
          <span className="block max-w-full whitespace-normal break-words text-lg font-black leading-tight sm:text-xl lg:whitespace-nowrap lg:text-3xl">
            {SITE.name.split(" ")[0]}{" "}
            <span className="text-yellow-400">
              {SITE.name.split(" ").slice(1).join(" ")}
            </span>
          </span>
          <span className="mt-0.5 block text-[10px] leading-tight text-gray-300 sm:text-xs">
            {SITE.tagline}
          </span>
        </a>

        <nav
          aria-label="Main navigation"
          className="hidden shrink-0 items-center gap-8 text-white lg:flex"
        >
          {NAVBAR_MENU.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="inline-flex min-h-11 min-w-11 items-center justify-center transition hover:text-yellow-400"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 rounded-full bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300 lg:block"
        >
          Book Now
        </a>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="w-full min-w-0 max-w-full border-t border-white/10 bg-slate-950/95 px-4 pb-4 pt-2 shadow-xl lg:hidden"
        >
          {NAVBAR_MENU.map((item) => (
            <a
              key={item.name}
              href={item.path}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center border-b border-white/10 px-2 text-base transition hover:bg-white/10 hover:text-yellow-400"
            >
              {item.name}
            </a>
          ))}

          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-yellow-400 px-5 py-3 text-center font-bold text-black transition hover:bg-yellow-300"
          >
            Book Now
          </a>
        </nav>
      )}
    </header>
  );
}
