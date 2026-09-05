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
  type TelecontactSnapshot,
} from "./parse-telecontact";

config({ path: ".env.local" });
config();

const SOURCE = {
  id: "telecontact",
  name: "Telecontact.ma",
  baseUrl: TELECONTACT_SOURCE_URL,
  type: "website" as const,
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

async function main() {
  const rawConnectionString =
    (process.env.DIRECT_URL && process.env.DIRECT_URL.trim()) ||
    (process.env.DATABASE_URL && process.env.DATABASE_URL.trim());

  if (!rawConnectionString) {
    throw new Error("Set DIRECT_URL or DATABASE_URL before updating duty schedules.");
  }
  const connectionString = normalizeConnectionString(rawConnectionString);

  const filePath = resolve(argValue("--file") ?? "tmp/telecontact-latest.json");
  const snapshot = JSON.parse(await readFile(filePath, "utf8")) as TelecontactSnapshot;
  if (snapshot.source !== SOURCE.id) {
    throw new Error(`Snapshot source ${snapshot.source} does not match importer source ${SOURCE.id}.`);
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
    where: { id: SOURCE.id },
    update: {
      name: SOURCE.name,
      baseUrl: SOURCE.baseUrl,
      type: SOURCE.type,
      lastCheckedAt: new Date(snapshot.scrapedAt),
    },
    create: {
      ...SOURCE,
      lastCheckedAt: new Date(snapshot.scrapedAt),
    },
  });

  const scrapeRun = await prisma.scrapeRun.create({
    data: {
      sourceId: SOURCE.id,
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
        const cityRecords = filterTelecontactRecordsForCity(citySnapshot.records, seedCity);
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
            (slugOwner.sourceId === SOURCE.id &&
              slugOwner.sourceExternalId === record.sourceExternalId)
              ? baseSlug
              : `${baseSlug}-${record.sourceExternalId}`;

          const pharmacy = await tx.pharmacy.upsert({
            where: {
              sourceId_sourceExternalId: {
                sourceId: SOURCE.id,
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
              sourceId: SOURCE.id,
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
              sourceId: SOURCE.id,
              sourceUrl: record.sourceUrl,
              scrapedAt: new Date(snapshot.scrapedAt),
              confidenceScore: record.confidenceScore,
            },
            create: {
              pharmacyId: pharmacy.id,
              cityId: seedCity.id,
              dutyDate,
              period: prismaPeriod(record.period),
              sourceId: SOURCE.id,
              sourceUrl: record.sourceUrl,
              scrapedAt: new Date(snapshot.scrapedAt),
              confidenceScore: record.confidenceScore,
            },
          });
          ids.push(schedule.id);
        }

        await tx.dutySchedule.deleteMany({
          where: {
            cityId: seedCity.id,
            dutyDate,
            sourceId: SOURCE.id,
            id: { notIn: ids },
          },
        });
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
        sourceId: SOURCE.id,
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
