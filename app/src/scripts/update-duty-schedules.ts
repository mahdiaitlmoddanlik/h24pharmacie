import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { cities } from "../lib/data/cities";
import { dateFromISO, moroccoDateISO } from "../lib/dates";
import { inferNeighborhood } from "../lib/neighborhoods";
import {
  TELECONTACT_SOURCE_URL,
  filterTelecontactRecordsForCity,
  slugify,
  type TelecontactDutyRecord,
} from "./parse-telecontact";
import { SYNDICAT_MARRAKECH_SOURCE } from "./parse-syndicat-marrakech";

config({ path: ".env.local" });
config();

const KNOWN_SOURCES: Record<
  string,
  {
    id: string;
    name: string;
    baseUrl: string;
    type: "website" | "official";
  }
> = {
  telecontact: {
    id: "telecontact",
    name: "Telecontact.ma",
    baseUrl: TELECONTACT_SOURCE_URL,
    type: "website",
  },
  "syndicat-marrakech": SYNDICAT_MARRAKECH_SOURCE,
};

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function prismaPeriod(period: string): "day" | "night" | "h24" | "unknown" {
  if (period === "day" || period === "night" || period === "unknown") {
    return period;
  }
  return period === "24h" ? "h24" : "unknown";
}

function normalizeConnectionString(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.includes("sslmode=require") && !url.includes("uselibpqcompat=true")) {
    return url.replace("sslmode=require", "sslmode=no-verify");
  }
  return url;
}

interface GenericRecord {
  sourceExternalId: string;
  name: string;
  slug?: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  period: string;
  dutyLabel?: string;
  sourceUrl?: string;
  neighborhood?: string;
  confidenceScore?: number;
}

interface GenericSnapshot {
  source: string;
  scrapedAt: string;
  dutyDate: string;
  cities: Array<{
    citySlug: string;
    cityName: string;
    records: GenericRecord[];
  }>;
}

async function main() {
  const rawConnectionString =
    (process.env.DIRECT_URL && process.env.DIRECT_URL.trim()) ||
    (process.env.DATABASE_URL && process.env.DATABASE_URL.trim());

  if (!rawConnectionString) {
    throw new Error("Set DIRECT_URL or DATABASE_URL before updating duty schedules.");
  }
  const connectionString = normalizeConnectionString(rawConnectionString);

  const filePath = resolve(argValue("--file") ?? "tmp/telecontact-latest.json");
  const snapshot = JSON.parse(await readFile(filePath, "utf8")) as GenericSnapshot;

  const sourceConfig = KNOWN_SOURCES[snapshot.source];
  if (!sourceConfig) {
    throw new Error(
      `Snapshot source "${snapshot.source}" is not supported. Known sources: ${Object.keys(KNOWN_SOURCES).join(", ")}`,
    );
  }
  const today = moroccoDateISO();
  if (snapshot.dutyDate !== today) {
    throw new Error(
      `Snapshot duty date ${snapshot.dutyDate} does not match Morocco today ${today}.`,
    );
  }
  if (snapshot.cities.some((city) => city.records.length === 0)) {
    throw new Error("Snapshot has an empty city result; refusing to replace live duty schedules.");
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const dutyDate = dateFromISO(snapshot.dutyDate);

  await prisma.source.upsert({
    where: { id: sourceConfig.id },
    update: {
      name: sourceConfig.name,
      baseUrl: sourceConfig.baseUrl,
      type: sourceConfig.type,
      lastCheckedAt: new Date(snapshot.scrapedAt),
    },
    create: {
      id: sourceConfig.id,
      name: sourceConfig.name,
      baseUrl: sourceConfig.baseUrl,
      type: sourceConfig.type,
      lastCheckedAt: new Date(snapshot.scrapedAt),
    },
  });

  const scrapeRun = await prisma.scrapeRun.create({
    data: {
      sourceId: sourceConfig.id,
      status: "success",
      rawSnapshotPath: filePath,
    },
  });

  try {
    let recordsFound = 0;
    const updatedCities = new Set<string>();

    for (const citySnapshot of snapshot.cities) {
      const seedCity = cities.find((city) => city.slug === citySnapshot.citySlug);
      if (!seedCity) {
        console.warn(`Skipping unknown city ${citySnapshot.citySlug}`);
        continue;
      }

      updatedCities.add(seedCity.slug);
      const scheduleIds = await prisma.$transaction(async (tx) => {
        await tx.city.upsert({
          where: { id: seedCity.id },
          update: {
            nameFr: seedCity.nameFr,
            nameAr: seedCity.nameAr,
            slug: seedCity.slug,
            region: seedCity.region,
            regionAr: seedCity.regionAr,
            latitude: seedCity.latitude,
            longitude: seedCity.longitude,
            isActive: seedCity.isActive,
          },
          create: {
            id: seedCity.id,
            nameFr: seedCity.nameFr,
            nameAr: seedCity.nameAr,
            slug: seedCity.slug,
            region: seedCity.region,
            regionAr: seedCity.regionAr,
            latitude: seedCity.latitude,
            longitude: seedCity.longitude,
            isActive: seedCity.isActive,
          },
        });

        const ids: string[] = [];
        const cityRecords =
          snapshot.source === "telecontact"
            ? filterTelecontactRecordsForCity(citySnapshot.records as unknown as TelecontactDutyRecord[], seedCity)
            : citySnapshot.records;

        if (cityRecords.length === 0) {
          throw new Error(`Snapshot has no local records for ${seedCity.slug}.`);
        }

        for (const record of cityRecords) {
          const baseSlug = record.slug || slugify(record.name);
          const slugOwner = await tx.pharmacy.findFirst({
            where: { cityId: seedCity.id, slug: baseSlug },
            select: { sourceId: true, sourceExternalId: true },
          });
          const slug =
            !slugOwner ||
            (slugOwner.sourceId === sourceConfig.id &&
              slugOwner.sourceExternalId === record.sourceExternalId)
              ? baseSlug
              : `${baseSlug}-${record.sourceExternalId}`;

          const pharmacy = await tx.pharmacy.upsert({
            where: {
              sourceId_sourceExternalId: {
                sourceId: sourceConfig.id,
                sourceExternalId: record.sourceExternalId,
              },
            },
            update: {
              name: record.name,
              slug,
              cityId: seedCity.id,
              address: record.address,
              neighborhood:
                record.neighborhood ?? inferNeighborhood(seedCity.slug, record.address),
              phone: record.phone,
              latitude: record.latitude,
              longitude: record.longitude,
              verificationStatus: "source_verified",
            },
            create: {
              name: record.name,
              slug,
              cityId: seedCity.id,
              address: record.address,
              neighborhood:
                record.neighborhood ?? inferNeighborhood(seedCity.slug, record.address),
              phone: record.phone,
              latitude: record.latitude,
              longitude: record.longitude,
              verificationStatus: "source_verified",
              sourceId: sourceConfig.id,
              sourceExternalId: record.sourceExternalId,
            },
          });

          const schedule = await tx.dutySchedule.upsert({
            where: {
              pharmacyId_dutyDate_period: {
                pharmacyId: pharmacy.id,
                dutyDate,
                period: prismaPeriod(record.period),
              },
            },
            update: {
              cityId: seedCity.id,
              sourceId: sourceConfig.id,
              sourceUrl: record.sourceUrl,
              scrapedAt: new Date(snapshot.scrapedAt),
              confidenceScore: record.confidenceScore ?? 1,
            },
            create: {
              pharmacyId: pharmacy.id,
              cityId: seedCity.id,
              dutyDate,
              period: prismaPeriod(record.period),
              sourceId: sourceConfig.id,
              sourceUrl: record.sourceUrl,
              scrapedAt: new Date(snapshot.scrapedAt),
              confidenceScore: record.confidenceScore ?? 1,
            },
          });
          ids.push(schedule.id);
        }

        // Clean up duty schedules from this source that are no longer active today
        await tx.dutySchedule.deleteMany({
          where: {
            cityId: seedCity.id,
            dutyDate,
            sourceId: sourceConfig.id,
            id: { notIn: ids },
          },
        });

        // When official syndicate schedules are imported, purge any unofficial schedules for this city/date
        if (sourceConfig.type === "official") {
          await tx.dutySchedule.deleteMany({
            where: {
              cityId: seedCity.id,
              dutyDate,
              sourceId: { not: sourceConfig.id },
            },
          });
        }

        return ids;
      }, { maxWait: 10_000, timeout: 120_000 });

      if (scheduleIds.length === 0) {
        throw new Error(`No schedules were stored for ${seedCity.slug}.`);
      }
      recordsFound += scheduleIds.length;
    }

    if (updatedCities.size === 0) {
      throw new Error("No known cities were updated.");
    }

    const stalePharmacies = await prisma.pharmacy.findMany({
      where: {
        sourceId: sourceConfig.id,
        verificationStatus: "source_verified",
        dutySchedules: { none: { dutyDate } },
        reports: { none: {} },
      },
      select: { id: true },
    });
    if (stalePharmacies.length > 0) {
      const stalePharmacyIds = stalePharmacies.map((pharmacy) => pharmacy.id);
      await prisma.dutySchedule.deleteMany({
        where: { pharmacyId: { in: stalePharmacyIds } },
      });
      await prisma.pharmacy.deleteMany({
        where: { id: { in: stalePharmacyIds } },
      });
    }

    await prisma.scrapeRun.update({
      where: { id: scrapeRun.id },
      data: {
        finishedAt: new Date(),
        status: "success",
        citiesUpdated: updatedCities.size,
        recordsFound,
      },
    });

    console.log(`Updated ${recordsFound} duty records across ${updatedCities.size} cities.`);
  } catch (error) {
    await prisma.scrapeRun.update({
      where: { id: scrapeRun.id },
      data: {
        finishedAt: new Date(),
        status: "failed",
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end().catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
