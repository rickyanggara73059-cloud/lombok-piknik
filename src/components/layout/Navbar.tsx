import { useState } from "react";
import { SITE } from "../../config/site";
import { MENU } from "../../data/menu";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-black/30 backdrop-blur-xl border-b border-white/10">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <a href="#home">

          <h1 className="text-3xl font-black text-white">
            {SITE.name.split(" ")[0]}{" "}
            <span className="text-yellow-400">
              {SITE.name.split(" ").slice(1).join(" ")}
            </span>
          </h1>

          <p className="text-xs text-gray-300">
            {SITE.tagline}
          </p>

        </a>


        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 text-white md:flex">

          {MENU.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="
                transition
                hover:text-yellow-400
              "
            >
              {item.name}
            </a>
          ))}

        </nav>


        {/* Book Button */}
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            hidden
            rounded-full
            bg-yellow-400
            px-5
            py-3
            font-bold
            text-black
            transition
            hover:bg-yellow-300
            md:block
          "
        >
          Book Now
        </a>


        {/* Mobile Button */}
        <button
          className="text-3xl text-white md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>


      </div>


      {/* Mobile Menu */}
      {open && (

        <div className="bg-black text-white md:hidden">

          {MENU.map((item) => (

            <a
              key={item.name}
              href={item.path}
              onClick={() => setOpen(false)}
              className="
                block
                border-b
                border-white/10
                p-4
                transition
                hover:bg-white/10
                hover:text-yellow-400
              "
            >
              {item.name}
            </a>

          ))}


          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              m-4
              block
              rounded-full
              bg-yellow-400
              px-5
              py-3
              text-center
              font-bold
              text-black
            "
          >
            Book Now
          </a>

        </div>

      )}

    </header>
  );
}