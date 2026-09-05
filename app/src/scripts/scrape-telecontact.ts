import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { cities } from "../lib/data/cities";
import { moroccoDateISO } from "../lib/dates";
import type { City } from "../lib/types";
import {
  TELECONTACT_SOURCE_URL,
  TELECONTACT_USER_AGENT,
  canonicalizeTelecontactNeighborhoods,
  dedupeTelecontactRecords,
  extractTelecontactZones,
  filterTelecontactRecordsForCity,
  parseTelecontactItems,
  telecontactApiUrl,
  telecontactCityUrl,
  type TelecontactApiItem,
  type TelecontactCitySnapshot,
  type TelecontactSnapshot,
  type TelecontactZone,
} from "./parse-telecontact";

const TELECONTACT_PERIODS = ["1", "2", "3"] as const;

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function sleep(ms: number) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": TELECONTACT_USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error(`Telecontact page ${response.status} for ${url}`);
  }
  return response.text();
}

async function fetchZones(city: City): Promise<TelecontactZone[]> {
  const url = telecontactCityUrl(city.slug);
  const html = await fetchText(url);
  const zones = extractTelecontactZones(html, city.slug);
  if (zones.length === 0) {
    throw new Error(`Telecontact returned no zones for ${city.slug}`);
  }
  return zones;
}

async function fetchZonePeriod(
  city: City,
  zone: TelecontactZone,
  jour: (typeof TELECONTACT_PERIODS)[number],
) {
  const url = telecontactApiUrl(city.slug, zone.zoneSlug, jour);

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": TELECONTACT_USER_AGENT,
      "x-requested-with": "XMLHttpRequest",
    },
  });

  if (!response.ok) {
    throw new Error(`Telecontact API ${response.status} for ${city.slug}/${zone.zoneSlug}/${jour}`);
  }

  const json = (await response.json()) as unknown;
  const data = typeof json === "object" && json && "data" in json ? json.data : undefined;
  if (!Array.isArray(data)) {
    throw new Error(`Telecontact API returned non-array data for ${city.slug}/${zone.zoneSlug}`);
  }

  return parseTelecontactItems(data as TelecontactApiItem[], {
    cityName: city.nameFr,
    sourceUrl: zone.sourceUrl,
    zoneName: zone.zoneName,
  });
}

async function scrapeCity(city: City): Promise<TelecontactCitySnapshot> {
  const zones = await fetchZones(city);
  const records = [];

  for (const zone of zones) {
    for (const jour of TELECONTACT_PERIODS) {
      const periodRecords = await fetchZonePeriod(city, zone, jour);
      const cityRecords = filterTelecontactRecordsForCity(periodRecords, city);
      records.push(...cityRecords);
      console.log(
        `${city.slug}/${zone.zoneSlug}/${jour}: ${cityRecords.length}/${periodRecords.length} local records`,
      );
      await sleep(500);
    }
  }

  return {
    citySlug: city.slug,
    cityName: city.nameFr,
    latitude: city.latitude,
    longitude: city.longitude,
    records: dedupeTelecontactRecords(
      canonicalizeTelecontactNeighborhoods(records, zones),
    ),
  };
}
async function main() {
  const selectedCitySlug = argValue("--city");
  const includeAllCities = process.argv.includes("--all-cities");
  const outPath = resolve(argValue("--out") ?? "tmp/telecontact-latest.json");
  const selectedCities = selectedCitySlug
    ? cities.filter((city) => city.slug === selectedCitySlug)
    : includeAllCities
      ? cities
      : cities.filter((city) => city.slug !== "marrakech");

  if (selectedCities.length === 0) {
    throw new Error(`No matching cities to scrape.`);
  }

  const scrapedAt = new Date().toISOString();
  const citySnapshots = [];

  for (const city of selectedCities) {
    citySnapshots.push(await scrapeCity(city));
  }

  const snapshot: TelecontactSnapshot = {
    source: "telecontact",
    sourceUrl: TELECONTACT_SOURCE_URL,
    scrapedAt,
    dutyDate: moroccoDateISO(),
    cities: citySnapshots,
  };

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  const total = snapshot.cities.reduce((sum, city) => sum + city.records.length, 0);
  console.log(`Wrote ${total} records to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
