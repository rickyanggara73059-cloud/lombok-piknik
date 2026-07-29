import { motion } from "framer-motion";
import { Star } from "lucide-react";

import type { Testimonial } from "../../types/testimonial";


interface Props {
  testimonial: Testimonial;
}


export default function TestimonialCard({
  testimonial,
}: Props) {


  return (

    <motion.div

      initial={{
        opacity:0,
        y:40,
      }}

      whileInView={{
        opacity:1,
        y:0,
      }}

      viewport={{
        once:true,
        amount:0.2,
      }}

      transition={{
        duration:0.6,
      }}


      whileHover={{
        y:-8,
      }}


      className="
        rounded-3xl
        bg-white
        p-8
        shadow-lg
        transition
        hover:shadow-2xl
      "

    >


      <div className="flex items-center gap-4">


        <img

          src={
            testimonial.image ||
            "/images/default-user.jpg"
          }

          alt={testimonial.name}

          className="
            h-16
            w-16
            rounded-full
            object-cover
          "

        />


        <div>

          <h3 className="font-bold text-gray-900">
            {testimonial.name}
          </h3>


          <p className="text-sm text-gray-500">
            {testimonial.country}
          </p>


        </div>


      </div>



      <div className="mt-5 flex gap-1">

        {Array.from({
          length:testimonial.rating
        }).map((_,index)=>(

          <Star

            key={index}

            size={18}

            fill="currentColor"

            className="text-yellow-400"

          />

        ))}


      </div>




      <p className="
        mt-5
        leading-7
        text-gray-600
      ">
        "{testimonial.comment}"
      </p>


    </motion.div>

  );

}