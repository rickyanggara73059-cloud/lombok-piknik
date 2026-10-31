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
        <div className="text-center">
          <a
            href="https://maps.app.goo.gl/4iSGd6bpN4yi3uBU6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-yellow-400 px-6 py-3 text-center font-bold text-black transition hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-500"
          >
            Read Our Reviews on Google
          </a>
        </div>
      </Container>
    </section>
  );
}
