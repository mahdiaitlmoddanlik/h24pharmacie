import type { Metadata } from "next";
import MentionsLegalesContent from "@/components/MentionsLegalesContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mentions légales & Politique de confidentialité",
  description:
    "Mentions légales, conditions d'utilisation, avertissement médical et politique de confidentialité du service Pharmacies de Garde Maroc.",
  alternates: {
    canonical: absoluteUrl("/mentions-legales"),
    languages: {
      fr: absoluteUrl("/mentions-legales"),
      ar: absoluteUrl("/ar/mentions-legales"),
    },
  },
};

export default function Page() {
  return <MentionsLegalesContent locale="fr" />;
}
