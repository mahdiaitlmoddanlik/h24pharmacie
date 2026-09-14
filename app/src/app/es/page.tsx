import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "H24 Pharmacie — Farmacias de Guardia en Marruecos (24h/24, Noche y Día)",
  description:
    "Encuentra rápidamente la farmacia de guardia abierta hoy en Marruecos (24 horas, noche y día): direcciones precisas, teléfonos directos y rutas GPS Google Maps y Waze.",
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
    title: "H24 Pharmacie — Farmacias de Guardia en Marruecos (24h/24, Noche y Día)",
    description:
      "Encuentra rápidamente farmacias de guardia abiertas cerca de ti en Marruecos: direcciones exactas, teléfonos y rutas GPS.",
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
