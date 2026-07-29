import { useState } from "react";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import GalleryCard from "../cards/GalleryCard";

import { gallery } from "../../data/gallery";


export default function Gallery() {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  return (

    <section
      id="gallery"
      className="bg-white py-24"
    >

      <Container>

        <SectionTitle
          subtitle="Gallery"
          title="Explore Lombok Beauty"
          description="Discover amazing destinations and unforgettable experiences."
        />


        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >

          {gallery.map((item)=>(

            <GalleryCard
              key={item.id}
              item={item}
              onClick={() => setSelectedImage(item.image)}
            />

          ))}


        </div>


      </Container>



      {/* LIGHTBOX */}

      {selectedImage && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/80
            p-6
          "

          onClick={() => setSelectedImage(null)}

        >

          <img

            src={selectedImage}

            alt="Gallery Preview"

            className="
              max-h-[90vh]
              max-w-6xl
              rounded-3xl
              object-contain
              shadow-2xl
            "

            onClick={(e)=>e.stopPropagation()}

          />


          <button

            onClick={() => setSelectedImage(null)}

            className="
              absolute
              right-8
              top-8
              text-4xl
              text-white
            "

          >
            ✕
          </button>


        </div>

      )}



    </section>

  );
}