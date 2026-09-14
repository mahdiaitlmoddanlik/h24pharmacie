import type { MetadataRoute } from "next";
import { getCities, getPharmacyStaticParams } from "@/lib/data";
import { cityHref, pharmacyHref } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [cities, pharmacies] = await Promise.all([
    getCities(),
    getPharmacyStaticParams(),
  ]);

  const homeAlternates = {
    languages: {
      fr: absoluteUrl("/"),
      ar: absoluteUrl("/ar"),
      en: absoluteUrl("/en"),
      es: absoluteUrl("/es"),
    },
  };

  const legalAlternates = {
    languages: {
      fr: absoluteUrl("/mentions-legales"),
      ar: absoluteUrl("/ar/mentions-legales"),
      en: absoluteUrl("/en/mentions-legales"),
      es: absoluteUrl("/es/mentions-legales"),
    },
  };

  const contactAlternates = {
    languages: {
      fr: absoluteUrl("/contact"),
      ar: absoluteUrl("/ar/contact"),
      en: absoluteUrl("/en/contact"),
      es: absoluteUrl("/es/contact"),
    },
  };

  const entries: MetadataRoute.Sitemap = [
    // Homepages
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1, alternates: homeAlternates },
    { url: absoluteUrl("/ar"), lastModified: now, changeFrequency: "daily", priority: 0.9, alternates: homeAlternates },
    { url: absoluteUrl("/en"), lastModified: now, changeFrequency: "daily", priority: 0.9, alternates: homeAlternates },
    { url: absoluteUrl("/es"), lastModified: now, changeFrequency: "daily", priority: 0.9, alternates: homeAlternates },

    // Legal
    { url: absoluteUrl("/mentions-legales"), lastModified: now, changeFrequency: "monthly", priority: 0.3, alternates: legalAlternates },
    { url: absoluteUrl("/ar/mentions-legales"), lastModified: now, changeFrequency: "monthly", priority: 0.3, alternates: legalAlternates },
    { url: absoluteUrl("/en/mentions-legales"), lastModified: now, changeFrequency: "monthly", priority: 0.3, alternates: legalAlternates },
    { url: absoluteUrl("/es/mentions-legales"), lastModified: now, changeFrequency: "monthly", priority: 0.3, alternates: legalAlternates },

    // Contact
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.4, alternates: contactAlternates },
    { url: absoluteUrl("/ar/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.4, alternates: contactAlternates },
    { url: absoluteUrl("/en/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.4, alternates: contactAlternates },
    { url: absoluteUrl("/es/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.4, alternates: contactAlternates },
  ];

  // City duty pages
  for (const c of cities) {
    const cityAlternates = {
      languages: {
        fr: absoluteUrl(cityHref("fr", c.slug)),
        ar: absoluteUrl(cityHref("ar", c.slug)),
        en: absoluteUrl(cityHref("en", c.slug)),
        es: absoluteUrl(cityHref("es", c.slug)),
      },
    };

    entries.push(
      { url: absoluteUrl(cityHref("fr", c.slug)), lastModified: now, changeFrequency: "daily", priority: 0.8, alternates: cityAlternates },
      { url: absoluteUrl(cityHref("ar", c.slug)), lastModified: now, changeFrequency: "daily", priority: 0.8, alternates: cityAlternates },
      { url: absoluteUrl(cityHref("en", c.slug)), lastModified: now, changeFrequency: "daily", priority: 0.8, alternates: cityAlternates },
      { url: absoluteUrl(cityHref("es", c.slug)), lastModified: now, changeFrequency: "daily", priority: 0.8, alternates: cityAlternates },
    );
  }

  // Pharmacy detail pages
  for (const pharmacy of pharmacies) {
    const pharmacyAlternates = {
      languages: {
        fr: absoluteUrl(pharmacyHref("fr", pharmacy.city, pharmacy.slug)),
        ar: absoluteUrl(pharmacyHref("ar", pharmacy.city, pharmacy.slug)),
        en: absoluteUrl(pharmacyHref("en", pharmacy.city, pharmacy.slug)),
        es: absoluteUrl(pharmacyHref("es", pharmacy.city, pharmacy.slug)),
      },
    };

    entries.push(
      { url: absoluteUrl(pharmacyHref("fr", pharmacy.city, pharmacy.slug)), lastModified: now, changeFrequency: "weekly", priority: 0.6, alternates: pharmacyAlternates },
      { url: absoluteUrl(pharmacyHref("ar", pharmacy.city, pharmacy.slug)), lastModified: now, changeFrequency: "weekly", priority: 0.6, alternates: pharmacyAlternates },
      { url: absoluteUrl(pharmacyHref("en", pharmacy.city, pharmacy.slug)), lastModified: now, changeFrequency: "weekly", priority: 0.6, alternates: pharmacyAlternates },
      { url: absoluteUrl(pharmacyHref("es", pharmacy.city, pharmacy.slug)), lastModified: now, changeFrequency: "weekly", priority: 0.6, alternates: pharmacyAlternates },
    );
  }

  return entries;
}
