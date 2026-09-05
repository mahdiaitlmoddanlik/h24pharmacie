import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "اتصل بنا — H24 Pharmacie صيدليات الحراسة بالمغرب",
  description:
    "تواصل مع فريق H24 Pharmacie عبر البريد الإلكتروني contact@h24pharmacie.com. تصحيح المعلومات، تحديث جداول الحراسة، والاستفسارات العامة.",
  alternates: {
    canonical: absoluteUrl("/ar/contact"),
    languages: {
      fr: absoluteUrl("/contact"),
      ar: absoluteUrl("/ar/contact"),
    },
  },
};

export default function ContactPageAr() {
  return <ContactContent locale="ar" />;
}
