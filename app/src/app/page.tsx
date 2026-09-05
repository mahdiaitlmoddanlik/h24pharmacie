import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "H24 Pharmacie — Pharmacies de Garde au Maroc (24h/24, Nuit & Jour)",
  description:
    "Trouvez la pharmacie de garde ouverte aujourd'hui au Maroc (24h/24, nuit et jour) : adresses précises, téléphones directs et itinéraires GPS Google Maps / Waze.",
  alternates: {
    canonical: absoluteUrl("/"),
    languages: { fr: absoluteUrl("/"), ar: absoluteUrl("/ar") },
  },
  openGraph: {
    title: "H24 Pharmacie — Pharmacies de Garde au Maroc (24h/24, Nuit & Jour)",
    description:
      "Trouvez rapidement une pharmacie de garde ouverte près de vous au Maroc : adresses, téléphones directs et itinéraires GPS.",
    url: absoluteUrl("/"),
    siteName: "H24 Pharmacie",
    locale: "fr_MA",
    type: "website",
    images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <HomeContent locale="fr" />;
}
