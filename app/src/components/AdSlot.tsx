import type { Locale } from "@/lib/types";
import { getDict } from "@/lib/i18n";

/**
 * Placeholder ad slot. Replace the inner markup with the AdSense unit once
 * approved (see PROJECT_PLAN.md Phase 8). Kept unobtrusive by design.
 */
export default function AdSlot({
  locale,
  label,
}: {
  locale: Locale;
  label?: string;
}) {
  const t = getDict(locale);
  return (
    <div
      className="flex min-h-[90px] items-center justify-center rounded-card border border-dashed border-border bg-surface-muted/60 text-xs font-medium uppercase tracking-widest text-muted"
      aria-hidden="true"
    >
      {label ?? t.ad}
    </div>
  );
}
