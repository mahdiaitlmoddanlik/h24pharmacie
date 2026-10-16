import Link from "next/link";
import { permanentRedirect } from "next/navigation";
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
  SOURCE,
  getCities,
  getCityPharmacies,
  getCityBySlug,
  getDutyPharmacies,
  lastUpdatedFor,
} from "@/lib/data";
import { getCityZones } from "@/lib/data/city-zones";
import { getZonesForCity, getZoneName } from "@/lib/data/neighborhoods";
import { getCityFaqs, getFaqSectionMeta } from "@/lib/faqs";
import { breadcrumbJsonLd, cityJsonLd, faqJsonLd } from "@/lib/seo";
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

export default async function CityContent({
  locale,
  citySlug,
}: {
  locale: Locale;
  citySlug: string;
}) {
  const cleanCitySlug = citySlug?.trim();
  const t = getDict(locale);
  const [city, duties, allPharmacies, updated, allCities] = await Promise.all([
    getCityBySlug(cleanCitySlug),
    getDutyPharmacies(cleanCitySlug),
    getCityPharmacies(cleanCitySlug),
    lastUpdatedFor(cleanCitySlug),
    getCities(),
  ]);
  if (!city) {
    permanentRedirect(homeHref(locale));
  }

  const cityName = locale === "ar" ? city.nameAr : city.nameFr;
  const related = allCities.filter((c) => c.id !== city.id);

  const cityCanonicalZones = getZonesForCity(city.slug);
  const cityFaqs = getCityFaqs(locale, cityName);
  const faqMeta = getFaqSectionMeta(locale, cityName);

  const jsonLd = [
    cityJsonLd(city, locale, duties),
    faqJsonLd(cityFaqs),
    breadcrumbJsonLd([
      { name: t.nav.home, url: homeHref(locale) },
      { name: cityName, url: cityHref(locale, city.slug) },
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
              <span className="text-white">{cityName}</span>
            </nav>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {t.cityTitle(cityName)}
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
          <DutyList
            city={city}
            duties={duties}
            allPharmacies={allPharmacies}
            locale={locale}
            sourceZones={getCityZones(city.slug)}
          />

          <AdSlot locale={locale} />

          <Disclaimer locale={locale} />

          {/* Source / exact timestamp block */}
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

          {/* Neighborhood SEO Landing Pages internal linking */}
          {cityCanonicalZones.length > 0 && (
            <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
              <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                {t.neighborhoodsInCity(cityName)}
              </h2>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                {locale === "ar"
                  ? `اختر حيك في ${cityName} للوصول السريع إلى صيدليات الحراسة الأقرب إليك:`
                  : locale === "en"
                  ? `Select your neighborhood in ${cityName} to find duty pharmacies nearby:`
                  : locale === "es"
                  ? `Seleccione su barrio en ${cityName} para consultar las farmacias de guardia más cercanas:`
                  : `Sélectionnez votre quartier à ${cityName} pour trouver directement les pharmacies de garde les plus proches :`}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {cityCanonicalZones.map((z) => (
                  <Link
                    key={z.slug}
                    href={zoneHref(locale, city.slug, z.slug)}
                    className="rounded-full border border-border bg-surface-muted/50 px-3.5 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary hover:bg-emerald-50/50 hover:text-primary-dark sm:text-sm"
                  >
                    {getZoneName(z, locale)}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* SEO FAQ Section */}
          <section className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {faqMeta.title}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {faqMeta.subtitle}
            </p>
            <div className="mt-6">
              <FaqAccordion items={cityFaqs} />
            </div>
          </section>

          {/* Related cities */}
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
