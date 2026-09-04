"use client";

import { useEffect, useState } from "react";
import type { DutyPharmacy, Locale, ReportIssueType } from "@/lib/types";
import { getDict } from "@/lib/i18n";
import { CheckCircleIcon, CloseIcon } from "@/components/Icons";

const ISSUE_TYPES: ReportIssueType[] = [
  "closed",
  "not_on_duty",
  "wrong_phone",
  "wrong_address",
  "other",
];

export default function ReportIssueModal({
  pharmacy,
  cityId,
  locale,
  onClose,
}: {
  pharmacy: DutyPharmacy;
  cityId: string;
  locale: Locale;
  onClose: () => void;
}) {
  const t = getDict(locale);
  const [issueType, setIssueType] = useState<ReportIssueType>("closed");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacyId: pharmacy.id,
          cityId,
          issueType,
          message,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-fade-up rounded-t-3xl bg-surface p-5 shadow-lift sm:rounded-3xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-foreground">
              {t.report.title}
            </h2>
            <p className="mt-0.5 text-sm text-muted">{t.report.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted transition hover:bg-surface-muted"
            aria-label={t.report.close}
          >
            <CloseIcon className="text-xl" />
          </button>
        </div>

        <p className="mt-3 rounded-xl bg-surface-muted px-3 py-2 text-sm font-semibold text-foreground">
          {pharmacy.name}
        </p>

        {state === "done" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircleIcon className="text-5xl text-success" />
            <p className="text-lg font-bold text-foreground">
              {t.report.success}
            </p>
            <p className="text-sm text-muted">{t.report.successSub}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              {t.report.close}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">
                {t.report.type}
              </label>
              <div className="flex flex-wrap gap-2">
                {ISSUE_TYPES.map((it) => (
                  <button
                    key={it}
                    type="button"
                    onClick={() => setIssueType(it)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      issueType === it
                        ? "bg-primary text-white"
                        : "bg-surface-muted text-foreground hover:bg-slate-200"
                    }`}
                  >
                    {t.report.types[it]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="report-message"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                {t.report.message}
              </label>
              <textarea
                id="report-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder={t.report.messagePlaceholder}
                className="w-full resize-none rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>

            {state === "error" && (
              <p className="text-sm font-medium text-danger">{t.report.error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
              >
                {t.report.cancel}
              </button>
              <button
                type="submit"
                disabled={state === "sending"}
                className="flex-[2] rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
              >
                {state === "sending" ? t.report.submitting : t.report.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
