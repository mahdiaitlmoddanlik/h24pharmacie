import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Farmacia Abierta Cerca de Mí en Marruecos — Guardia 24h y Noche | H24 Pharmacie",
  description:
    "Encuentra rápidamente una farmacia abierta cerca de ti en Marruecos (guardia 24 horas, noche y día): teléfonos directos, direcciones exactas y rutas GPS Google Maps y Waze.",
  alternates: {
    canonical: absoluteUrl("/es"),
    languages: {
      fr: absoluteUrl("/"),
      ar: absoluteUrl("/ar"),
      en: absoluteUrl("/en"),
      es: absoluteUrl("/es"),
    },
  },
  openGraph: {
    title: "Farmacia Abierta Cerca de Mí en Marruecos — Guardia 24h y Noche | H24 Pharmacie",
    description:
      "Encuentra rápidamente una farmacia abierta cerca de ti en Marruecos (guardia 24 horas, noche y día): teléfonos directos, direcciones exactas y rutas GPS Google Maps y Waze.",
    url: absoluteUrl("/es"),
    siteName: "H24 Pharmacie",
    locale: "es_ES",
    type: "website",
    images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <HomeContent locale="es" />;
}
