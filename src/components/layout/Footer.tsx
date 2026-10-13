import { SITE } from "../../config/site";
import { MENU } from "../../data/menu";


export default function Footer() {
  return (
    <footer className="bg-black text-white">

      <div className="
        mx-auto
        grid
        max-w-7xl
        gap-10
        px-6
        py-16
        md:grid-cols-3
      ">


        {/* Brand */}
        <div>

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

        </div>



        {/* Menu */}
        <div>

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
        <div>

          <h3 className="mb-5 text-xl font-bold">
            Contact
          </h3>


          <div className="space-y-3 text-gray-400">

            <p>
              📍 {SITE.address}
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
        py-6
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
