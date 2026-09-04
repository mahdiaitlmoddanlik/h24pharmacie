import assert from "node:assert/strict";
import test from "node:test";
import { moroccoDateISO } from "./dates";

test("uses the Morocco calendar date around UTC midnight", () => {
  assert.equal(moroccoDateISO(new Date("2026-07-09T23:30:00.000Z")), "2026-07-10");
});

test("keeps the Morocco calendar date before midnight", () => {
  assert.equal(moroccoDateISO(new Date("2026-07-10T21:30:00.000Z")), "2026-07-10");
});
