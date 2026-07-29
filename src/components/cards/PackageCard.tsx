import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import type { Product } from "../../data/products";

import { formatIdr } from "../../utils/formatCurrency";
import { SITE } from "../../config/site";

import Card from "../common/Card";

import {
  MapPin,
  Clock3,
  Star,
  ArrowRight,
} from "lucide-react";


interface PackageCardProps {
  product: Product;
}


export default function PackageCard({
  product,
}: PackageCardProps) {


  const usdPrice = Math.round(
    product.priceIdr / 17000
  );


  const whatsappMessage = encodeURIComponent(
    product.whatsappMessage
  );


  return (

    <motion.div

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
        className="
          overflow-hidden
          group
          transition
          hover:shadow-2xl
        "
      >


        {/* IMAGE */}

        <div className="relative overflow-hidden">


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



          <img

            src={product.image}

            alt={product.title}

            loading="lazy"

            className="
              h-64
              w-full
              object-cover
              transition
              duration-500
              group-hover:scale-110
            "

          />


        </div>





        {/* CONTENT */}

        <div className="p-6">


          <div
            className="
              flex
              items-center
              justify-between
            "
          >


            <span
              className="
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


            <div className="flex items-center gap-2">

              <MapPin size={16}/>

              {product.location}

            </div>



            <div className="flex items-center gap-2">

              <Clock3 size={16}/>

              {product.duration}

            </div>


          </div>





          <p
            className="
              mt-5
              line-clamp-3
              text-sm
              text-gray-600
            "
          >
            {product.description}

          </p>






          {/* PRICE + BUTTON */}

          <div
            className="
              mt-8
              flex
              items-end
              justify-between
              gap-3
            "
          >



            <div>

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Starting From / Pax
              </p>



              <p
                className="
                  text-lg
                  font-black
                  text-yellow-500
                "
              >

                {formatIdr(product.priceIdr)}

              </p>



              <p
                className="
                  text-xs
                  text-gray-400
                "
              >

                ≈ USD {usdPrice} / pax

              </p>


            </div>






            <div
              className="
                flex
                gap-2
                shrink-0
              "
            >



              <Link

                to={`/tour/${product.slug}`}

                className="
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