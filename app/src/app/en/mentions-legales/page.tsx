import type { Metadata } from "next";
import MentionsLegalesContent from "@/components/MentionsLegalesContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Legal Notice & Privacy Policy — H24 Pharmacie",
  description:
    "Legal notices, terms of use, medical disclaimer, and privacy policy for the H24 Pharmacie platform in Morocco.",
  alternates: {
    canonical: absoluteUrl("/en/mentions-legales"),
    languages: {
      fr: absoluteUrl("/mentions-legales"),
      ar: absoluteUrl("/ar/mentions-legales"),
      en: absoluteUrl("/en/mentions-legales"),
      es: absoluteUrl("/es/mentions-legales"),
    },
  },
};

export default function Page() {
  return <MentionsLegalesContent locale="en" />;
}
