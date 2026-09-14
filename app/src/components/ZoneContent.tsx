import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import {
  cityHref,
  formatDateTime,
  formatRelativeTime,
  getDict,
  homeHref,
  legalHref,
  zoneHref,
} from "@/lib/i18n";
import {
  getCities,
  getCityBySlug,
  getDutyPharmacies,
  lastUpdatedFor,
} from "@/lib/data";
import { getCityZones } from "@/lib/data/city-zones";
import {
  getZoneBySlug,
  getZoneName,
  getZonesForCity,
  matchesZone,
} from "@/lib/data/neighborhoods";
import { getFaqSectionMeta, getZoneFaqs } from "@/lib/faqs";
import { breadcrumbJsonLd, faqJsonLd, zoneJsonLd } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import DutyList from "@/components/DutyList";
import AdSlot from "@/components/AdSlot";
import FaqAccordion from "@/components/FaqAccordion";
import {
  ChevronRightIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

export default async function ZoneContent({
  locale,
  citySlug,
  zoneSlug,
}: {
  locale: Locale;
  citySlug: string;
  zoneSlug: string;
}) {
  const t = getDict(locale);
  const [city, zone, duties, updated, allCities] = await Promise.all([
    getCityBySlug(citySlug),
    Promise.resolve(getZoneBySlug(citySlug, zoneSlug)),
    getDutyPharmacies(citySlug),
    lastUpdatedFor(citySlug),
    getCities(),
  ]);

  if (!city || !zone) notFound();

  const cityName = locale === "ar" ? city.nameAr : city.nameFr;
  const zoneName = getZoneName(zone, locale);
  const siblingZones = getZonesForCity(citySlug).filter((z) => z.slug !== zone.slug);
  const related = allCities.filter((c) => c.id !== city.id);

  const zoneDuties = duties.filter((p) => matchesZone(p.neighborhood, zone));
  const hasSpecificDuties = zoneDuties.length > 0;

  const zoneFaqs = getZoneFaqs(locale, cityName, zoneName);
  const faqMeta = getFaqSectionMeta(locale, `${zoneName} (${cityName})`);

  const jsonLd = [
    zoneJsonLd(city, zone, locale, hasSpecificDuties ? zoneDuties : duties),
    faqJsonLd(zoneFaqs),
    breadcrumbJsonLd([
      { name: t.nav.home, url: homeHref(locale) },
      { name: cityName, url: cityHref(locale, city.slug) },
      { name: zoneName, url: zoneHref(locale, city.slug, zone.slug) },
    ]),
  ];

  return (
    <>
      <Header locale={locale} />

      <main className="flex-1">
        {/* Title band */}
        <section className="border-b border-emerald-900/10 bg-gradient-to-b from-primary-dark to-primary px-4 pb-7 pt-6 text-white">
          <div className="mx-auto max-w-3xl">
            <nav className="flex items-center gap-1.5 text-xs font-medium text-emerald-100">
              <Link href={homeHref(locale)} className="hover:text-white">
                {t.nav.home}
              </Link>
              <ChevronRightIcon className="text-sm rtl:rotate-180" />
              <Link href={cityHref(locale, city.slug)} className="hover:text-white">
                {cityName}
              </Link>
              <ChevronRightIcon className="text-sm rtl:rotate-180" />
              <span className="text-white">{zoneName}</span>
            </nav>

            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {t.zoneTitle(zoneName, cityName)}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {updated && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">
                  <ClockIcon className="text-sm" />
                  {t.lastUpdated}: {formatRelativeTime(updated, locale)}
                </span>
              )}
              <Link
                href={legalHref(locale)}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-400/40 transition hover:bg-emerald-400/30 hover:text-white"
              >
                <ShieldCheckIcon className="text-sm text-emerald-300" />
                {locale === "ar" ? "قائمة حراسة مؤكدة" : "Garde vérifiée"}
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
          {/* Reassurance banner if no pharmacy specifically assigned to this sub-zone today */}
          {!hasSpecificDuties && duties.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900 sm:text-sm">
              <p className="font-semibold">{t.noZoneDuties(zoneName, cityName)}</p>
            </div>
          )}

          <DutyList
            city={city}
            duties={duties}
            locale={locale}
            sourceZones={getCityZones(city.slug)}
            initialNeighborhood={hasSpecificDuties ? zone.nameFr : undefined}
          />

          <AdSlot locale={locale} />

          <Disclaimer locale={locale} />

          {/* Source / SEO Intro */}
          <div className="rounded-card border border-border bg-surface p-5 text-sm text-muted shadow-soft">
            {updated ? (
              <p>
                <strong className="font-semibold text-foreground">
                  {t.lastUpdated}:
                </strong>{" "}
                {formatDateTime(updated, locale)} ·{" "}
                <Link
                  href={legalHref(locale)}
                  className="text-primary-dark underline hover:opacity-80"
                >
                  {locale === "ar"
                    ? "مصادر البيانات والمعلومات القانونية"
                    : "Sources & Mentions légales"}
                </Link>
              </p>
            ) : (
              <p className="font-medium text-foreground">{t.dutyUnavailable}</p>
            )}
            <p className="mt-2 leading-relaxed">{t.seoIntro(cityName)}</p>
          </div>

          {/* Sibling Neighborhoods in the same city */}
          {siblingZones.length > 0 && (
            <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
              <h2 className="mb-3 text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                {t.otherNeighborhoods(cityName)}
              </h2>
              <div className="flex flex-wrap gap-2">
                {siblingZones.map((sz) => (
                  <Link
                    key={sz.slug}
                    href={zoneHref(locale, city.slug, sz.slug)}
                    className="rounded-full border border-border bg-surface-muted/50 px-3.5 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary hover:bg-emerald-50/50 hover:text-primary-dark sm:text-sm"
                  >
                    {getZoneName(sz, locale)}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Collapsible FAQ Section */}
          <section className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {faqMeta.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{faqMeta.subtitle}</p>
            <div className="mt-6">
              <FaqAccordion items={zoneFaqs} />
            </div>
          </section>

          {/* Other cities */}
          <section>
            <h2 className="mb-3 text-lg font-extrabold tracking-tight text-foreground">
              {t.relatedCities}
            </h2>
            <div className="flex flex-wrap gap-2">
              {related.map((c) => (
                <Link
                  key={c.id}
                  href={cityHref(locale, c.slug)}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary-dark"
                >
                  {locale === "ar" ? c.nameAr : c.nameFr}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
