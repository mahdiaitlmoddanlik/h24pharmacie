import assert from "node:assert/strict";
import test from "node:test";
import { getDutyHoursInfo } from "./duty-hours";

test("24h duty is always marked open", () => {
  const info = getDutyHoursInfo("24h", "fr");
  assert.equal(info.isOpen, true);
  assert.equal(info.badgeVariant, "continuous");
  assert.equal(info.scheduleText, "24h/24 sans interruption");
});

test("night duty is open at 23:30 and 03:00 Morocco time", () => {
  // 23:30 UTC = 23:30 Morocco (or within standard winter/summer offset)
  const date2330 = new Date("2026-10-16T22:30:00Z"); // In UTC, Morocco is UTC+1 -> 23:30
  const info = getDutyHoursInfo("night", "fr", date2330);
  assert.equal(info.isOpen, true);
  assert.equal(info.badgeVariant, "open");
  assert.ok(info.statusLabel.includes("Ouverte"));
});

test("night duty shows opens tonight when checked during midday", () => {
  const date1400 = new Date("2026-10-16T13:00:00Z"); // 14:00 Morocco
  const info = getDutyHoursInfo("night", "fr", date1400);
  assert.equal(info.isOpen, false);
  assert.equal(info.badgeVariant, "opening_soon");
  assert.ok(info.statusLabel.includes("22h00"));
});

test("day duty is open at 14:00 and closed at 23:30", () => {
  const date1400 = new Date("2026-10-16T13:00:00Z"); // 14:00 Morocco
  const infoOpen = getDutyHoursInfo("day", "fr", date1400);
  assert.equal(infoOpen.isOpen, true);
  assert.equal(infoOpen.badgeVariant, "open");

  const date2330 = new Date("2026-10-16T22:30:00Z"); // 23:30 Morocco
  const infoClosed = getDutyHoursInfo("day", "fr", date2330);
  assert.equal(infoClosed.isOpen, false);
});
