import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Hero from "./components/sections/Hero";
import TourSection from "./components/sections/TourSection";
import Gallery from "./components/sections/Gallery";
import Testimonials from "./components/sections/Testimonials";
import FAQ from "./components/sections/FAQ";
import Contact from "./components/sections/Contact";

import TourDetail from "./pages/TourDetail";
import Tours from "./pages/Tours";

import { Helmet } from "react-helmet-async";

import { SEO } from "./config/seo";
import { travelAgencySchema } from "./config/schema";
import { faqSchema } from "./config/faqSchema";
import { productSchema } from "./config/productSchema";


function Home() {
  return (
    <>
      <Hero />
      <TourSection />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}



function App() {
  return (
    <>

      <Helmet>

        <title>
          {SEO.title}
        </title>


        <meta
          name="description"
          content={SEO.description}
        />


        <meta
          name="keywords"
          content={SEO.keywords}
        />


        <meta
          property="og:title"
          content={SEO.title}
        />


        <meta
          property="og:description"
          content={SEO.description}
        />


        <meta
          property="og:type"
          content="website"
        />


        <meta
          property="og:url"
          content="https://lombok-piknik.vercel.app/"
        />


        <meta
          property="og:image"
          content="/images/og-image.jpg"
        />


        <meta
          name="twitter:card"
          content="summary_large_image"
        />


        <script type="application/ld+json">
          {JSON.stringify(travelAgencySchema)}
        </script>


        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>



        {productSchema.map((schema,index)=>(
          <script
            key={index}
            type="application/ld+json"
          >
            {JSON.stringify(schema)}
          </script>
        ))}


      </Helmet>



      <Navbar />


      <Routes>
        <Route path="/tours" element={<Tours />} />

        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/tour/:slug"
          element={<TourDetail />}
        />

      </Routes>


      <Footer />

    </>
  );
}


export default App;