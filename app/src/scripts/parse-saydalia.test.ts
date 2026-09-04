import assert from "node:assert/strict";
import test from "node:test";
import { cities } from "../lib/data/cities";
import {
  dedupeSaydaliaRecords,
  filterSaydaliaRecordsForCity,
  parseSaydaliaItems,
} from "./parse-saydalia";

test("normalizes Saydalia duty records", () => {
  const records = parseSaydaliaItems(
    [
      {
        id: 42,
        title: "Pharmacie Exemple",
        Phone: "0612 34 56 78",
        address: " 12, Rue Exemple ",
        garde: "Garde de nuit",
        lat: "33.57",
        lng: "-7.59",
      },
    ],
    { cityName: "Casablanca", period: "day" },
  );

  assert.deepEqual(records[0], {
    sourceExternalId: "42",
    name: "Pharmacie Exemple",
    slug: "pharmacie-exemple",
    cityName: "Casablanca",
    address: "12, Rue Exemple",
    phone: "+212612345678",
    latitude: 33.57,
    longitude: -7.59,
    period: "night",
    dutyLabel: "Garde de nuit",
    sourceUrl: "https://saydalia.ma/fr/pharmacies-de-garde/",
    confidenceScore: 0.92,
  });
});

test("deduplicates records by source identity and duty period", () => {
  const record = parseSaydaliaItems(
    [{ id: 1, title: "Pharmacie A", lat: 33, lng: -7 }],
    { cityName: "Casablanca", period: "day" },
  )[0];

  assert.equal(dedupeSaydaliaRecords([record, record]).length, 1);
});

test("keeps only records published for the requested city", () => {
  const records = [
    ...parseSaydaliaItems(
      [{ id: 1, title: "Pharmacie Casa", Ville: "Casablanca", lat: 33.5, lng: -7.6 }],
      { cityName: "Marrakech", period: "day" },
    ),
    ...parseSaydaliaItems(
      [{ id: 2, title: "Pharmacie Rbat", Ville: "Rabat", lat: 34, lng: -6.8 }],
      { cityName: "Marrakech", period: "day" },
    ),
  ];

  assert.deepEqual(
    filterSaydaliaRecordsForCity(records, cities[0]).map((record) => record.name),
    ["Pharmacie Casa"],
  );
});
