import { Helmet } from "react-helmet-async";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Container from "../components/common/Container";
import SectionTitle from "../components/common/SectionTitle";
import PackageCard from "../components/cards/PackageCard";

import { products } from "../data/products";

import { SITE } from "../config/site";


export default function Tours() {

  return (
    <>

      <Helmet>

        <title>
          Lombok Tour Packages | {SITE.name}
        </title>


        <meta
          name="description"
          content="
          Explore the best Lombok tour packages,
          Gili Islands, Rinjani, Mandalika,
          waterfalls and private tours.
          "
        />

      </Helmet>



      <Navbar />


      <main className="bg-gray-50 min-h-screen">


        {/* Header */}

        <section
          className="
            bg-gradient-to-r
            from-yellow-400
            to-orange-400
            py-24
          "
        >

          <Container>

            <h1
              className="
                text-5xl
                font-black
                text-black
              "
            >
              Lombok Tour Packages
            </h1>


            <p
              className="
                mt-5
                max-w-2xl
                text-lg
                text-black/70
              "
            >
              Discover beautiful Lombok destinations
              with our professional local guides.
            </p>


          </Container>

        </section>



        {/* Products */}

        <section className="py-20">


          <Container>


            <SectionTitle

              subtitle="All Packages"

              title="Explore Lombok Experiences"

              description="
              Choose your favorite adventure,
              beach tour, island hopping,
              and cultural experience.
              "

            />



            <div
              className="
                mt-12
                grid
                gap-8
                md:grid-cols-2
                xl:grid-cols-3
              "
            >

              {products.map((product)=>(

                <PackageCard

                  key={product.id}

                  product={product}

                />

              ))}


            </div>


          </Container>


        </section>


      </main>



      <Footer />


    </>
  );
}