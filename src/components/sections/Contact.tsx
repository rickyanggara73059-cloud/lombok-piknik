import { useState } from "react";

import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";

import { SITE } from "../../config/site";
import { products } from "../../data/products";


export default function Contact() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    package: "",
    message: "",
  });


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }


  function sendWhatsApp() {

    const text = `
Hello Lombok Piknik 👋

Name:
${form.name}

WhatsApp:
${form.phone}

Tour Package:
${form.package}

Message:
${form.message}
    `;


    const url =
      `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;


    window.open(url, "_blank");

  }


  return (
    <section
      id="contact"
      className="bg-white py-24"
    >

      <Container>

        <SectionTitle
          subtitle="Contact Us"
          title="Plan Your Lombok Adventure"
          description="Tell us your travel plan and our local team will help arrange your perfect trip."
        />


        <div className="
          mx-auto
          max-w-3xl
          rounded-3xl
          bg-gray-50
          p-8
          shadow-lg
          md:p-12
        ">


          <div className="space-y-5">


            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-4
                outline-none
                focus:border-yellow-400
              "
            />


            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="WhatsApp Number"
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-4
                outline-none
                focus:border-yellow-400
              "
            />


            <select
              name="package"
              value={form.package}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-4
                outline-none
                focus:border-yellow-400
              "
            >

              <option value="">
                Select Tour Package
              </option>


              {products.map((item) => (

                <option
                  key={item.id}
                  value={item.title}
                >
                  {item.title}
                </option>

              ))}


            </select>


            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Your message"
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-4
                outline-none
                focus:border-yellow-400
              "
            />


            <Button
              onClick={sendWhatsApp}
              className="w-full"
            >
              Send Booking Request
            </Button>


          </div>


        </div>


      </Container>

    </section>
  );
}