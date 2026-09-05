import * as cheerio from "cheerio";
import type { DutyPeriod } from "../lib/types";

export const SYNDICAT_MARRAKECH_SOURCE = {
  id: "syndicat-marrakech",
  name: "Syndicat des Pharmaciens de Marrakech",
  baseUrl: "https://www.syndicat-pharmaciens-marrakech.com",
  type: "official" as const,
};

export const SYNDICAT_USER_AGENT =
  "Mozilla/5.0 (compatible; H24PharmacieBot/0.1; +https://h24pharmacie.com)";

export interface SyndicatDistrictLink {
  name: string;
  url: string;
  period: "day" | "night";
}

export interface RawSyndicatCard {
  name: string;
  district: string;
  period: "day" | "night";
  address: string;
  schedule: string;
  phone: string;
  detailUrl?: string;
  districtUrl: string;
}

export interface SyndicatDutyRecord {
  sourceExternalId: string;
  name: string;
  slug: string;
  cityName: "Marrakech";
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  period: DutyPeriod;
  dutyLabel: string;
  sourceUrl: string;
  neighborhood: string;
  confidenceScore: number;
}

export interface SyndicatSnapshot {
  source: "syndicat-marrakech";
  sourceUrl: string;
  scrapedAt: string;
  dutyDate: string;
  cities: [
    {
      citySlug: "marrakech";
      cityName: "Marrakech";
      latitude: number;
      longitude: number;
      records: SyndicatDutyRecord[];
    },
  ];
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function normalizePhone(phone: string): string {
  const compact = phone.replace(/[^\d+]/g, "");
  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("0")) return `+212${compact.slice(1)}`;
  return compact;
}

export function normalizeNeighborhood(district: string): string {
  const cleaned = district.replace(/\s+/g, " ").trim().toUpperCase();
  const map: Record<string, string> = {
    LAMHAMID: "Lamhamid",
    MEDINA: "Médina",
    "GRAND GUELIZ": "Guéliz",
    DAOUDIAT: "Daoudiat",
    TARGA: "Targa",
    "HAY HASSANI": "Hay Hassani",
    "SIDI YOUSSEF": "Sidi Youssef Ben Ali",
    "SIDI GHANEM AZZOUZIA": "Sidi Ghanem",
    "AÏN ITTI": "Aïn Itti",
    "AIN ITTI": "Aïn Itti",
    "NAKHIL SUD": "Palmeraie / Ennakhil",
    "HAY CHARAF": "Hay Charaf",
    "HAY DAR ESAADA": "Dar Saada",
    "HAY AL IZDIHAR": "Izdihar",
    "HAY AL FADL": "Al Fadl",
  };
  return map[cleaned] ?? district.replace(/\s+/g, " ").trim();
}

export function extractDistrictsFromIndex(
  html: string,
  period: "day" | "night",
): SyndicatDistrictLink[] {
  const $ = cheerio.load(html);
  const districts: SyndicatDistrictLink[] = [];

  $("article.garde-card").each((_, el) => {
    const titleEl = $(el).find("h2.garde-card__title");
    const linkEl = $(el).find("a.garde-card__cta");
    const name = titleEl.text().replace(/\s+/g, " ").trim();
    const href = linkEl.attr("href");

    if (name && href) {
      const fullUrl = href.startsWith("http")
        ? href
        : `${SYNDICAT_MARRAKECH_SOURCE.baseUrl}${href.startsWith("/") ? "" : "/"}${href}`;
      districts.push({
        name,
        url: fullUrl,
        period,
      });
    }
  });

  return districts;
}

export function extractPharmaciesFromDistrict(
  html: string,
  district: string,
  period: "day" | "night",
  districtUrl: string,
): RawSyndicatCard[] {
  const $ = cheerio.load(html);
  const cards: RawSyndicatCard[] = [];

  $("article.pharmacy-card").each((_, el) => {
    const title = $(el).find("h2.pharmacy-card__title").text().replace(/\s+/g, " ").trim();
    if (!title) return;

    const texts: string[] = [];
    $(el)
      .find("p.pharmacy-card__text")
      .each((__, pel) => {
        const text = $(pel).text().replace(/\s+/g, " ").trim();
        if (text) texts.push(text);
      });

    const address = texts[0] ?? "";
    const schedule = texts[1] ?? "";

    const phoneHref = $(el).find("a[href^='tel:']").attr("href");
    const phone = phoneHref ? normalizePhone(phoneHref.replace(/^tel:/, "")) : "";

    const detailHref = $(el).find("a[href*='/pharmacie/']").first().attr("href");
    const detailUrl = detailHref
      ? detailHref.startsWith("http")
        ? detailHref
        : `${SYNDICAT_MARRAKECH_SOURCE.baseUrl}${detailHref.startsWith("/") ? "" : "/"}${detailHref}`
      : undefined;

    cards.push({
      name: title,
      district,
      period,
      address,
      schedule,
      phone,
      detailUrl,
      districtUrl,
    });
  });

  return cards;
}

export function extractCoordinatesFromDetail(
  html: string,
): { latitude: number; longitude: number } | null {
  const match = html.match(/destination=([0-9.-]+),([0-9.-]+)/);
  if (!match) return null;

  const latitude = parseFloat(match[1]);
  const longitude = parseFloat(match[2]);

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return { latitude, longitude };
  }
  return null;
}
