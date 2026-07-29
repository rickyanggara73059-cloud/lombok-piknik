import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import TestimonialCard from "../cards/TestimonialCard";

import { testimonials } from "../../data/testimonials";


export default function Testimonials() {


  return (

    <section
      id="testimonials"
      className="
        bg-gray-50
        py-24
      "
    >

      <Container>


        <SectionTitle

          subtitle="Testimonials"

          title="What Our Guests Say"

          description="
          Real experiences from travelers who explored Lombok with us.
          "

        />



        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >

          {testimonials.map((item)=>(

            <TestimonialCard

              key={item.id}

              testimonial={item}

            />

          ))}


        </div>


      </Container>


    </section>

  );

}