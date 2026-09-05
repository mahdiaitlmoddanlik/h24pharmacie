import Link from "next/link";
import type { DutyPharmacy, Locale } from "@/lib/types";
import { getDict, pharmacyHref } from "@/lib/i18n";
import {
  buildGoogleMapsDirectionsUrl,
  buildTelUrl,
  buildWazeUrl,
  buildWhatsAppUrl,
  formatDistance,
} from "@/lib/geo";
import {
  FlagIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  ShieldCheckIcon,
  WhatsAppIcon,
} from "@/components/Icons";

const periodStyles: Record<string, string> = {
  day: "bg-day-light text-amber-700",
  night: "bg-night-light text-indigo-700",
  "24h": "bg-primary-light text-primary-dark",
  unknown: "bg-surface-muted text-muted",
};

export default function PharmacyCard({
  pharmacy,
  locale,
  distanceKm,
  onReport,
}: {
  pharmacy: DutyPharmacy;
  locale: Locale;
  distanceKm?: number;
  onReport: (p: DutyPharmacy) => void;
}) {
  const t = getDict(locale);
  const verified =
    pharmacy.verificationStatus === "pharmacy_claimed" ||
    pharmacy.verificationStatus === "source_verified";
  const address =
    locale === "ar" && pharmacy.addressAr ? pharmacy.addressAr : pharmacy.address;

  const isMarrakechSyndicat = pharmacy.sourceUrl?.includes(
    "syndicat-pharmaciens-marrakech",
  );

  return (
    <article className="group rounded-card border border-border bg-surface p-4 shadow-soft transition hover:shadow-lift sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${periodStyles[pharmacy.period]}`}
            >
              {t.periods[pharmacy.period]}
            </span>
            {pharmacy.neighborhood && (
              <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                {pharmacy.neighborhood}
              </span>
            )}
            {verified && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isMarrakechSyndicat
                    ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-600/20"
                    : "bg-emerald-50 text-primary-dark"
                }`}
              >
                <ShieldCheckIcon
                  className={`text-sm ${isMarrakechSyndicat ? "text-emerald-600" : ""}`}
                />
                {isMarrakechSyndicat
                  ? locale === "ar"
                    ? "رسمي (نقابة مراكش)"
                    : "Officiel (Syndicat)"
                  : t.verification[pharmacy.verificationStatus]}
              </span>
            )}
          </div>
          <h3 className="mt-2 truncate text-lg font-extrabold tracking-tight text-foreground">
            <Link
              href={pharmacyHref(locale, pharmacy.cityId, pharmacy.slug)}
              className="transition hover:text-primary-dark"
            >
              {pharmacy.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-muted">
            <MapPinIcon className="mt-0.5 shrink-0 text-base" />
            <span>{address}</span>
          </p>
        </div>

        {typeof distanceKm === "number" && (
          <span className="shrink-0 rounded-xl bg-surface-muted px-2.5 py-1 text-center text-xs font-bold text-foreground">
            {formatDistance(distanceKm, locale)}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <a
          href={buildTelUrl(pharmacy.phone)}
          className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark sm:col-span-1"
        >
          <PhoneIcon className="text-base" />
          {t.call}
        </a>
        <a
          href={buildGoogleMapsDirectionsUrl(pharmacy.latitude, pharmacy.longitude)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-muted px-3 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
        >
          <MapPinIcon className="text-base text-accent" />
          {t.directions}
        </a>
        <a
          href={buildWazeUrl(pharmacy.latitude, pharmacy.longitude)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-muted px-3 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
        >
          <NavigationIcon className="text-base text-sky-500" />
          {t.waze}
        </a>
        {pharmacy.whatsapp ? (
          <a
            href={buildWhatsAppUrl(pharmacy.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-muted px-3 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
          >
            <WhatsAppIcon className="text-base text-[#25D366]" />
            {t.whatsapp}
          </a>
        ) : (
          <span className="hidden sm:block" />
        )}
      </div>

      <div className="mt-3 flex items-center justify-end">
        <button
          type="button"
          onClick={() => onReport(pharmacy)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-danger"
        >
          <FlagIcon className="text-sm" />
          {t.reportIssue}
        </button>
      </div>
    </article>
  );
}
