import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { moroccoDateISO } from "../lib/dates";
import {
  SYNDICAT_MARRAKECH_SOURCE,
  SYNDICAT_USER_AGENT,
  extractCoordinatesFromDetail,
  extractDistrictsFromIndex,
  extractPharmaciesFromDistrict,
  normalizeNeighborhood,
  slugify,
  type RawSyndicatCard,
  type SyndicatDutyRecord,
  type SyndicatSnapshot,
} from "./parse-syndicat-marrakech";

const MARRAKECH_DEFAULT_LAT = 31.6295;
const MARRAKECH_DEFAULT_LNG = -7.9811;

function argValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchHtml(url: string, retries = 3, delayMs = 3000): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "text/html,application/xhtml+xml",
          "user-agent": SYNDICAT_USER_AGENT,
        },
        signal: AbortSignal.timeout(25000),
      });

      if (response.ok) {
        return await response.text();
      }

      if (response.status >= 500 || response.status === 429) {
        console.warn(
          `  [Attempt ${attempt}/${retries}] Syndicat returned HTTP ${response.status} for ${url}. Retrying in ${delayMs * attempt}ms...`,
        );
        lastError = new Error(`Syndicat HTTP ${response.status} for ${url}`);
      } else {
        throw new Error(`Syndicat HTTP ${response.status} for ${url}`);
      }
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        console.warn(
          `  [Attempt ${attempt}/${retries}] Failed fetching ${url} (${err instanceof Error ? err.message : String(err)}). Retrying in ${delayMs * attempt}ms...`,
        );
      }
    }

    if (attempt < retries) {
      await sleep(delayMs * attempt);
    }
  }

  throw lastError;
}

async function scrapeMarrakech(): Promise<SyndicatDutyRecord[]> {
  console.log("Fetching Marrakech duty districts from Syndicat (day)...");
  const dayIndexHtml = await fetchHtml(
    `${SYNDICAT_MARRAKECH_SOURCE.baseUrl}/pharmacies-de-garde-marrakech`,
  );

  await sleep(1000);

  console.log("Fetching Marrakech duty districts from Syndicat (night)...");
  const nightIndexHtml = await fetchHtml(
    `${SYNDICAT_MARRAKECH_SOURCE.baseUrl}/pharmacies-de-garde-marrakech-nuit`,
  );

  const dayDistricts = extractDistrictsFromIndex(dayIndexHtml, "day");
  const nightDistricts = extractDistrictsFromIndex(nightIndexHtml, "night");

  console.log(
    `Found ${dayDistricts.length} day districts and ${nightDistricts.length} night districts.`,
  );

  const rawCards: RawSyndicatCard[] = [];

  // Scrape day districts
  for (const district of dayDistricts) {
    try {
      const html = await fetchHtml(district.url);
      const cards = extractPharmaciesFromDistrict(
        html,
        district.name,
        "day",
        district.url,
      );
      rawCards.push(...cards);
      console.log(`  [Day] ${district.name}: ${cards.length} pharmacies`);
      await sleep(150);
    } catch (err) {
      console.error(`  Error scraping day district ${district.name}:`, err);
    }
  }

  // Scrape night districts
  for (const district of nightDistricts) {
    try {
      const html = await fetchHtml(district.url);
      const cards = extractPharmaciesFromDistrict(
        html,
        district.name,
        "night",
        district.url,
      );
      rawCards.push(...cards);
      console.log(`  [Night] ${district.name}: ${cards.length} pharmacies`);
      await sleep(150);
    } catch (err) {
      console.error(`  Error scraping night district ${district.name}:`, err);
    }
  }

  // Collect detail URLs and fetch GPS coordinates
  const coordCache = new Map<string, { latitude: number; longitude: number }>();
  const uniqueDetailUrls = Array.from(
    new Set(rawCards.map((c) => c.detailUrl).filter((url): url is string => Boolean(url))),
  );

  console.log(
    `Fetching GPS coordinates for ${uniqueDetailUrls.length} unique pharmacies...`,
  );

  for (const detailUrl of uniqueDetailUrls) {
    try {
      const detailHtml = await fetchHtml(detailUrl);
      const coords = extractCoordinatesFromDetail(detailHtml);
      if (coords) {
        coordCache.set(detailUrl, coords);
      }
      await sleep(100);
    } catch {
      // Fallback coordinates will be applied
    }
  }

  const records: SyndicatDutyRecord[] = [];

  for (const card of rawCards) {
    const coords = card.detailUrl ? coordCache.get(card.detailUrl) : undefined;
    const latitude = coords?.latitude ?? MARRAKECH_DEFAULT_LAT;
    const longitude = coords?.longitude ?? MARRAKECH_DEFAULT_LNG;

    const slug = slugify(card.name);
    // External ID is derived from detail URL if available, or slug
    const sourceExternalId = card.detailUrl
      ? card.detailUrl.split("/").pop() || slug
      : slug;

    records.push({
      sourceExternalId,
      name: card.name,
      slug,
      cityName: "Marrakech",
      address: card.address,
      phone: card.phone,
      latitude,
      longitude,
      period: card.period,
      dutyLabel: card.period === "day" ? "Garde de jour" : "Garde de nuit",
      sourceUrl: card.detailUrl ?? card.districtUrl,
      neighborhood: normalizeNeighborhood(card.district),
      confidenceScore: 1.0,
    });
  }

  return records;
}

async function main() {
  const outArg = argValue("--out") ?? "tmp/syndicat-marrakech-latest.json";
  const outputPath = resolve(outArg);

  console.log("=== Scraping Syndicat des Pharmaciens de Marrakech ===");

  try {
    const records = await scrapeMarrakech();

    const snapshot: SyndicatSnapshot = {
      source: "syndicat-marrakech",
      sourceUrl: SYNDICAT_MARRAKECH_SOURCE.baseUrl,
      scrapedAt: new Date().toISOString(),
      dutyDate: moroccoDateISO(),
      cities: [
        {
          citySlug: "marrakech",
          cityName: "Marrakech",
          latitude: MARRAKECH_DEFAULT_LAT,
          longitude: MARRAKECH_DEFAULT_LNG,
          records,
        },
      ],
    };

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, JSON.stringify(snapshot, null, 2), "utf8");

    console.log(
      `Saved ${records.length} Marrakech duty records to ${outputPath} successfully.`,
    );
  } catch (err) {
    console.warn(
      `⚠️ [WARNING] Could not scrape Syndicat Marrakech (${err instanceof Error ? err.message : String(err)}).`,
    );
    console.warn(
      `Preserving existing database duty records for Marrakech and continuing pipeline.`,
    );

    // Write empty fallback snapshot so downstream steps don't crash
    try {
      const fallbackSnapshot: SyndicatSnapshot = {
        source: "syndicat-marrakech",
        sourceUrl: SYNDICAT_MARRAKECH_SOURCE.baseUrl,
        scrapedAt: new Date().toISOString(),
        dutyDate: moroccoDateISO(),
        cities: [],
      };
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, JSON.stringify(fallbackSnapshot, null, 2), "utf8");
    } catch {}
  }
}

main().catch((err) => {
  console.error("Scraper unexpected error:", err);
  process.exit(1);
});
