import { faq } from "../data/faq";

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",

  mainEntity: faq.map((item) => ({
    "@type": "Question",

    name: item.question,

    acceptedAnswer: {
      "@type": "Answer",

      text: item.answer,
    },
  })),
};