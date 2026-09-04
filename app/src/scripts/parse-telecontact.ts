import type { City, DutyPeriod } from "../lib/types";

export const TELECONTACT_BASE_URL = "https://www.telecontact.ma";
export const TELECONTACT_SOURCE_URL =
  `${TELECONTACT_BASE_URL}/services/pharmacies-de-garde/Maroc`;
export const TELECONTACT_API_PATH =
  "/trouver/pharmacie-guarde-zone-jour-fonctionalite.php";
export const TELECONTACT_USER_AGENT =
  "Mozilla/5.0 (compatible; H24PharmacieBot/0.1; +https://h24pharmacie.com)";

export interface TelecontactApiItem {
  rs_comp?: string;
  JOUR?: string | number;
  zone_de_garde?: string;
  code_firme?: string | number;
  adresse?: string;
  ville?: string;
  tel?: string;
  longitude?: string | number;
  latitude?: string | number;
}

export interface TelecontactDutyRecord {
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
  neighborhood?: string;
  confidenceScore: number;
}

export interface TelecontactZone {
  citySlug: string;
  zoneSlug: string;
  zoneName: string;
  sourceUrl: string;
}

export interface TelecontactCitySnapshot {
  citySlug: string;
  cityName: string;
  latitude: number;
  longitude: number;
  records: TelecontactDutyRecord[];
}

export interface TelecontactSnapshot {
  source: "telecontact";
  sourceUrl: string;
  scrapedAt: string;
  dutyDate: string;
  cities: TelecontactCitySnapshot[];
}

export function telecontactCityUrl(citySlug: string) {
  return `${TELECONTACT_BASE_URL}/services/pharmacies-de-garde/${citySlug}-Maroc`;
}

export function telecontactApiUrl(citySlug: string, zoneSlug: string, jour: string) {
  const url = new URL(TELECONTACT_API_PATH, TELECONTACT_BASE_URL);
  url.searchParams.set("act", "pharmacie-ville-zone");
  url.searchParams.set("ville", citySlug);
  url.searchParams.set("zone", zoneSlug);
  url.searchParams.set("jour", jour);
  return url;
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

function normalizeText(value: string | number | undefined): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
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

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function labelFromJour(jour: string | number | undefined): string {
  if (String(jour) === "1") return "Garde de jour";
  if (String(jour) === "2") return "Garde de nuit";
  if (String(jour) === "3") return "Garde 24h/24";
  return "Garde";
}

export function periodFromJour(jour: string | number | undefined): DutyPeriod {
  if (String(jour) === "1") return "day";
  if (String(jour) === "2") return "night";
  if (String(jour) === "3") return "24h";
  return "unknown";
}

export function parseTelecontactItems(
  items: TelecontactApiItem[],
  context: {
    cityName: string;
    sourceUrl: string;
    zoneName?: string;
  },
): TelecontactDutyRecord[] {
  return items.flatMap((item) => {
    const name = normalizeText(item.rs_comp);
    const sourceExternalId = normalizeText(item.code_firme);
    const latitude = numberFrom(item.latitude);
    const longitude = numberFrom(item.longitude);

    if (!name || !sourceExternalId || latitude === undefined || longitude === undefined) {
      return [];
    }

    const period = periodFromJour(item.JOUR);
    const dutyLabel = labelFromJour(item.JOUR);

    return [
      {
        sourceExternalId,
        name,
        slug: slugify(name),
        cityName: normalizeText(item.ville) || context.cityName,
        address: normalizeText(item.adresse),
        phone: normalizePhone(normalizeText(item.tel)),
        latitude,
        longitude,
        period,
        dutyLabel,
        sourceUrl: context.sourceUrl,
        neighborhood: normalizeText(item.zone_de_garde) || context.zoneName,
        confidenceScore: period === "unknown" ? 0.82 : 0.95,
      },
    ];
  });
}

export function extractTelecontactZones(html: string, citySlug: string): TelecontactZone[] {
  const zones = new Map<string, TelecontactZone>();
  const hrefPattern = new RegExp(
    `href=["'](/pharmacie-de-garde-zone/${citySlug}/([^"'#?]+)\\.html)["'][^>]*>([\\s\\S]*?)</a>`,
    "gi",
  );

  for (const match of html.matchAll(hrefPattern)) {
    const zoneSlug = match[2];
    const label = decodeHtmlEntities(match[3].replace(/<[^>]+>/g, " "));
    const zoneName = normalizeText(label);
    if (!zoneSlug || !zoneName || zones.has(zoneSlug)) continue;
    zones.set(zoneSlug, {
      citySlug,
      zoneSlug,
      zoneName,
      sourceUrl: `${TELECONTACT_BASE_URL}${match[1]}`,
    });
  }

  return [...zones.values()];
}

export function dedupeTelecontactRecords(records: TelecontactDutyRecord[]) {
  const seen = new Set<string>();
  return records.filter((record) => {
    const key = `${record.sourceExternalId}:${record.period}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function canonicalizeTelecontactNeighborhoods(
  records: TelecontactDutyRecord[],
  zones: TelecontactZone[],
) {
  const zoneNames = new Map<string, string>();
  for (const zone of zones) {
    zoneNames.set(zone.zoneSlug, zone.zoneName);
    zoneNames.set(slugify(zone.zoneName), zone.zoneName);
  }

  return records.map((record) => {
    const canonicalName = record.neighborhood
      ? zoneNames.get(slugify(record.neighborhood))
      : undefined;
    return canonicalName ? { ...record, neighborhood: canonicalName } : record;
  });
}

const CITY_NAME_ALIASES: Record<string, readonly string[]> = {
  casablanca: ["casablanca"],
  rabat: ["rabat"],
  marrakech: ["marrakech"],
  tanger: ["tanger", "tangier"],
  fes: ["fes", "fès"],
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

export function filterTelecontactRecordsForCity(
  records: TelecontactDutyRecord[],
  city: City,
): TelecontactDutyRecord[] {
  const acceptedNames = CITY_NAME_ALIASES[city.slug] ?? [normalizeCityName(city.nameFr)];
  return records.filter((record) =>
    acceptedNames.map(normalizeCityName).includes(normalizeCityName(record.cityName)),
  );
}
