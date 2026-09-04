import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { cities } from "../lib/data/cities";
import { moroccoDateISO } from "../lib/dates";
import type { City } from "../lib/types";
import {
  dedupeSaydaliaRecords,
  extractSaydaliaApiKey,
  filterSaydaliaRecordsForCity,
  getSaydaliaBrandFilters,
  parseSaydaliaItems,
  SAYDALIA_API_URL,
  SAYDALIA_PAGE_URL,
  SAYDALIA_USER_AGENT,
  type SaydaliaApiItem,
  type SaydaliaCitySnapshot,
  type SaydaliaSnapshot,
} from "./parse-saydalia";

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function sleep(ms: number) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function fetchApiKey() {
  const response = await fetch(SAYDALIA_PAGE_URL, {
    headers: { "user-agent": SAYDALIA_USER_AGENT },
  });
  const html = await response.text();
  const apiKey = extractSaydaliaApiKey(html);
  if (!apiKey) {
    throw new Error("Could not find nearestSaydaliaData.api_key on Saydalia.");
  }
  return apiKey;
}

async function fetchPeriod(
  city: City,
  apiKey: string,
  filter: ReturnType<typeof getSaydaliaBrandFilters>[number],
) {
  const url = new URL(SAYDALIA_API_URL);
  url.searchParams.set("origin", `${city.latitude},${city.longitude}`);
  url.searchParams.set("limit", "35");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("brand", filter.brand);

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": SAYDALIA_USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Saydalia API ${response.status} for ${city.slug}/${filter.period}`);
  }

  const json = (await response.json()) as unknown;
  if (!Array.isArray(json)) {
    throw new Error(`Saydalia API returned non-array JSON for ${city.slug}/${filter.period}`);
  }

  return parseSaydaliaItems(json as SaydaliaApiItem[], {
    cityName: city.nameFr,
    period: filter.period,
    sourceUrl: SAYDALIA_PAGE_URL,
  });
}

async function scrapeCity(city: City, apiKey: string): Promise<SaydaliaCitySnapshot> {
  const records = [];

  for (const filter of getSaydaliaBrandFilters(city.slug)) {
    const periodRecords = await fetchPeriod(city, apiKey, filter);
    const cityRecords = filterSaydaliaRecordsForCity(periodRecords, city);
    records.push(...cityRecords);
    console.log(
      `${city.slug}/${filter.period}: ${cityRecords.length}/${periodRecords.length} local records`,
    );
    await sleep(700);
  }

  return {
    citySlug: city.slug,
    cityName: city.nameFr,
    latitude: city.latitude,
    longitude: city.longitude,
    records: dedupeSaydaliaRecords(records),
  };
}

async function main() {
  const selectedCitySlug = argValue("--city");
  const outPath = resolve(argValue("--out") ?? "tmp/saydalia-latest.json");
  const selectedCities = selectedCitySlug
    ? cities.filter((city) => city.slug === selectedCitySlug)
    : cities;

  if (selectedCities.length === 0) {
    throw new Error(`Unknown city slug: ${selectedCitySlug}`);
  }

  const apiKey = await fetchApiKey();
  const scrapedAt = new Date().toISOString();
  const citySnapshots = [];

  for (const city of selectedCities) {
    citySnapshots.push(await scrapeCity(city, apiKey));
  }

  const snapshot: SaydaliaSnapshot = {
    source: "saydalia",
    sourceUrl: SAYDALIA_PAGE_URL,
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
