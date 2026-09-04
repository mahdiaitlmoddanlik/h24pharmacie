import type { City, DutyPeriod } from "../lib/types";

export const SAYDALIA_PAGE_URL =
  "https://saydalia.ma/fr/pharmacies-de-garde/";
export const SAYDALIA_API_URL = "https://saydalia.ma/api/siteweb_api.php";
export const SAYDALIA_USER_AGENT =
  "Mozilla/5.0 (compatible; H24PharmacieBot/0.1; +https://h24pharmacie.com)";

export interface SaydaliaApiItem {
  id?: string | number;
  title?: string;
  Phone?: string;
  address?: string;
  "Adresse 2"?: string;
  Ville?: string;
  garde?: string;
  lat?: string | number;
  lng?: string | number;
  distance?: string | number;
  marker?: string;
}

export interface SaydaliaDutyRecord {
  sourceExternalId: string;
  name: string;
  slug: string;
  cityName: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  period: DutyPeriod;
  dutyLabel: string;
  sourceUrl: string;
  confidenceScore: number;
}

export interface SaydaliaCitySnapshot {
  citySlug: string;
  cityName: string;
  latitude: number;
  longitude: number;
  records: SaydaliaDutyRecord[];
}

export interface SaydaliaSnapshot {
  source: "saydalia";
  sourceUrl: string;
  scrapedAt: string;
  dutyDate: string;
  cities: SaydaliaCitySnapshot[];
}

export interface SaydaliaBrandFilter {
  period: DutyPeriod;
  brand: string;
  label: string;
}

const DEFAULT_FILTERS: SaydaliaBrandFilter[] = [
  { period: "day", brand: "9", label: "Garde de jour" },
  { period: "night", brand: "8", label: "Garde de nuit" },
  { period: "24h", brand: "5", label: "Garde 24h/24" },
];

const CITY_FILTERS: Record<string, SaydaliaBrandFilter[]> = {
  casablanca: [
    { period: "day", brand: "9", label: "Garde de jour" },
    { period: "night", brand: "2", label: "Garde de nuit" },
    { period: "24h", brand: "5", label: "Garde 24h/24" },
  ],
  rabat: [
    { period: "day", brand: "2", label: "Garde de jour" },
    { period: "24h", brand: "5", label: "Garde 24h/24" },
  ],
  marrakech: [
    { period: "day", brand: "1", label: "Garde de jour" },
    { period: "night", brand: "7", label: "Garde de nuit" },
    { period: "24h", brand: "5", label: "Garde 24h/24" },
  ],
  agadir: [{ period: "24h", brand: "5", label: "Garde 24h/24" }],
};

export function getSaydaliaBrandFilters(citySlug: string) {
  return CITY_FILTERS[citySlug] ?? DEFAULT_FILTERS;
}

export function extractSaydaliaApiKey(html: string): string | undefined {
  const match = html.match(/nearestSaydaliaData\s*=\s*(\{[^;]+\})\s*;/);
  if (!match) return undefined;

  try {
    const parsed = JSON.parse(match[1]) as { api_key?: string };
    return parsed.api_key;
  } catch {
    return undefined;
  }
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

function normalizePhone(phone: string): string {
  const compact = phone.replace(/[^\d+]/g, "");
  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("0")) return `+212${compact.slice(1)}`;
  return compact;
}

function numberFrom(value: string | number | undefined): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function periodFromLabel(label: string, fallback: DutyPeriod): DutyPeriod {
  const normalized = label.toLowerCase();
  if (normalized.includes("24")) return "24h";
  if (normalized.includes("00") || normalized.includes("nuit")) return "night";
  if (normalized.includes("21") || normalized.includes("jour")) return "day";
  return fallback;
}

export function parseSaydaliaItems(
  items: SaydaliaApiItem[],
  context: {
    cityName: string;
    period: DutyPeriod;
    sourceUrl?: string;
  },
): SaydaliaDutyRecord[] {
  return items.flatMap((item) => {
    const name = (item.title ?? "").trim();
    const sourceExternalId = String(item.id ?? "").trim();
    const latitude = numberFrom(item.lat);
    const longitude = numberFrom(item.lng);

    if (!name || !sourceExternalId || latitude === undefined || longitude === undefined) {
      return [];
    }

    const dutyLabel = (item.garde ?? "").trim();

    return [
      {
        sourceExternalId,
        name,
        slug: slugify(name),
        cityName: (item.Ville ?? context.cityName).trim(),
        address: (item.address ?? item["Adresse 2"] ?? "").replace(/\s+/g, " ").trim(),
        phone: normalizePhone(item.Phone ?? ""),
        latitude,
        longitude,
        period: periodFromLabel(dutyLabel, context.period),
        dutyLabel,
        sourceUrl: context.sourceUrl ?? SAYDALIA_PAGE_URL,
        confidenceScore: dutyLabel ? 0.92 : 0.8,
      },
    ];
  });
}

export function dedupeSaydaliaRecords(records: SaydaliaDutyRecord[]) {
  const seen = new Set<string>();
  return records.filter((record) => {
    const key = `${record.sourceExternalId}:${record.period}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const CITY_NAME_ALIASES: Record<string, readonly string[]> = {
  casablanca: ["casablanca"],
  rabat: ["rabat"],
  marrakech: ["marrakech"],
  tanger: ["tanger", "tangier"],
  fes: ["fes"],
  agadir: ["agadir"],
};

function normalizeCityName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Keep only records whose published city is the city currently being scraped. */
export function filterSaydaliaRecordsForCity(
  records: SaydaliaDutyRecord[],
  city: City,
): SaydaliaDutyRecord[] {
  const acceptedNames = CITY_NAME_ALIASES[city.slug] ?? [normalizeCityName(city.nameFr)];
  return records.filter((record) =>
    acceptedNames.includes(normalizeCityName(record.cityName)),
  );
}
