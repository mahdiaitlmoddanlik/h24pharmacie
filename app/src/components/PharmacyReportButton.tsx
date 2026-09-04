"use client";

import { useState } from "react";
import type { DutyPharmacy, Locale } from "@/lib/types";
import { getDict } from "@/lib/i18n";
import { FlagIcon } from "@/components/Icons";
import ReportIssueModal from "@/components/ReportIssueModal";

export default function PharmacyReportButton({
  pharmacy,
  cityId,
  locale,
}: {
  pharmacy: DutyPharmacy;
  cityId: string;
  locale: Locale;
}) {
  const t = getDict(locale);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-danger"
      >
        <FlagIcon className="text-base" />
        {t.reportIssue}
      </button>
      {open && (
        <ReportIssueModal
          pharmacy={pharmacy}
          cityId={cityId}
          locale={locale}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
