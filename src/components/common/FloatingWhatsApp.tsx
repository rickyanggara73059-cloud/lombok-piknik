import { MessageCircle } from "lucide-react";
import { SITE } from "../../config/site";

export default function FloatingWhatsApp() {
  const message = `Hello ${SITE.name}! I'd like to ask about your tour packages and booking availability. Could you please help me?`;

  return (
    <a
      data-floating-whatsapp="true"
      href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp about tour packages and bookings (opens in a new tab)"
      title="Chat on WhatsApp"
      className="fixed z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-colors hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-600"
      style={{
        right: "max(1.25rem, env(safe-area-inset-right, 0px))",
        bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  );
}
