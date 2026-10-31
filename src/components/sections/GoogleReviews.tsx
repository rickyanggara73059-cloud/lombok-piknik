import { ArrowUpRight, Star } from "lucide-react";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";

export default function GoogleReviews() {
  return (
    <section id="google-reviews" className="bg-gray-50 py-24">
      <Container>
        <SectionTitle
          subtitle="Google Reviews"
          title="Trusted by Our Travelers"
        />
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-gray-100 bg-white px-6 py-10 text-center shadow-lg sm:px-12 sm:py-12">
          <div className="absolute inset-x-0 top-0 h-1 bg-yellow-400" aria-hidden="true" />
          <div className="inline-flex items-center gap-3 rounded-full border border-gray-100 bg-gray-50 px-5 py-3">
            <span className="text-2xl font-bold leading-none" aria-hidden="true">
              <span className="text-blue-600">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-600">g</span><span className="text-green-600">l</span><span className="text-red-500">e</span>
            </span>
            <span className="text-sm font-bold text-gray-700">Google Reviews</span>
          </div>
          <div className="mt-7 flex justify-center gap-2 text-yellow-400" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={24} fill="currentColor" strokeWidth={1.5} />
            ))}
          </div>
          <h3 className="mt-6 text-2xl font-black text-gray-900 sm:text-3xl">
            Real journeys. Personal stories.
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
            Discover travelers' own experiences exploring with Lombok Awesome Tour.
            Read their stories on Google as you plan your next adventure.
          </p>
          <a
            href="https://maps.app.goo.gl/4iSGd6bpN4yi3uBU6"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 py-4 text-center text-sm font-bold text-black transition hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-500 sm:w-auto sm:px-8 sm:text-base"
          >
            Read Our Reviews on Google
            <ArrowUpRight size={18} className="shrink-0" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
}
