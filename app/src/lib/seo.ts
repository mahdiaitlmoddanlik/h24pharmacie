import type { Metadata } from "next";
import type { City, DutyPharmacy, Locale, Pharmacy } from "@/lib/types";
import { cityHref, pharmacyHref, zoneHref } from "@/lib/i18n";
import { type Zone, getZoneName } from "@/lib/data/neighborhoods";

export const SITE_NAME = "H24 Pharmacie";
export const PRODUCTION_DOMAIN = "https://www.h24pharmacie.com";

function resolveSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))) {
    return envUrl;
  }
  return PRODUCTION_DOMAIN;
}

export const SITE_URL = resolveSiteUrl();

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function cityMetadata(city: City, locale: Locale): Metadata {
  const name = locale === "ar" ? city.nameAr : city.nameFr;
  
  let title = `Pharmacie de Garde ${name} Ouverte Aujourd'hui (24h/24 & Nuit) — ${SITE_NAME}`;
  let description = `Pharmacie de garde à ${name} aujourd'hui ouverte maintenant (24h/24, nuit & jour). Adresses vérifiées, téléphones directs et itinéraire GPS Google Maps / Waze.`;
  let ogLocale = "fr_MA";

  if (locale === "ar") {
    title = `صيدلية الحراسة ${name} مفتوحة اليوم (24 ساعة وليلاً) — ${SITE_NAME}`;
    description = `صيدليات الحراسة في ${name} اليوم المفتوحة الآن (24 ساعة، ليلاً ونهاراً): أرقام هواتف مباشرة، عناوين دقيقة ومسار GPS عبر Google Maps وWaze.`;
    ogLocale = "ar_MA";
  } else if (locale === "en") {
    title = `Pharmacy Near Me in ${name} — 24/7 Duty Pharmacy Open Now | ${SITE_NAME}`;
    description = `Looking for a pharmacy near you in ${name}? Verified duty pharmacies open right now (24/7, night & day). Direct phone numbers & 1-tap GPS directions.`;
    ogLocale = "en_US";
  } else if (locale === "es") {
    title = `Farmacia Abierta Cerca de Mí en ${name} — Guardia 24h y Noche | ${SITE_NAME}`;
    description = `¿Buscas una farmacia abierta cerca de ti en ${name}? Lista de guardia verificada hoy (24h y noche): teléfonos directos y rutas GPS Google Maps y Waze.`;
    ogLocale = "es_ES";
  }

  const path = cityHref(locale, city.slug);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: {
        fr: absoluteUrl(cityHref("fr", city.slug)),
        ar: absoluteUrl(cityHref("ar", city.slug)),
        en: absoluteUrl(cityHref("en", city.slug)),
        es: absoluteUrl(cityHref("es", city.slug)),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: ogLocale,
      type: "website",
      images: [
        {
          url: absoluteUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${name}`,
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

export function zoneMetadata(city: City, zone: Zone, locale: Locale): Metadata {
  const cityName = locale === "ar" ? city.nameAr : city.nameFr;
  const zoneName = getZoneName(zone, locale);

  let title = `Pharmacie de Garde ${zoneName} (${cityName}) Ouverte Aujourd'hui (24h/24) — ${SITE_NAME}`;
  let description = `Pharmacie de garde à ${zoneName} (${cityName}) ouverte aujourd'hui (nuit & 24h/24) : téléphones directs, adresses précises et itinéraires GPS Google Maps et Waze.`;
  let ogLocale = "fr_MA";

  if (locale === "ar") {
    title = `صيدلية الحراسة حي ${zoneName} (${cityName}) مفتوحة اليوم — ${SITE_NAME}`;
    description = `اعثر على صيدلية الحراسة في حي ${zoneName} بمدينة ${cityName} اليوم (ليلاً و24 ساعة): أرقام الهواتف المباشرة، العناوين المحددة ومسارات GPS عبر Google Maps وWaze.`;
    ogLocale = "ar_MA";
  } else if (locale === "en") {
    title = `Duty Pharmacy in ${zoneName}, ${cityName} — Open Now (24/7) | ${SITE_NAME}`;
    description = `Find a duty pharmacy open now in ${zoneName}, ${cityName} (night & 24/7): verified addresses, direct phone numbers, and GPS navigation with Google Maps & Waze.`;
    ogLocale = "en_US";
  } else if (locale === "es") {
    title = `Farmacia de Guardia en ${zoneName}, ${cityName} Abierta Hoy (24h) | ${SITE_NAME}`;
    description = `Farmacia de guardia en ${zoneName} (${cityName}) abierta hoy (noche y 24h/24): teléfonos directos, direcciones exactas y rutas GPS con Google Maps y Waze.`;
    ogLocale = "es_ES";
  }

  const path = zoneHref(locale, city.slug, zone.slug);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: {
        fr: absoluteUrl(zoneHref("fr", city.slug, zone.slug)),
        ar: absoluteUrl(zoneHref("ar", city.slug, zone.slug)),
        en: absoluteUrl(zoneHref("en", city.slug, zone.slug)),
        es: absoluteUrl(zoneHref("es", city.slug, zone.slug)),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: ogLocale,
      type: "website",
      images: [
        {
          url: absoluteUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${zoneName} (${cityName})`,
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

export function zoneJsonLd(
  city: City,
  zone: Zone,
  locale: Locale,
  duty: DutyPharmacy[],
): Record<string, unknown> {
  const cityName = locale === "ar" ? city.nameAr : city.nameFr;
  const zoneName = getZoneName(zone, locale);

  const itemName =
    locale === "ar"
      ? `صيدليات الحراسة في حي ${zoneName} بـ ${cityName} اليوم`
      : locale === "en"
      ? `Duty Pharmacies in ${zoneName}, ${cityName} Today`
      : locale === "es"
      ? `Farmacias de guardia en ${zoneName}, ${cityName} hoy`
      : `Pharmacies de garde à ${zoneName} (${cityName}) aujourd'hui`;

  const itemDesc =
    locale === "ar"
      ? `قائمة صيدليات الحراسة المفتوحة اليوم في حي ${zoneName} (${cityName}) مع أرقام الهواتف المباشرة والعناوين والخرائط.`
      : locale === "en"
      ? `Verified list of open duty pharmacies serving ${zoneName} in ${cityName} today with contact details and GPS navigation.`
      : locale === "es"
      ? `Lista verificada de farmacias de guardia abiertas hoy en ${zoneName} (${cityName}) con teléfonos, direcciones y mapas.`
      : `Liste vérifiée des pharmacies de garde ouvertes aujourd'hui à ${zoneName} (${cityName}) avec téléphones directs, adresses et itinéraires.`;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: itemName,
    description: itemDesc,
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
          addressLocality: cityName,
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

/** JSON-LD for the city listing page. */
export function cityJsonLd(
  city: City,
  locale: Locale,
  duty: DutyPharmacy[],
): Record<string, unknown> {
  const name = locale === "ar" ? city.nameAr : city.nameFr;
  const itemName =
    locale === "ar"
      ? `صيدليات الحراسة في ${name} اليوم`
      : locale === "en"
      ? `Duty Pharmacies in ${name} Today`
      : locale === "es"
      ? `Farmacias de guardia en ${name} hoy`
      : `Pharmacies de garde à ${name} aujourd'hui`;

  const itemDesc =
    locale === "ar"
      ? `قائمة صيدليات الحراسة المفتوحة اليوم في ${name} مع الهواتف والعناوين والخرائط.`
      : locale === "en"
      ? `Official list of open duty pharmacies in ${name} today with contact details and GPS navigation.`
      : locale === "es"
      ? `Lista oficial de farmacias de guardia abiertas hoy en ${name} con teléfonos, direcciones y rutas GPS.`
      : `Liste officielle des pharmacies de garde ouvertes aujourd'hui à ${name} avec coordonnées et itinéraires.`;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: itemName,
    description: itemDesc,
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
  const homePath = locale === "fr" ? "/" : `/${locale}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(homePath),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl(homePath)}?q={search_term_string}`,
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

export function pharmacyMetadata(
  pharmacy: Pharmacy,
  city: City,
  locale: Locale,
): Metadata {
  const cityName = locale === "ar" ? city.nameAr : city.nameFr;
  let title = `${pharmacy.name} — Pharmacie de garde ${cityName}`;
  let description = `${pharmacy.name}, ${pharmacy.address}. Téléphone, itinéraire Google Maps et Waze. Pharmacie de garde à ${cityName}.`;

  if (locale === "ar") {
    title = `${pharmacy.name} — صيدلية الحراسة ${cityName}`;
    description = `${pharmacy.name}، ${pharmacy.addressAr || pharmacy.address}. الهاتف، اتجاهات خرائط Google وWaze. صيدلية الحراسة في ${cityName}.`;
  } else if (locale === "en") {
    title = `${pharmacy.name} — Duty Pharmacy in ${cityName}`;
    description = `${pharmacy.name}, ${pharmacy.address}. Phone number, Google Maps and Waze GPS navigation. Open pharmacy on duty in ${cityName}.`;
  } else if (locale === "es") {
    title = `${pharmacy.name} — Farmacia de guardia en ${cityName}`;
    description = `${pharmacy.name}, ${pharmacy.address}. Teléfono, rutas GPS Google Maps y Waze. Farmacia de guardia en ${cityName}.`;
  }

  const path = pharmacyHref(locale, city.slug, pharmacy.slug);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: {
        fr: absoluteUrl(pharmacyHref("fr", city.slug, pharmacy.slug)),
        ar: absoluteUrl(pharmacyHref("ar", city.slug, pharmacy.slug)),
        en: absoluteUrl(pharmacyHref("en", city.slug, pharmacy.slug)),
        es: absoluteUrl(pharmacyHref("es", city.slug, pharmacy.slug)),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale:
        locale === "ar"
          ? "ar_MA"
          : locale === "en"
          ? "en_US"
          : locale === "es"
          ? "es_ES"
          : "fr_MA",
      type: "website",
      images: [
        {
          url: absoluteUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${pharmacy.name}`,
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

