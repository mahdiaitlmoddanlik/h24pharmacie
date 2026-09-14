import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contacto — H24 Pharmacie Marruecos",
  description:
    "Contacta con el equipo de H24 Pharmacie Marruecos en contact@h24pharmacie.com. Verificación de farmacias, avisos de errores y consultas.",
  alternates: {
    canonical: absoluteUrl("/es/contact"),
    languages: {
      fr: absoluteUrl("/contact"),
      ar: absoluteUrl("/ar/contact"),
      en: absoluteUrl("/en/contact"),
      es: absoluteUrl("/es/contact"),
    },
  },
};

export default function ContactPageEs() {
  return <ContactContent locale="es" />;
}
