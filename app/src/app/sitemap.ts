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

  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/ar"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    {
      url: absoluteUrl("/mentions-legales"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          fr: absoluteUrl("/mentions-legales"),
          ar: absoluteUrl("/ar/mentions-legales"),
        },
      },
    },
    {
      url: absoluteUrl("/ar/mentions-legales"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  for (const c of cities) {
    entries.push({
      url: absoluteUrl(cityHref("fr", c.slug)),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: {
          fr: absoluteUrl(cityHref("fr", c.slug)),
          ar: absoluteUrl(cityHref("ar", c.slug)),
        },
      },
    });
    entries.push({
      url: absoluteUrl(cityHref("ar", c.slug)),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    });
  }

  for (const pharmacy of pharmacies) {
    entries.push({
      url: absoluteUrl(pharmacyHref("fr", pharmacy.city, pharmacy.slug)),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: {
        languages: {
          fr: absoluteUrl(pharmacyHref("fr", pharmacy.city, pharmacy.slug)),
          ar: absoluteUrl(pharmacyHref("ar", pharmacy.city, pharmacy.slug)),
        },
      },
    });
    entries.push({
      url: absoluteUrl(pharmacyHref("ar", pharmacy.city, pharmacy.slug)),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  return entries;
}
