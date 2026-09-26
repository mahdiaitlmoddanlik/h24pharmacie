import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pharmacie de Garde Ouverte Aujourd'hui au Maroc (24h/24 & Nuit) — H24 Pharmacie",
  description:
    "Trouvez la pharmacie de garde ouverte maintenant près de vous au Maroc (nuit, jour, 24h/24) : adresses précises, numéros de téléphone directs et itinéraires GPS Google Maps et Waze.",
  alternates: {
    canonical: absoluteUrl("/"),
    languages: {
      fr: absoluteUrl("/"),
      ar: absoluteUrl("/ar"),
      en: absoluteUrl("/en"),
      es: absoluteUrl("/es"),
    },
  },
  openGraph: {
    title: "Pharmacie de Garde Ouverte Aujourd'hui au Maroc (24h/24 & Nuit) — H24 Pharmacie",
    description:
      "Trouvez la pharmacie de garde ouverte maintenant près de vous au Maroc (nuit, jour, 24h/24) : adresses précises, numéros de téléphone directs et itinéraires GPS.",
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
