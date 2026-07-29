import { motion } from "framer-motion";
import type { GalleryItem } from "../../types/gallery";


interface GalleryCardProps {
  item: GalleryItem;
  onClick?: () => void;
}


export default function GalleryCard({
  item,
  onClick,
}: GalleryCardProps) {


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
        amount: 0.2,
      }}

      transition={{
        duration: 0.6,
      }}

      whileHover={{
        y: -8,
      }}

      onClick={onClick}

      className="
        group
        relative
        cursor-pointer
        overflow-hidden
        rounded-3xl
      "

    >


      <motion.img

        src={item.image}

        alt={item.title}

        whileHover={{
          scale: 1.1,
        }}

        transition={{
          duration:0.7,
        }}

        className="
          h-72
          w-full
          object-cover
        "

      />



      {/* Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/70
          via-black/20
          to-transparent
          opacity-80
        "
      />



      {/* Content */}

      <div
        className="
          absolute
          bottom-0
          left-0
          z-10
          p-6
          text-white
        "
      >

        <h3
          className="
            text-2xl
            font-bold
          "
        >
          {item.title}
        </h3>


        {item.location && (

          <p
            className="
              mt-2
              text-sm
              text-white/80
            "
          >
            📍 {item.location}
          </p>

        )}


      </div>



      {/* Hover Icon */}

      <div
        className="
          absolute
          right-5
          top-5
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-white/20
          text-white
          opacity-0
          backdrop-blur-md
          transition
          duration-300
          group-hover:opacity-100
        "
      >

        +

      </div>


    </motion.div>

  );
}