import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import {
  cityHref,
  formatRelativeTime,
  getDict,
  homeHref,
  pharmacyHref,
} from "@/lib/i18n";
import {
  SOURCE,
  getCityBySlug,
  getDutyPharmacies,
  getPharmacyBySlug,
  lastUpdatedFor,
} from "@/lib/data";
import {
  buildGoogleMapsDirectionsUrl,
  buildTelUrl,
  buildWazeUrl,
  buildWhatsAppUrl,
} from "@/lib/geo";
import { breadcrumbJsonLd } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import PharmacyReportButton from "@/components/PharmacyReportButton";
import {
  ChevronRightIcon,
  ClockIcon,
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

export default async function PharmacyContent({
  locale,
  citySlug,
  pharmacySlug,
}: {
  locale: Locale;
  citySlug: string;
  pharmacySlug: string;
}) {
  const t = getDict(locale);
  const [city, pharmacy, duties, updated] = await Promise.all([
    getCityBySlug(citySlug),
    getPharmacyBySlug(citySlug, pharmacySlug),
    getDutyPharmacies(citySlug),
    lastUpdatedFor(citySlug),
  ]);
  if (!city) notFound();
  if (!pharmacy) notFound();

  const duty = duties.find((item) => item.id === pharmacy.id);
  const isOnDuty = Boolean(duty);

  const cityName = locale === "ar" ? city.nameAr : city.nameFr;
  const address =
    locale === "ar" && pharmacy.addressAr ? pharmacy.addressAr : pharmacy.address;
  const verified =
    pharmacy.verificationStatus === "pharmacy_claimed" ||
    pharmacy.verificationStatus === "source_verified";

  const jsonLd = breadcrumbJsonLd([
    { name: t.nav.home, url: homeHref(locale) },
    { name: cityName, url: cityHref(locale, city.slug) },
    { name: pharmacy.name, url: pharmacyHref(locale, city.slug, pharmacy.slug) },
  ]);

  return (
    <>
      <Header locale={locale} />

      <main className="flex-1 pb-24 sm:pb-0">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted">
            <Link href={homeHref(locale)} className="hover:text-primary-dark">
              {t.nav.home}
            </Link>
            <ChevronRightIcon className="text-sm rtl:rotate-180" />
            <Link
              href={cityHref(locale, city.slug)}
              className="hover:text-primary-dark"
            >
              {cityName}
            </Link>
            <ChevronRightIcon className="text-sm rtl:rotate-180" />
            <span className="text-foreground">{pharmacy.name}</span>
          </nav>

          <div className="rounded-card border border-border bg-surface p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {duty && (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${periodStyles[duty.period]}`}
                >
                  {t.periods[duty.period]}
                </span>
              )}
              {verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-primary-dark">
                  <ShieldCheckIcon className="text-sm" />
                  {t.verification[pharmacy.verificationStatus]}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {pharmacy.name}
            </h1>
            <p className="mt-2 flex items-start gap-2 text-muted">
              <MapPinIcon className="mt-0.5 shrink-0 text-lg" />
              <span>{address}</span>
            </p>
            {isOnDuty ? (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-foreground">
                <ClockIcon className="text-sm" />
                {t.lastUpdated}: {formatRelativeTime(updated, locale)} · {t.source}:{" "}
                {SOURCE.name}
              </p>
            ) : (
              <p className="mt-3 rounded-card border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                {t.notOnDuty}
              </p>
            )}

            {/* Desktop / inline actions */}
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <a
                href={buildTelUrl(pharmacy.phone)}
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark sm:col-span-1"
              >
                <PhoneIcon /> {t.call}
              </a>
              <a
                href={buildGoogleMapsDirectionsUrl(
                  pharmacy.latitude,
                  pharmacy.longitude,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
              >
                <MapPinIcon className="text-accent" /> {t.directions}
              </a>
              <a
                href={buildWazeUrl(pharmacy.latitude, pharmacy.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
              >
                <NavigationIcon className="text-sky-500" /> {t.waze}
              </a>
              {pharmacy.whatsapp && (
                <a
                  href={buildWhatsAppUrl(pharmacy.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
                >
                  <WhatsAppIcon className="text-[#25D366]" /> {t.whatsapp}
                </a>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-card border border-border shadow-soft">
            <iframe
              title={pharmacy.name}
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${pharmacy.latitude},${pharmacy.longitude}&hl=${locale}&z=15&output=embed`}
            />
          </div>

          {duty && (
            <div className="flex justify-end">
              <PharmacyReportButton pharmacy={duty} cityId={city.id} locale={locale} />
            </div>
          )}

          <Disclaimer locale={locale} />
        </div>
      </main>

      {/* Sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-3xl gap-2">
          <a
            href={buildTelUrl(pharmacy.phone)}
            className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white"
          >
            <PhoneIcon /> {t.call}
          </a>
          <a
            href={buildGoogleMapsDirectionsUrl(
              pharmacy.latitude,
              pharmacy.longitude,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground"
          >
            <MapPinIcon className="text-accent" /> {t.directions}
          </a>
        </div>
      </div>

      <Footer locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
