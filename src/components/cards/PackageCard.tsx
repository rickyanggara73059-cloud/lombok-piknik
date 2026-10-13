import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import type { TourCatalogueProduct } from "../../data/tourCatalogue";
import { formatTourDisplayPrice, formatTourPriceText } from "../../utils/tourPriceDisplay";


import { SITE } from "../../config/site";

import Card from "../common/Card";

import {
  MapPin,
  Clock3,
  Star,
  ArrowRight,
} from "lucide-react";


interface PackageCardProps {
  product: TourCatalogueProduct;
}


export default function PackageCard({
  product,
}: PackageCardProps) {


  const isSpeedboat = product.priceBasis === "per_boat";



  const whatsappMessage = encodeURIComponent(
    formatTourPriceText(product.whatsappMessage)
  );


  return (

    <motion.div
      className={isSpeedboat ? "h-full w-full min-w-0 max-w-full" : "w-full min-w-0 max-w-full"}

      initial={{
        opacity: 0,
        y: 40,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      viewport={{
        once: true,
      }}

      transition={{
        duration: 0.6,
      }}

      whileHover={{
        y: -8,
      }}

    >

      <Card
        className={`${isSpeedboat ? "h-full flex flex-col min-w-0" : ""}
          w-full min-w-0 max-w-full [overflow-wrap:anywhere]
          overflow-hidden
          group
          transition
          hover:shadow-2xl
        `}
      >


        {/* IMAGE */}

        <div className={isSpeedboat ? "relative w-full min-w-0 max-w-full overflow-hidden aspect-[4/3] shrink-0 bg-gray-50" : `relative w-full min-w-0 max-w-full overflow-hidden`}>


          {product.featured && (

            <span
              className="
                absolute
                left-4
                top-4
                z-10
                rounded-full
                bg-yellow-400
                px-4
                py-2
                text-xs
                font-bold
                text-black
              "
            >
              ⭐ BEST SELLER
            </span>

          )}



          {product.image ? <img

            src={product.image ?? undefined}

            alt={product.title}

            loading="lazy"
            style={isSpeedboat ? { objectPosition: product.imagePosition } : undefined}

            className={isSpeedboat ? "h-full w-full max-w-full object-cover transition duration-500 group-hover:scale-110" : `
              h-64
              w-full max-w-full
              object-cover
              transition
              duration-500
              group-hover:scale-110
            `}

          /> : <div className={isSpeedboat ? "h-full w-full flex items-center justify-center text-gray-500" : `h-64 w-full flex items-center justify-center text-gray-500`}>Reference image pending</div>}


        </div>





        {/* CONTENT */}

        <div className={isSpeedboat ? "w-full max-w-full p-6 flex flex-1 flex-col min-w-0" : `w-full max-w-full p-6 min-w-0`}>


          <div
            className="
              flex
              items-center
              justify-between
              min-w-0 gap-2
            "
          >


            <span
              className="
                min-w-0
                text-sm
                font-bold
                uppercase
                text-yellow-500
              "
            >
              {product.category}
            </span>



            <div
              className="
                flex
                items-center
                gap-1
                shrink-0
                text-sm
                text-yellow-500
              "
            >

              <Star
                size={16}
                fill="currentColor"
              />

              {product.rating}

            </div>


          </div>





          <h3
            className="
              mt-3
              line-clamp-2
              min-h-[56px]
              text-xl
              font-bold
              text-gray-900
            "
          >
            {product.title}

          </h3>





          <div
            className="
              mt-4
              space-y-2
              text-sm
              text-gray-500
            "
          >


            <div className="flex min-w-0 items-center gap-2">

              <MapPin size={16} className="shrink-0"/>

              <span className="min-w-0">{product.location}</span>

            </div>



            <div className="flex min-w-0 items-center gap-2">

              <Clock3 size={16} className="shrink-0"/>

              <span className="min-w-0">{product.duration}</span>

            </div>


          </div>





          <p
            className={isSpeedboat ? "mt-5 line-clamp-3 min-h-[60px] text-sm text-gray-600 break-words" : `
              mt-5
              line-clamp-3
              text-sm
              text-gray-600
            `}
          >
            {formatTourPriceText(product.description)}

          </p>






          {/* PRICE + BUTTON */}

          <div
            className={isSpeedboat ? "mt-auto w-full max-w-full pt-8 flex flex-col items-start gap-4 min-w-0" : `
              mt-8
              flex
              w-full min-w-0 max-w-full flex-wrap
              items-end
              justify-between
              gap-3
            `}
          >



            <div className="min-w-0 max-w-full">

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                {product.priceBasis === "per_boat" ? "Provisional price per boat" : "Starting From / Pax"}
              </p>



              <p
                className={isSpeedboat ? "text-lg font-black text-yellow-500 whitespace-normal" : `
                  text-lg
                  font-black
                  text-yellow-500
                `}
              >

                {isSpeedboat ? formatTourDisplayPrice(product).replace(" per boat", " / boat") : formatTourDisplayPrice(product)}

              </p>



              <p
                className="
                  text-xs
                  text-gray-400
                "
              >

                {product.priceBasis === "per_boat" ? "Pending operator verification" : "Estimated USD price"}

              </p>


            </div>






            <div
              className={isSpeedboat ? "flex min-w-0 max-w-full flex-wrap gap-2 w-full justify-between" : `
                flex
                gap-2
                min-w-0 max-w-full flex-wrap
              `}
            >



              <Link

                to={`/tour/${product.slug}`}

                className="
                  min-w-0 max-w-full whitespace-normal
                  rounded-full
                  border-2
                  border-yellow-400
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-yellow-600
                  transition
                  hover:bg-yellow-400
                  hover:text-black
                "

              >

                Details

              </Link>





              <a

                href={`https://wa.me/${SITE.whatsapp}?text=${whatsappMessage}`}

                target="_blank"

                rel="noopener noreferrer"

                className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  bg-yellow-400
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-black
                  transition
                  hover:bg-yellow-300
                "

              >

                Book

                <ArrowRight size={14}/>

              </a>



            </div>



          </div>



        </div>



      </Card>


    </motion.div>

  );

}