import type { Metadata } from "next";
import type { City, DutyPharmacy, Locale } from "@/lib/types";
import { cityHref } from "@/lib/i18n";

export const SITE_NAME = "Pharmacies de Garde Maroc";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pharmacies-garde-maroc.ma";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function cityMetadata(city: City, locale: Locale): Metadata {
  const name = locale === "ar" ? city.nameAr : city.nameFr;
  const title =
    locale === "ar"
      ? `صيدليات الحراسة ${name} اليوم — نهار وليل`
      : `Pharmacie de garde ${name} aujourd'hui — Jour et Nuit`;
  const description =
    locale === "ar"
      ? `اعثر على صيدليات الحراسة في ${name} اليوم: العناوين، الهواتف، والاتجاهات عبر خرائط Google وWaze. بيانات محدّثة بانتظام.`
      : `Trouvez les pharmacies de garde à ${name} aujourd'hui: adresses, téléphones, itinéraires Google Maps et Waze. Données mises à jour régulièrement.`;

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
    },
    twitter: { card: "summary_large_image", title, description },
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
        ? `صيدليات الحراسة ${name}`
        : `Pharmacies de garde ${name}`,
    itemListElement: duty.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Pharmacy",
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
      },
    })),
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
