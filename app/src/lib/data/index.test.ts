import assert from "node:assert/strict";
import test from "node:test";

test("never generates duty schedules when the database is unavailable", async () => {
  const databaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const { getDutyPharmacies } = await import("./index");
    assert.deepEqual(await getDutyPharmacies("casablanca"), []);
  } finally {
    if (databaseUrl) process.env.DATABASE_URL = databaseUrl;
  }
});
