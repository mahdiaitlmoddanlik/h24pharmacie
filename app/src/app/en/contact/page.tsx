import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us — H24 Pharmacie Morocco",
  description:
    "Contact the H24 Pharmacie Morocco team at contact@h24pharmacie.com. Duty pharmacy verification requests, error reports, and inquiries.",
  alternates: {
    canonical: absoluteUrl("/en/contact"),
    languages: {
      fr: absoluteUrl("/contact"),
      ar: absoluteUrl("/ar/contact"),
      en: absoluteUrl("/en/contact"),
      es: absoluteUrl("/es/contact"),
    },
  },
};

export default function ContactPageEn() {
  return <ContactContent locale="en" />;
}
