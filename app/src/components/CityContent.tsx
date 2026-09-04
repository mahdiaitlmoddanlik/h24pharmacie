import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import {
  cityHref,
  formatDateTime,
  formatRelativeTime,
  getDict,
  homeHref,
} from "@/lib/i18n";
import {
  SOURCE,
  getCities,
  getCityBySlug,
  getDutyPharmacies,
  lastUpdatedFor,
} from "@/lib/data";
import { getCityZones } from "@/lib/data/city-zones";
import { breadcrumbJsonLd, cityJsonLd } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import DutyList from "@/components/DutyList";
import AdSlot from "@/components/AdSlot";
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
  const t = getDict(locale);
  const [city, duties, updated, allCities] = await Promise.all([
    getCityBySlug(citySlug),
    getDutyPharmacies(citySlug),
    lastUpdatedFor(citySlug),
    getCities(),
  ]);
  if (!city) notFound();

  const cityName = locale === "ar" ? city.nameAr : city.nameFr;
  const related = allCities.filter((c) => c.id !== city.id);

  const jsonLd = [
    cityJsonLd(city, locale, duties),
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
              <a
                href={SOURCE.baseUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/25 transition hover:bg-white/25"
              >
                <ShieldCheckIcon className="text-sm" />
                {t.source}: {SOURCE.name}
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
          <DutyList
            city={city}
            duties={duties}
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
                  {t.source}:
                </strong>{" "}
                <a
                  href={SOURCE.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-primary-dark underline"
                >
                  {SOURCE.name}
                </a>{" "}
                · {t.lastUpdated}: {formatDateTime(updated, locale)}
              </p>
            ) : (
              <p className="font-medium text-foreground">{t.dutyUnavailable}</p>
            )}
            <p className="mt-2 leading-relaxed">{t.seoIntro(cityName)}</p>
          </div>

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
