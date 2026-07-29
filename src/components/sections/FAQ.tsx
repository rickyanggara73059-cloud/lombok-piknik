import { useState } from "react";

import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";

import { faq } from "../../data/faq";

import { Plus, Minus } from "lucide-react";


export default function FAQ() {

  const [active, setActive] = useState<string | null>(null);


  return (
    <section
      id="faq"
      className="bg-gray-50 py-24"
    >

      <Container>

        <SectionTitle
          subtitle="FAQ"
          title="Frequently Asked Questions"
          description="Find answers about our Lombok tour packages and services."
        />


        <div className="mx-auto max-w-4xl space-y-4">

          {faq.map((item) => (

            <div
              key={item.id}
              className="
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-sm
              "
            >

              <button
                onClick={() =>
                  setActive(
                    active === item.id
                      ? null
                      : item.id
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  p-6
                  text-left
                  font-bold
                  text-gray-900
                "
              >

                <span>
                  {item.question}
                </span>


                {active === item.id ? (
                  <Minus
                    className="text-yellow-500"
                  />
                ) : (
                  <Plus
                    className="text-yellow-500"
                  />
                )}

              </button>


              {active === item.id && (

                <div className="px-6 pb-6 text-gray-600">
                  {item.answer}
                </div>

              )}

            </div>

          ))}

        </div>


      </Container>

    </section>
  );
}