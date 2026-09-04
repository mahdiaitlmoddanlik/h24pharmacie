import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { cities } from "../src/lib/data/cities";

config({ path: ".env.local" });
config();

const SOURCE = {
  id: "telecontact",
  name: "Telecontact.ma",
  baseUrl: "https://www.telecontact.ma/services/pharmacies-de-garde/Maroc",
  type: "website" as const,
};

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Set DIRECT_URL or DATABASE_URL before running prisma seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.source.upsert({
    where: { id: SOURCE.id },
    update: {
      name: SOURCE.name,
      baseUrl: SOURCE.baseUrl,
      type: SOURCE.type,
    },
    create: SOURCE,
  });

  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: {
        nameFr: city.nameFr,
        nameAr: city.nameAr,
        slug: city.slug,
        region: city.region,
        regionAr: city.regionAr,
        latitude: city.latitude,
        longitude: city.longitude,
        isActive: city.isActive,
      },
      create: {
        id: city.id,
        nameFr: city.nameFr,
        nameAr: city.nameAr,
        slug: city.slug,
        region: city.region,
        regionAr: city.regionAr,
        latitude: city.latitude,
        longitude: city.longitude,
        isActive: city.isActive,
      },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
