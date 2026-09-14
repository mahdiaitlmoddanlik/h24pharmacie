import type { Metadata } from "next";
import MentionsLegalesContent from "@/components/MentionsLegalesContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Aviso Legal y Política de Privacidad — H24 Pharmacie",
  description:
    "Aviso legal, términos de uso, advertencia médica y política de privacidad de la plataforma H24 Pharmacie Marruecos.",
  alternates: {
    canonical: absoluteUrl("/es/mentions-legales"),
    languages: {
      fr: absoluteUrl("/mentions-legales"),
      ar: absoluteUrl("/ar/mentions-legales"),
      en: absoluteUrl("/en/mentions-legales"),
      es: absoluteUrl("/es/mentions-legales"),
    },
  },
};

export default function Page() {
  return <MentionsLegalesContent locale="es" />;
}
