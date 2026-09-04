import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "صيدليات الحراسة بالمغرب — صيدلية مفتوحة الآن",
  description:
    "اعثر بسرعة على صيدلية حراسة مفتوحة بالقرب منك في المغرب: العناوين، الهواتف، والاتجاهات عبر خرائط Google وWaze.",
  alternates: {
    canonical: absoluteUrl("/ar"),
    languages: { fr: absoluteUrl("/"), ar: absoluteUrl("/ar") },
  },
};

export default function Page() {
  return <HomeContent locale="ar" />;
}
