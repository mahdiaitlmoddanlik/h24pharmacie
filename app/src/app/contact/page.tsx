import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contactez-nous — H24 Pharmacie Maroc",
  description:
    "Contactez l'équipe H24 Pharmacie Maroc : contact@h24pharmacie.com. Demandes de vérification d'officines, signalements d'erreurs et partenariats.",
  alternates: {
    canonical: absoluteUrl("/contact"),
    languages: {
      fr: absoluteUrl("/contact"),
      ar: absoluteUrl("/ar/contact"),
    },
  },
};

export default function ContactPage() {
  return <ContactContent locale="fr" />;
}
