import assert from "node:assert/strict";
import test from "node:test";

test("never generates duty schedules when the database is unavailable", async () => {
  const databaseUrl = process.env.DATABASE_URL;
  const globalPrisma = (globalThis as { prisma?: unknown }).prisma;
  process.env.DATABASE_URL = "";
  (globalThis as { prisma?: unknown }).prisma = null;

  try {
    const { getDutyPharmacies } = await import("./index");
    assert.deepEqual(await getDutyPharmacies("casablanca"), []);
  } finally {
    if (databaseUrl !== undefined) {
      process.env.DATABASE_URL = databaseUrl;
    } else {
      delete process.env.DATABASE_URL;
    }
    (globalThis as { prisma?: unknown }).prisma = globalPrisma;
  }
});
