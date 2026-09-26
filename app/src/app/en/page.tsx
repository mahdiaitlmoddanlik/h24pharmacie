import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pharmacy Near Me Open Now in Morocco — 24/7 Duty Pharmacies | H24 Pharmacie",
  description:
    "Find a nearby pharmacy open now in Morocco (open 24/7, night and day): verified duty schedules, direct phone numbers, and 1-tap GPS directions on Google Maps & Waze.",
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
    title: "Pharmacy Near Me Open Now in Morocco — 24/7 Duty Pharmacies | H24 Pharmacie",
    description:
      "Find a nearby pharmacy open now in Morocco (open 24/7, night and day): verified duty schedules, direct phone numbers, and 1-tap GPS directions on Google Maps & Waze.",
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
