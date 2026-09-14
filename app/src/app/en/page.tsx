import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "H24 Pharmacie — Duty Pharmacies in Morocco (24/7, Night & Day)",
  description:
    "Quickly find an open duty pharmacy in Morocco today (open 24/7, day and night): exact addresses, direct phone numbers, and GPS navigation via Google Maps & Waze.",
  alternates: {
    canonical: absoluteUrl("/en"),
    languages: {
      fr: absoluteUrl("/"),
      ar: absoluteUrl("/ar"),
      en: absoluteUrl("/en"),
      es: absoluteUrl("/es"),
    },
  },
  openGraph: {
    title: "H24 Pharmacie — Duty Pharmacies in Morocco (24/7, Night & Day)",
    description:
      "Quickly find verified on-duty pharmacies open near you in Morocco: exact addresses, direct phone numbers, and GPS routes.",
    url: absoluteUrl("/en"),
    siteName: "H24 Pharmacie",
    locale: "en_US",
    type: "website",
    images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <HomeContent locale="en" />;
}
