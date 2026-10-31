import { SITE } from "../../config/site";
import { MENU } from "../../data/menu";


export default function Footer() {
  return (
    <footer className="w-full min-w-0 bg-black text-white [overflow-wrap:anywhere]">

      <div className="
        mx-auto
        grid w-full min-w-0 grid-cols-1
        max-w-7xl
        gap-10
        px-6 sm:px-8 lg:px-6
        py-16
        md:grid-cols-3
      ">


        {/* Brand */}
        <div className="min-w-0">

          <h2 className="text-3xl font-black">
            {SITE.name.split(" ")[0]}{" "}
            <span className="text-yellow-400">
              {SITE.name.split(" ").slice(1).join(" ")}
            </span>
          </h2>


          <p className="mt-4 text-gray-400 leading-relaxed">
            {SITE.description}
          </p>


          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-6
              inline-block
              rounded-full
              bg-yellow-400
              px-6
              py-3
              font-bold
              text-black
              hover:bg-yellow-300
            "
          >
            Contact Us
          </a>

          {SITE.facebook && (
            <div className="mt-6">
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 transition hover:text-yellow-400"
                aria-label="Lombok Awesome Tour on Facebook (opens in a new tab)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.095 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.49 0-1.955.931-1.955 1.887v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.1 24 12.073Z" />
                </svg>
                Facebook
              </a>
            </div>
          )}

        </div>



        {/* Menu */}
        <div className="min-w-0">

          <h3 className="mb-5 text-xl font-bold">
            Quick Links
          </h3>


          <ul className="space-y-3">

            {MENU.map((item)=>(
              <li key={item.name}>

                <a
                  href={item.path}
                  className="
                    text-gray-400
                    transition
                    hover:text-yellow-400
                  "
                >
                  {item.name}
                </a>

              </li>
            ))}

          </ul>

        </div>



        {/* Contact */}
        <div className="min-w-0">

          <h3 className="mb-5 text-xl font-bold">
            Contact
          </h3>


          <div className="space-y-3 text-gray-400">

            <p>
              📍 {SITE.address}
            </p>

            <p>
              📞 {SITE.phone}
            </p>

            <p>
              ✉️ {SITE.email}
            </p>

          </div>

        </div>


      </div>


      {/* Bottom */}
      <div className="
        border-t
        border-white/10
        px-6 py-6
        text-center
        text-sm
        text-gray-500
      ">

        © {new Date().getFullYear()} {SITE.name}.
        All Rights Reserved.

      </div>


    </footer>
  );
}
