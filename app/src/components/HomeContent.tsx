import Link from "next/link";
import type { Locale } from "@/lib/types";
import { cityHref, getDict } from "@/lib/i18n";
import { formatMoroccoDate } from "@/lib/dates";
import { getCities, getDutyPharmacies } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CitySearch from "@/components/CitySearch";
import Disclaimer from "@/components/Disclaimer";
import AdSlot from "@/components/AdSlot";
import { ChevronRightIcon, ClockIcon, CrossIcon } from "@/components/Icons";

export default async function HomeContent({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const cities = await getCities();

  const cityStats = await Promise.all(
    cities.map(async (c) => ({
      city: c,
      count: (await getDutyPharmacies(c.slug)).length,
    })),
  );

  return (
    <>
      <Header locale={locale} />

      <main className="flex-1">
        {/* Hero */}
        <section className="hero-bg relative overflow-hidden">
          <div className="mx-auto max-w-3xl px-4 pb-16 pt-12 text-center sm:pt-16">
            <span className="live-dot mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-50 ring-1 ring-white/25">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {formatMoroccoDate(locale)}
            </span>
            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              {t.hero.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-emerald-50/90 sm:text-lg">
              {t.hero.subtitle}
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <CitySearch cities={cities} locale={locale} />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-12 px-4 py-12">
          {/* Ad below search */}
          <AdSlot locale={locale} />

          {/* Popular cities */}
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {t.popularCities}
                </h2>
                <p className="mt-1 text-sm text-muted">{t.popularCitiesSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cityStats.map(({ city, count }) => (
                <Link
                  key={city.id}
                  href={cityHref(locale, city.slug)}
                  className="group flex items-center justify-between gap-3 rounded-card border border-border bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-xl text-primary-dark">
                      <CrossIcon />
                    </span>
                    <div>
                      <p className="font-extrabold text-foreground">
                        {locale === "ar" ? city.nameAr : city.nameFr}
                      </p>
                      <p className="flex items-center gap-1 text-xs font-medium text-primary-dark">
                        <ClockIcon className="text-sm" />
                        {count > 0
                          ? `${count} ${count > 1 ? t.pharmacies : t.pharmacy} ${t.onDutyNow}`
                          : t.dutyUnavailableShort}
                      </p>
                    </div>
                  </div>
                  <ChevronRightIcon className="text-xl text-muted transition group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer locale={locale} />

          {/* SEO intro */}
          <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
            <h2 className="text-lg font-extrabold tracking-tight text-foreground">
              {locale === "ar"
                ? "كيف تجد صيدلية الحراسة بالمغرب؟"
                : "Comment trouver une pharmacie de garde au Maroc ?"}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <p>
                {locale === "ar"
                  ? "تتناوب الصيدليات في المغرب على نظام الحراسة لضمان توفر صيدلية مفتوحة في كل وقت، نهاراً وليلاً. اختر مدينتك أعلاه لعرض قائمة محدّثة بصيدليات الحراسة القريبة منك مع العنوان ورقم الهاتف والاتجاهات."
                  : "Au Maroc, les pharmacies fonctionnent par roulement de garde afin qu'une pharmacie soit toujours ouverte, de jour comme de nuit. Sélectionnez votre ville ci-dessus pour afficher la liste à jour des pharmacies de garde proches de vous, avec adresse, téléphone et itinéraire."}
              </p>
              <p>
                {locale === "ar"
                  ? "تتغيّر قائمة الحراسة يومياً، لذا ننصح دائماً بالاتصال بالصيدلية قبل التنقل للتأكد من أنها مفتوحة."
                  : "La liste de garde change chaque jour : nous vous recommandons toujours d'appeler la pharmacie avant de vous déplacer pour confirmer qu'elle est bien ouverte."}
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
