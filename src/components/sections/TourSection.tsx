import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import PackageCard from "../cards/PackageCard";

import { products } from "../../data/products";

export default function TourSection() {
  return (
    <section
      id="tours"
      className="py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <Container>
        <SectionTitle
          subtitle="Our Packages"
          title="Popular Tour Packages"
          description="Choose the best Lombok experience with professional local guides."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <PackageCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <a
            href="#contact"
            className="
              rounded-full
              border-2
              border-yellow-400
              px-8
              py-4
              font-bold
              text-yellow-500
              transition-all
              duration-300
              hover:bg-yellow-400
              hover:text-black
              hover:shadow-lg
            "
          >
            Explore All Tours
          </a>
        </div>
      </Container>
    </section>
  );
}