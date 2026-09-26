import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "صيدلية الحراسة مفتوحة الآن في المغرب (24/24 ليلاً ونهاراً) — H24 Pharmacie",
  description:
    "اعثر بسرعة على صيدلية حراسة مفتوحة الآن بالقرب منك في المغرب (24 ساعة، ليلاً ونهاراً): العناوين الدقيقة، أرقام الهواتف، والاتجاهات المباشرة عبر خرائط Google وWaze.",
  alternates: {
    canonical: absoluteUrl("/ar"),
    languages: {
      fr: absoluteUrl("/"),
      ar: absoluteUrl("/ar"),
      en: absoluteUrl("/en"),
      es: absoluteUrl("/es"),
    },
  },
  openGraph: {
    title: "صيدلية الحراسة مفتوحة الآن في المغرب (24/24 ليلاً ونهاراً) — H24 Pharmacie",
    description:
      "اعثر بسرعة على صيدلية حراسة مفتوحة الآن بالقرب منك في المغرب (24 ساعة، ليلاً ونهاراً): العناوين الدقيقة، أرقام الهواتف، والاتجاهات المباشرة.",
    url: absoluteUrl("/ar"),
    siteName: "H24 Pharmacie",
    locale: "ar_MA",
    type: "website",
    images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <HomeContent locale="ar" />;
}
