import { config } from "dotenv";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

config({ path: ".env.local" });
config();

const rawConnectionString = process.env.DATABASE_URL;

function normalizeConnectionString(url?: string): string | undefined {
  if (!url) return undefined;
  // Supabase pooler uses internal/intermediate certificates.
  // Replacing sslmode=require with sslmode=no-verify prevents pg-connection-string
  // from rejecting the Supabase pooler certificate in serverless Node environments.
  if (url.includes("sslmode=require") && !url.includes("uselibpqcompat=true")) {
    return url.replace("sslmode=require", "sslmode=no-verify");
  }
  return url;
}

const connectionString = normalizeConnectionString(rawConnectionString);

function createPrismaClient() {
  if (!connectionString) return null;

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient | null;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function hasDatabaseUrl() {
  return Boolean(connectionString);
}
