import assert from "node:assert/strict";
import test from "node:test";
import { cities } from "../lib/data/cities";
import {
  canonicalizeTelecontactNeighborhoods,
  dedupeTelecontactRecords,
  extractTelecontactZones,
  filterTelecontactRecordsForCity,
  parseTelecontactItems,
  periodFromJour,
  telecontactApiUrl,
} from "./parse-telecontact";

test("normalizes Telecontact duty records", () => {
  const records = parseTelecontactItems(
    [
      {
        rs_comp: "Pharmacie Plaza",
        JOUR: 1,
        zone_de_garde: "Daoudiat",
        code_firme: "3267876",
        adresse: "  bd Abdelkrim Khattabi   opération Yanisse  imm. 2   n°4 ",
        ville: "Marrakech",
        tel: "05 24 30 73 76",
        longitude: "-8.01531087893386",
        latitude: "31.66376060280274",
      },
    ],
    {
      cityName: "Marrakech",
      sourceUrl: "https://www.telecontact.ma/pharmacie-de-garde-zone/marrakech/daoudiat.html",
    },
  );

  assert.deepEqual(records[0], {
    sourceExternalId: "3267876",
    name: "Pharmacie Plaza",
    slug: "pharmacie-plaza",
    cityName: "Marrakech",
    address: "bd Abdelkrim Khattabi opération Yanisse imm. 2 n°4",
    phone: "+212524307376",
    latitude: 31.66376060280274,
    longitude: -8.01531087893386,
    period: "day",
    dutyLabel: "Garde de jour",
    sourceUrl: "https://www.telecontact.ma/pharmacie-de-garde-zone/marrakech/daoudiat.html",
    neighborhood: "Daoudiat",
    confidenceScore: 0.95,
  });
});

test("maps Telecontact jour codes to periods", () => {
  assert.equal(periodFromJour(1), "day");
  assert.equal(periodFromJour(2), "night");
  assert.equal(periodFromJour(3), "24h");
  assert.equal(periodFromJour(undefined), "unknown");
});

test("uses the returned jour code for pharmacies included in multiple tab responses", () => {
  const records = parseTelecontactItems(
    [
      {
        code_firme: 42,
        rs_comp: "Pharmacie 24h",
        latitude: 34.02,
        longitude: -6.84,
        JOUR: 3,
      },
    ],
    {
      cityName: "Rabat",
      sourceUrl: "https://www.telecontact.ma/pharmacie-de-garde-zone/rabat/autre.html",
      zoneName: "Autre",
    },
  );

  assert.equal(records[0].period, "24h");
  assert.equal(records[0].dutyLabel, "Garde 24h/24");
});

test("keeps the autre zone slug in Telecontact API requests", () => {
  const url = telecontactApiUrl("rabat", "autre", "1");

  assert.equal(url.searchParams.get("zone"), "autre");
  assert.equal(url.searchParams.get("jour"), "1");
});

test("canonicalizes API neighborhood variants to source zone labels", () => {
  const record = parseTelecontactItems(
    [
      {
        code_firme: 7,
        rs_comp: "Pharmacie Fida",
        latitude: 33.57,
        longitude: -7.59,
        JOUR: 1,
        zone_de_garde: "El Fida Mers Sultan",
      },
    ],
    { cityName: "Casablanca", sourceUrl: "https://www.telecontact.ma" },
  )[0];

  const [canonical] = canonicalizeTelecontactNeighborhoods([record], [
    {
      citySlug: "casablanca",
      zoneSlug: "el-fida-mers-sultan",
      zoneName: "El Fida - Mers Sultan",
      sourceUrl: "https://www.telecontact.ma",
    },
  ]);

  assert.equal(canonical.neighborhood, "El Fida - Mers Sultan");
});

test("extracts zone links from Telecontact city HTML", () => {
  const html = `
    <a class="accordion-button" href="/pharmacie-de-garde-zone/marrakech/autre.html">Autre</a>
    <a class="accordion-button" href="/pharmacie-de-garde-zone/marrakech/ain-itti.html">Ain Itti <img /></a>
    <a class="accordion-button" href="/pharmacie-de-garde-zone/rabat/agdal.html">Agdal</a>
  `;

  assert.deepEqual(extractTelecontactZones(html, "marrakech"), [
    {
      citySlug: "marrakech",
      zoneSlug: "autre",
      zoneName: "Autre",
      sourceUrl: "https://www.telecontact.ma/pharmacie-de-garde-zone/marrakech/autre.html",
    },
    {
      citySlug: "marrakech",
      zoneSlug: "ain-itti",
      zoneName: "Ain Itti",
      sourceUrl: "https://www.telecontact.ma/pharmacie-de-garde-zone/marrakech/ain-itti.html",
    },
  ]);
});

test("deduplicates records by source identity and duty period", () => {
  const record = parseTelecontactItems(
    [{ code_firme: 1, rs_comp: "Pharmacie A", latitude: 33, longitude: -7, JOUR: 1 }],
    { cityName: "Casablanca", sourceUrl: "https://www.telecontact.ma" },
  )[0];

  assert.equal(dedupeTelecontactRecords([record, record]).length, 1);
});

test("keeps only records published for the requested city", () => {
  const records = [
    ...parseTelecontactItems(
      [{ code_firme: 1, rs_comp: "Pharmacie Casa", ville: "Casablanca", latitude: 33.5, longitude: -7.6 }],
      { cityName: "Marrakech", sourceUrl: "https://www.telecontact.ma" },
    ),
    ...parseTelecontactItems(
      [{ code_firme: 2, rs_comp: "Pharmacie Rbat", ville: "Rabat", latitude: 34, longitude: -6.8 }],
      { cityName: "Marrakech", sourceUrl: "https://www.telecontact.ma" },
    ),
  ];

  assert.deepEqual(
    filterTelecontactRecordsForCity(records, cities[0]).map((record) => record.name),
    ["Pharmacie Casa"],
  );
});
