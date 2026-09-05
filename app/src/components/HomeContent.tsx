import { headers } from "next/headers";
import type { City, Locale } from "@/lib/types";
import { getDict } from "@/lib/i18n";
import { formatMoroccoDate } from "@/lib/dates";
import { getCities, getDutyPharmacies } from "@/lib/data";
import { haversineDistanceKm } from "@/lib/geo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CitySearch from "@/components/CitySearch";
import PopularCities from "@/components/PopularCities";
import Disclaimer from "@/components/Disclaimer";
import AdSlot from "@/components/AdSlot";
import { websiteJsonLd, faqJsonLd } from "@/lib/seo";

export default async function HomeContent({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const cities = await getCities();

  const cityStats = await Promise.all(
    cities.map(async (c) => ({
      city: c,
      count: (await getDutyPharmacies(c.slug)).length,
    })),
  );

  // Detect user city via Vercel IP Geolocation headers
  let detectedCitySlug: string | null = null;
  try {
    const h = await headers();
    const ipCity = h.get("x-vercel-ip-city");
    const ipLat = h.get("x-vercel-ip-latitude");
    const ipLng = h.get("x-vercel-ip-longitude");

    if (ipLat && ipLng) {
      const lat = parseFloat(ipLat);
      const lng = parseFloat(ipLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        const sorted = [...cities].sort(
          (a, b) =>
            haversineDistanceKm({ latitude: lat, longitude: lng }, a) -
            haversineDistanceKm({ latitude: lat, longitude: lng }, b),
        );
        if (
          sorted[0] &&
          haversineDistanceKm({ latitude: lat, longitude: lng }, sorted[0]) < 200
        ) {
          detectedCitySlug = sorted[0].slug;
        }
      }
    }

    if (!detectedCitySlug && ipCity) {
      const norm = ipCity
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
      const aliases: Record<string, string> = {
        tangier: "tanger",
        tangiers: "tanger",
        fez: "fes",
        marrakesh: "marrakech",
        casablanca: "casablanca",
        rabat: "rabat",
        agadir: "agadir",
        sale: "rabat",
        temara: "rabat",
        kenitra: "rabat",
        mohammedia: "casablanca",
      };
      const target = aliases[norm] || norm;
      const found = cities.find(
        (c) => c.slug === target || c.nameFr.toLowerCase().includes(target),
      );
      if (found) detectedCitySlug = found.slug;
    }
  } catch {}

  // Prioritize detected city on the server
  if (detectedCitySlug) {
    const idx = cityStats.findIndex((cs) => cs.city.slug === detectedCitySlug);
    if (idx > 0) {
      const [matched] = cityStats.splice(idx, 1);
      cityStats.unshift(matched);
    }
  }

  const faqs =
    locale === "ar"
      ? [
          {
            question: "كيف أجد صيدلية حراسة مفتوحة قريبة مني الآن؟",
            answer:
              "اختر مدينتك من القائمة أعلاه (مثل الدار البيضاء، الرباط، مراكش، طنجة، فاس، أكادير)، وستظهر لك فوراً قائمة صيدليات الحراسة العاملة اليوم مع العناوين الدقيقة، أرقام الهواتف المباشرة، وروابط خرائط Google وWaze.",
          },
          {
            question: "كيف يعمل نظام الحراسة للصيدليات في المغرب؟",
            answer:
              "تخضع الصيدليات في المغرب لجدول حراسة دوري معتمد من نقابات الصيادلة والسلطات المحلية لضمان التغطية الصحية المستمرة على مدار 24 ساعة (حراسة نهارية، حراسة ليلية، وخدمة 24/24).",
          },
          {
            question: "هل معلومات الصيدليات وأرقام الهواتف محدثة يومياً؟",
            answer:
              "نعم، يتم تحديث بيانات صيدليات الحراسة على منصة H24 Pharmacie بانتظام يومياً من المصادر الرسمية لنقابات الصيادلة لمساعدتكم في الوصول لأقرب صيدلية مفتوحة.",
          },
          {
            question: "هل توجد زيادة في أسعار الأدوية أثناء الحراسة الليلية؟",
            answer:
              "تحدد وزارة الصحة وقوانين الصيدلة بالمغرب تعرفة رسمية لخدمة الحراسة الليلية تضاف قانونياً للوصفات الطبية لتعويض دوام الصيدلي وفريقه ليلاً.",
          },
        ]
      : [
          {
            question: "Comment trouver rapidement une pharmacie de garde ouverte près de moi ?",
            answer:
              "Sélectionnez votre ville ci-dessus (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir). H24 Pharmacie affiche immédiatement les officines de garde avec leur numéro de téléphone direct, leur adresse précise et un lien GPS (Google Maps et Waze).",
          },
          {
            question: "Comment fonctionnent les tours de garde au Maroc ?",
            answer:
              "Au Maroc, les pharmacies sont réparties par secteurs et assurent des permanences définies par les syndicats des pharmaciens d'officine : garde de jour (dimanches et jours fériés), garde de nuit et officines 24h/24.",
          },
          {
            question: "Les listes de garde sont-elles vérifiées et fiables ?",
            answer:
              "Oui, nos listes sont actualisées quotidiennement à partir des relevés officiels des syndicats de pharmaciens. Nous recommandons toutefois d'appeler l'officine avant tout déplacement pour vérifier la disponibilité de vos médicaments.",
          },
          {
            question: "Existe-t-il une majoration de nuit sur les médicaments ?",
            answer:
              "Oui, un honoraire légal de garde de nuit (forfait d'urgence fixé par la réglementation marocaine) s'applique aux ordonnances délivrées en dehors des heures habituelles d'ouverture.",
          },
        ];

  const jsonLd = [websiteJsonLd(locale), faqJsonLd(faqs)];

  return (
    <>
      <Header locale={locale} />

      <main className="flex-1">
        {/* Hero */}
        <section className="hero-bg relative z-20">
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
          {/* Popular cities (prioritized by user location) */}
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {t.popularCities}
                </h2>
                <p className="mt-1 text-sm text-muted">{t.popularCitiesSub}</p>
              </div>
            </div>

            <PopularCities
              initialCityStats={cityStats}
              locale={locale}
              detectedCitySlug={detectedCitySlug}
            />
          </section>

          {/* Disclaimer */}
          <Disclaimer locale={locale} />

          {/* SEO FAQ Section */}
          <section className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {locale === "ar"
                ? "الأسئلة الشائعة حول صيدليات الحراسة بالمغرب"
                : "Questions fréquentes sur les pharmacies de garde au Maroc"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {locale === "ar"
                ? "كل ما تحتاج لمعرفته حول مواعيد الحراسة، المناوبة الليلية، والخدمات الصحية 24/24."
                : "Tout ce que vous devez savoir sur le fonctionnement, les horaires et les urgences de garde."}
            </p>

            <div className="mt-6 space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/80 bg-surface-muted/50 p-4 transition hover:border-primary/40"
                >
                  <h3 className="text-base font-bold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Ad slot placed at bottom of page so it never pushes content down on mobile */}
          <AdSlot locale={locale} />
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
