import type { Metadata } from "next";
import type { City, DutyPharmacy, Locale } from "@/lib/types";
import { cityHref } from "@/lib/i18n";

export const SITE_NAME = "H24 Pharmacie";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.h24pharmacie.com";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function cityMetadata(city: City, locale: Locale): Metadata {
  const name = locale === "ar" ? city.nameAr : city.nameFr;
  const title =
    locale === "ar"
      ? `صيدلية الحراسة ${name} اليوم (ليلاً ونهاراً) | ${SITE_NAME}`
      : `Pharmacie de garde ${name} aujourd'hui (Nuit & Jour) | ${SITE_NAME}`;
  const description =
    locale === "ar"
      ? `اعثر على صيدلية الحراسة في ${name} اليوم المفتوحة 24 ساعة (ليلاً ونهاراً): العناوين المحددة، أرقام الهواتف المباشرة، والاتجاهات عبر خرائط Google وWaze.`
      : `Trouvez la pharmacie de garde à ${name} aujourd'hui ouverte 24h/24 (nuit & jour) : adresses exactes, téléphones directs et itinéraires GPS Google Maps et Waze.`;

  const path = cityHref(locale, city.slug);
  const altFr = cityHref("fr", city.slug);
  const altAr = cityHref("ar", city.slug);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: {
        fr: absoluteUrl(altFr),
        ar: absoluteUrl(altAr),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_MA" : "fr_MA",
      type: "website",
      images: [
        {
          url: absoluteUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Pharmacie de garde ${name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og-image.png")],
    },
  };
}

/** JSON-LD for the city listing page. */
export function cityJsonLd(
  city: City,
  locale: Locale,
  duty: DutyPharmacy[],
): Record<string, unknown> {
  const name = locale === "ar" ? city.nameAr : city.nameFr;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name:
      locale === "ar"
        ? `صيدليات الحراسة في ${name} اليوم`
        : `Pharmacies de garde à ${name} aujourd'hui`,
    description:
      locale === "ar"
        ? `قائمة صيدليات الحراسة المفتوحة اليوم في ${name} مع الهواتف والعناوين والخرائط.`
        : `Liste officielle des pharmacies de garde ouvertes aujourd'hui à ${name} avec coordonnées et itinéraires.`,
    itemListElement: duty.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": ["Pharmacy", "MedicalBusiness"],
        name: p.name,
        telephone: p.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: p.address,
          addressLocality: name,
          addressCountry: "MA",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: p.latitude,
          longitude: p.longitude,
        },
        priceRange: "$$",
        isAcceptingNewPatients: true,
      },
    })),
  };
}

/** FAQPage JSON-LD for boosting click-through rates on Google rich snippets. */
export function faqJsonLd(
  faqs: { question: string; answer: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

/** WebSite JSON-LD with Sitelinks Searchbox and Publisher info. */
export function websiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(locale === "ar" ? "/ar" : "/"),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl(locale === "ar" ? "/ar" : "/")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-icon.png"),
        width: 512,
        height: 512,
      },
    },
  };
}

/** Individual Pharmacy JSON-LD schema */
export function pharmacyJsonLd(
  pharmacy: {
    name: string;
    phone?: string | null;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    slug: string;
  },
  city: City,
  locale: Locale,
  duty?: DutyPharmacy | null,
): Record<string, unknown> {
  const cityName = locale === "ar" ? city.nameAr : city.nameFr;
  return {
    "@context": "https://schema.org",
    "@type": ["Pharmacy", "MedicalBusiness", "LocalBusiness"],
    name: pharmacy.name,
    telephone: pharmacy.phone ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: pharmacy.address,
      addressLocality: cityName,
      addressCountry: "MA",
    },
    ...(pharmacy.latitude && pharmacy.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: pharmacy.latitude,
            longitude: pharmacy.longitude,
          },
        }
      : {}),
    ...(duty
      ? {
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens:
                duty.period === "day"
                  ? "09:00"
                  : duty.period === "night"
                  ? "20:00"
                  : "00:00",
              closes:
                duty.period === "day"
                  ? "21:00"
                  : duty.period === "night"
                  ? "09:00"
                  : "23:59",
            },
          ],
        }
      : {}),
    priceRange: "$$",
    isAcceptingNewPatients: true,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  };
}
