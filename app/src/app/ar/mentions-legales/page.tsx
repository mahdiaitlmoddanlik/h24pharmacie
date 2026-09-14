import type { Metadata } from "next";
import MentionsLegalesContent from "@/components/MentionsLegalesContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "المعلومات القانونية وسياسة الخصوصية",
  description:
    "الشروط القانونية، شروط الاستخدام، إخلاء المسؤولية الطبية وسياسة الخصوصية لمنصة صيدليات الحراسة المغرب.",
  alternates: {
    canonical: absoluteUrl("/ar/mentions-legales"),
    languages: {
      fr: absoluteUrl("/mentions-legales"),
      ar: absoluteUrl("/ar/mentions-legales"),
      en: absoluteUrl("/en/mentions-legales"),
      es: absoluteUrl("/es/mentions-legales"),
    },
  },
};

export default function Page() {
  return <MentionsLegalesContent locale="ar" />;
}
