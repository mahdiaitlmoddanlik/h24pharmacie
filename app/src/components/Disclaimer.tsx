import type { Locale } from "@/lib/types";
import { getDict } from "@/lib/i18n";
import { AlertTriangleIcon } from "@/components/Icons";

export default function Disclaimer({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <div className="flex items-start gap-3 rounded-card border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <AlertTriangleIcon className="mt-0.5 shrink-0 text-xl text-amber-500" />
      <div>
        <p className="text-sm font-bold">{t.disclaimerTitle}</p>
        <p className="mt-0.5 text-sm leading-relaxed">{t.disclaimer}</p>
      </div>
    </div>
  );
}
