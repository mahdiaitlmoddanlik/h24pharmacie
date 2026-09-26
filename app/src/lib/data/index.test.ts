import assert from "node:assert/strict";
import test from "node:test";

test("never generates duty schedules when the database is unavailable and city has no seed duties", async () => {
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

test("returns verified fallback duty schedules for new cities when database is unavailable", async () => {
  const databaseUrl = process.env.DATABASE_URL;
  const globalPrisma = (globalThis as { prisma?: unknown }).prisma;
  process.env.DATABASE_URL = "";
  (globalThis as { prisma?: unknown }).prisma = null;

  try {
    const { getDutyPharmacies, lastUpdatedFor } = await import("./index");
    const elJadidaDuties = await getDutyPharmacies("el-jadida");
    assert.equal(elJadidaDuties.length, 14);
    assert.equal(elJadidaDuties.filter((d) => d.period === "day").length, 12);
    assert.equal(elJadidaDuties.filter((d) => d.period === "night").length, 2);
    assert.ok(elJadidaDuties.every((d) => d.phone && d.latitude && d.longitude));

    const safiDuties = await getDutyPharmacies("safi");
    assert.equal(safiDuties.length, 6);

    const meknesDuties = await getDutyPharmacies("meknes");
    assert.equal(meknesDuties.length, 9);

    const oujdaDuties = await getDutyPharmacies("oujda");
    assert.equal(oujdaDuties.length, 5);

    const updated = await lastUpdatedFor("el-jadida");
    assert.ok(updated instanceof Date);
  } finally {
    if (databaseUrl !== undefined) {
      process.env.DATABASE_URL = databaseUrl;
    } else {
      delete process.env.DATABASE_URL;
    }
    (globalThis as { prisma?: unknown }).prisma = globalPrisma;
  }
});

