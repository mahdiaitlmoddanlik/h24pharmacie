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
} from "@/lib/i18n";
import {
  SOURCE,
  getCities,
  getCityBySlug,
  getDutyPharmacies,
  lastUpdatedFor,
} from "@/lib/data";
import { getCityZones } from "@/lib/data/city-zones";
import { breadcrumbJsonLd, cityJsonLd, faqJsonLd } from "@/lib/seo";
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

  const cityFaqs =
    locale === "ar"
      ? [
          {
            question: `كيف أعرف صيدلية الحراسة المفتوحة هذه الليلة في ${cityName}؟`,
            answer: `تحتوي القائمة أعلاه على جميع صيدليات الحراسة العاملة في ${cityName} الليلة. يمكنك تصفية النتائج حسب الفترة (ليل، نهار، أو 24 ساعة) واستخدام زر الاتصال المباشر ومسار GPS عبر Google Maps وWaze.`,
          },
          {
            question: `ما هي أوقات دوام صيدليات الحراسة في ${cityName}؟`,
            answer: `تبدأ حراسة النهار عادة من 08:30 صباحاً إلى 20:00 مساءً، بينما تبدأ الحراسة الليلية من 20:00 مساءً حتى صباح اليوم التالي. كما تتوفر صيدليات بنظام 24/24.`,
          },
          {
            question: `هل يجب الاتصال بالصيدلية قبل التوجه إليها في ${cityName}؟`,
            answer: `نعم، ننصح دائماً بالاتصال المسبق عبر رقم الهاتف المبيّن للتأكد من توفر الدواء المطلوب قبل التنقل.`,
          },
        ]
      : [
          {
            question: `Comment trouver une pharmacie de garde ouverte cette nuit à ${cityName} ?`,
            answer: `Consultez la liste ci-dessus en activant le filtre « Nuit » ou « 24h/24 ». H24 Pharmacie affiche l'adresse exacte, le numéro de téléphone direct et l'itinéraire GPS (Google Maps / Waze) vers chaque officine de garde à ${cityName}.`,
          },
          {
            question: `Quels sont les horaires des pharmacies de garde à ${cityName} ?`,
            answer: `La garde de jour assure le service en journée (08h30 - 20h00), et la garde de nuit prend le relais de 20h00 jusqu'au lendemain matin. Certaines officines assurent une permanence continue 24h/24.`,
          },
          {
            question: `Faut-il appeler la pharmacie avant de se déplacer à ${cityName} ?`,
            answer: `Oui, nous recommandons systématiquement d'appeler la pharmacie au préalable pour confirmer la disponibilité des produits et ordonnances nécessaires.`,
          },
        ];

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

          {/* SEO FAQ Section */}
          <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
            <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
              {locale === "ar"
                ? `الأسئلة الشائعة حول صيدليات الحراسة في ${cityName}`
                : `Questions fréquentes sur les pharmacies de garde à ${cityName}`}
            </h2>
            <div className="mt-4 space-y-3">
              {cityFaqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/80 bg-surface-muted/50 p-4 transition hover:border-primary/40"
                >
                  <h3 className="text-sm font-bold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
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
