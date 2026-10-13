import { useState } from "react";
import { X, MapPin, Clock3, Star, ArrowRight } from "lucide-react";

import type { TourCatalogueProduct } from "../../data/tourCatalogue";

import { formatTourDisplayPrice, formatTourPriceText } from "../../utils/tourPriceDisplay";
import { getGuestOptions } from "../../utils/tourBooking";
import { SITE } from "../../config/site";


interface PackageDetailModalProps {

  product: TourCatalogueProduct;

  isOpen: boolean;

  onClose: () => void;

}


export default function PackageDetailModal({
  product,
  isOpen,
  onClose,
}: PackageDetailModalProps) {


  const [pax, setPax] = useState(1);


  if (!isOpen) return null;


  const isSpeedboat = product.priceBasis === "per_boat";
  const guests = isSpeedboat && !getGuestOptions(product).includes(pax) ? product.groupRange.min : pax;
  const totalPrice = isSpeedboat ? product.priceIdr : product.priceIdr * guests;


  const whatsappMessage = encodeURIComponent(
`Hello ${SITE.name} 👋

I want to book this tour.

Package:
${product.title}

Guest:
${guests} Pax

${isSpeedboat ? "Provisional price per boat:" : "Estimated price / Pax:"}
${formatTourDisplayPrice(product)}

${isSpeedboat ? "Provisional total:" : "Estimated total price:"}
${formatTourDisplayPrice(product, totalPrice)}
${isSpeedboat ? "Price and schedule pending operator verification." : "USD estimates are converted from the original IDR amounts and rounded independently."}

Please send me more information.
`
  );


  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-4
      "
      onClick={onClose}
    >


      <div
        className="
          relative
          max-h-[90vh]
          w-full
          max-w-3xl
          overflow-y-auto
          rounded-3xl
          bg-white
          shadow-2xl
        "
        onClick={(e)=>e.stopPropagation()}
      >


        <button
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            z-10
            rounded-full
            bg-white
            p-2
            shadow
          "
        >
          <X size={20}/>
        </button>



        <img
          src={product.image}
          alt={product.title}
          className="
            h-72
            w-full
            object-cover
          "
        />



        <div className="p-8">


          <span
            className="
              rounded-full
              bg-yellow-100
              px-4
              py-2
              text-sm
              font-bold
              text-yellow-700
            "
          >
            {product.category}
          </span>



          <h2
            className="
              mt-5
              text-3xl
              font-black
              text-gray-900
            "
          >
            {product.title}
          </h2>



          <div
            className="
              mt-5
              flex
              flex-wrap
              gap-5
              text-gray-500
            "
          >

            <span className="flex items-center gap-2">
              <MapPin size={18}/>
              {product.location}
            </span>


            <span className="flex items-center gap-2">
              <Clock3 size={18}/>
              {product.duration}
            </span>


            <span className="flex items-center gap-2">
              <Star size={18} fill="currentColor"/>
              {product.rating}
            </span>

          </div>



          <p className="mt-6 text-gray-600 leading-7">
            {formatTourPriceText(product.description)}
          </p>



          {/* PILIHAN PAX */}

          <div className="mt-8">

            <label
              className="
                text-sm
                font-bold
                text-gray-700
              "
            >
              Number of Guests
            </label>


            <select
              value={guests}
              onChange={(e)=>setPax(Number(e.target.value))}
              className="
                mt-3
                w-full
                rounded-xl
                border
                px-4
                py-3
                outline-none
              "
            >

              {isSpeedboat ? getGuestOptions(product).map((count) => <option key={count} value={count}>{count} Pax</option>) : <>
              <option value={1}>
                1 Pax
              </option>

              <option value={2}>
                2 Pax
              </option>

              <option value={3}>
                3 Pax
              </option>

              <option value={4}>
                4 Pax
              </option>

              <option value={5}>
                5 Pax
              </option>

              <option value={6}>
                6 Pax
              </option>
              </>}

            </select>

          </div>




          {/* TOTAL */}

          <div
            className="
              mt-6
              rounded-2xl
              bg-gray-50
              p-5
            "
          >

            <p className="text-sm text-gray-500">
              {isSpeedboat ? "Provisional total" : "Estimated total price"} ({guests} Pax)
            </p>


            <p
              className="
                mt-2
                text-3xl
                font-black
                text-yellow-500
              "
            >
              {formatTourDisplayPrice(product, totalPrice)}
            </p>


          </div>




          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-8
              flex
              items-center
              justify-center
              gap-2
              rounded-full
              bg-yellow-400
              px-6
              py-4
              font-bold
              text-black
              transition
              hover:bg-yellow-300
            "
          >

            Book via WhatsApp

            <ArrowRight size={18}/>

          </a>



        </div>


      </div>


    </div>

  );
}