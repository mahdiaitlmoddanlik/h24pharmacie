import type {
  City,
  DutyPeriod,
  DutyPharmacy,
  Pharmacy,
  Source,
  VerificationStatus,
} from "@/lib/types";
import { dateFromISO, moroccoDateISO } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { cities as seedCities } from "./cities";
import { pharmacies as seedPharmacies } from "./pharmacies";
import { seedDuties } from "./seed-duties";

export const SOURCE: Source = {
  id: "telecontact",
  name: "Telecontact.ma",
  baseUrl: "https://www.telecontact.ma/services/pharmacies-de-garde/Maroc",
  type: "website",
  lastCheckedAt: new Date().toISOString(),
};

export const cities = seedCities;
export const pharmacies = seedPharmacies;

let warnedDatabaseFailure = false;

type PrismaDutyPeriod = "day" | "night" | "h24" | "unknown";

function warnDatabaseFailure(error: unknown) {
  if (!prisma || warnedDatabaseFailure) return;
  warnedDatabaseFailure = true;
  console.warn("[data] Duty schedules are unavailable after a database error.", error);
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function mapDutyPeriod(period: string): DutyPeriod {
  if (period === "h24" || period === "24h") return "24h";
  if (period === "day" || period === "night" || period === "unknown") {
    return period;
  }
  return "unknown";
}

function prismaPeriodsForFilter(period?: DutyPeriod): PrismaDutyPeriod[] | undefined {
  if (!period) return undefined;
  if (period === "24h") return ["h24"];
  if (period === "unknown") return ["unknown"];
  return [period, "h24"];
}

function sortDutyPharmacies(a: DutyPharmacy, b: DutyPharmacy) {
  const order = (s: string) =>
    ({
      pharmacy_claimed: 0,
      source_verified: 1,
      user_confirmed: 2,
      unverified: 3,
    })[s] ?? 9;
  const d = order(a.verificationStatus) - order(b.verificationStatus);
  return d !== 0 ? d : a.name.localeCompare(b.name);
}

function mapCity(city: {
  id: string;
  nameFr: string;
  nameAr: string;
  slug: string;
  region: string | null;
  regionAr: string | null;
  latitude: number;
  longitude: number;
  isActive: boolean;
}): City {
  return {
    id: city.id,
    nameFr: city.nameFr,
    nameAr: city.nameAr,
    slug: city.slug,
    region: city.region ?? "",
    regionAr: city.regionAr ?? city.region ?? "",
    latitude: city.latitude,
    longitude: city.longitude,
    isActive: city.isActive,
  };
}

function mapPharmacy(
  pharmacy: {
    id: string;
    name: string;
    slug: string;
    cityId: string;
    address: string | null;
    addressAr: string | null;
    neighborhood: string | null;
    phone: string | null;
    whatsapp: string | null;
    latitude: number | null;
    longitude: number | null;
    verificationStatus: string;
  },
  city?: { slug: string; latitude: number; longitude: number },
): Pharmacy {
  return {
    id: pharmacy.id,
    name: pharmacy.name,
    slug: pharmacy.slug,
    cityId: city?.slug ?? pharmacy.cityId,
    address: pharmacy.address ?? "",
    addressAr: pharmacy.addressAr ?? undefined,
    phone: pharmacy.phone ?? "",
    whatsapp: pharmacy.whatsapp ?? undefined,
    latitude: pharmacy.latitude ?? city?.latitude ?? 0,
    longitude: pharmacy.longitude ?? city?.longitude ?? 0,
    verificationStatus: pharmacy.verificationStatus as VerificationStatus,
    neighborhood: pharmacy.neighborhood ?? undefined,
  };
}

function getFallbackDutyPharmacies(
  citySlug: string,
  period?: DutyPeriod,
): DutyPharmacy[] {
  const fallbackDuties = seedDuties[citySlug];
  if (!fallbackDuties || fallbackDuties.length === 0) return [];

  const todayIso = moroccoDateISO();
  const filtered = period
    ? fallbackDuties.filter((d) => {
        if (period === "24h") return d.period === "24h";
        if (period === "day") return d.period === "day" || d.period === "24h";
        if (period === "night") return d.period === "night" || d.period === "24h";
        return d.period === period;
      })
    : fallbackDuties;

  return filtered
    .map((d) => ({
      ...d,
      dutyDate: todayIso,
    }))
    .sort(sortDutyPharmacies);
}

export async function lastUpdatedFor(citySlug: string): Promise<Date | null> {
  if (!prisma) {
    if (seedDuties[citySlug]?.length) {
      return new Date(seedDuties[citySlug][0].scrapedAt);
    }
    return null;
  }

  try {
    const latestDuty = await prisma.dutySchedule.findFirst({
      where: { city: { slug: citySlug } },
      orderBy: { scrapedAt: "desc" },
      select: { scrapedAt: true },
    });

    if (latestDuty?.scrapedAt) {
      return latestDuty.scrapedAt;
    }

    if (seedDuties[citySlug]?.length) {
      return new Date(seedDuties[citySlug][0].scrapedAt);
    }

    return null;
  } catch (error) {
    warnDatabaseFailure(error);
    if (seedDuties[citySlug]?.length) {
      return new Date(seedDuties[citySlug][0].scrapedAt);
    }
    return null;
  }
}

export async function getCities(): Promise<City[]> {
  if (!prisma) return seedCities.filter((c) => c.isActive);

  try {
    const rows = await prisma.city.findMany({
      where: { isActive: true },
      orderBy: { nameFr: "asc" },
    });

    if (rows.length === 0) {
      return seedCities.filter((c) => c.isActive);
    }

    const dbCities = rows.map(mapCity);
    const dbSlugs = new Set(dbCities.map((c) => c.slug));
    const missingSeedCities = seedCities.filter(
      (c) => c.isActive && !dbSlugs.has(c.slug),
    );
    return [...dbCities, ...missingSeedCities].sort((a, b) =>
      a.nameFr.localeCompare(b.nameFr),
    );
  } catch (error) {
    warnDatabaseFailure(error);
    return seedCities.filter((c) => c.isActive);
  }
}

export async function getCityBySlug(slug: string): Promise<City | undefined> {
  if (!prisma) return seedCities.find((c) => c.slug === slug);

  try {
    const city = await prisma.city.findUnique({ where: { slug } });
    return city ? mapCity(city) : seedCities.find((c) => c.slug === slug);
  } catch (error) {
    warnDatabaseFailure(error);
    return seedCities.find((c) => c.slug === slug);
  }
}

export async function getPharmacyBySlug(
  citySlug: string,
  pharmacySlug: string,
): Promise<Pharmacy | undefined> {
  const findInSeed = () => {
    const city = seedCities.find((c) => c.slug === citySlug);
    if (!city) return undefined;
    return seedPharmacies.find(
      (p) =>
        (p.cityId === city.id || p.cityId === citySlug) &&
        p.slug === pharmacySlug,
    );
  };

  if (!prisma) {
    return findInSeed();
  }

  try {
    const city = await prisma.city.findUnique({ where: { slug: citySlug } });
    if (!city) return findInSeed();

    const pharmacy = await prisma.pharmacy.findUnique({
      where: {
        cityId_slug: {
          cityId: city.id,
          slug: pharmacySlug,
        },
      },
      include: { city: true },
    });

    return pharmacy ? mapPharmacy(pharmacy, pharmacy.city) : findInSeed();
  } catch (error) {
    warnDatabaseFailure(error);
    return findInSeed();
  }
}

export async function getDutyPharmacies(
  citySlug: string,
  period?: DutyPeriod,
): Promise<DutyPharmacy[]> {
  if (!prisma) {
    return getFallbackDutyPharmacies(citySlug, period);
  }

  try {
    const today = moroccoDateISO();
    const periodFilter = prismaPeriodsForFilter(period);
    let schedules = await prisma.dutySchedule.findMany({
      where: {
        city: { slug: citySlug },
        dutyDate: dateFromISO(today),
        ...(periodFilter ? { period: { in: periodFilter } } : {}),
      },
      include: {
        city: true,
        pharmacy: true,
        source: true,
      },
    });

    // Fallback for past-midnight / new calendar day before scrape refreshes:
    // Display the most recent verified duty schedule (e.g. night duty from previous evening).
    if (schedules.length === 0) {
      const latest = await prisma.dutySchedule.findFirst({
        where: { city: { slug: citySlug } },
        orderBy: { dutyDate: "desc" },
        select: { dutyDate: true },
      });
      if (latest) {
        schedules = await prisma.dutySchedule.findMany({
          where: {
            city: { slug: citySlug },
            dutyDate: latest.dutyDate,
            ...(periodFilter ? { period: { in: periodFilter } } : {}),
          },
          include: {
            city: true,
            pharmacy: true,
            source: true,
          },
        });
      }
    }

    if (schedules.length > 0) {
      return schedules
        .map((schedule) => ({
          ...mapPharmacy(schedule.pharmacy, schedule.city),
          period: mapDutyPeriod(schedule.period),
          dutyDate: isoDate(schedule.dutyDate),
          scrapedAt: schedule.scrapedAt.toISOString(),
          confidenceScore: schedule.confidenceScore,
          sourceUrl: schedule.sourceUrl ?? schedule.source?.baseUrl ?? SOURCE.baseUrl,
        }))
        .sort(sortDutyPharmacies);
    }

    return getFallbackDutyPharmacies(citySlug, period);
  } catch (error) {
    warnDatabaseFailure(error);
    return getFallbackDutyPharmacies(citySlug, period);
  }
}

export async function getPharmacyStaticParams(): Promise<
  { city: string; slug: string }[]
> {
  if (!prisma) {
    return seedPharmacies.map((p) => ({ city: p.cityId, slug: p.slug }));
  }

  try {
    const rows = await prisma.pharmacy.findMany({
      select: {
        slug: true,
        city: {
          select: { slug: true },
        },
      },
      orderBy: { name: "asc" },
    });

    if (rows.length === 0) {
      return seedPharmacies.map((p) => ({ city: p.cityId, slug: p.slug }));
    }

    const dbParams = rows.map((p) => ({ city: p.city.slug, slug: p.slug }));
    const dbKeys = new Set(dbParams.map((p) => `${p.city}/${p.slug}`));
    const missingSeedParams = seedPharmacies
      .filter((p) => !dbKeys.has(`${p.cityId}/${p.slug}`))
      .map((p) => ({ city: p.cityId, slug: p.slug }));

    return [...dbParams, ...missingSeedParams];
  } catch (error) {
    warnDatabaseFailure(error);
    return seedPharmacies.map((p) => ({ city: p.cityId, slug: p.slug }));
  }
}

export async function countDutyByPeriod(
  citySlug: string,
): Promise<Record<DutyPeriod, number>> {
  const all = await getDutyPharmacies(citySlug);
  return {
    day: all.filter((p) => p.period === "day" || p.period === "24h").length,
    night: all.filter((p) => p.period === "night" || p.period === "24h").length,
    "24h": all.filter((p) => p.period === "24h").length,
    unknown: all.filter((p) => p.period === "unknown").length,
  };
}
