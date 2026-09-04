import assert from "node:assert/strict";
import test from "node:test";
import { inferNeighborhood } from "./neighborhoods";

test("classifies clear Marrakech neighborhood aliases", () => {
  assert.equal(
    inferNeighborhood("marrakech", "Avenue Mohamed VI, pres de Gueliz Marrakech"),
    "Gueliz",
  );
  assert.equal(
    inferNeighborhood("marrakech", "Lot. Berradi 2 Mhamid 7 Marrakech"),
    "Mhamid",
  );
  assert.equal(
    inferNeighborhood("marrakech", "Place Jemaa El Fna Marrakech"),
    "Medina",
  );
});

test("does not classify an area from another city or an unknown address", () => {
  assert.equal(
    inferNeighborhood("casablanca", "Quartier Gueliz Marrakech"),
    undefined,
  );
  assert.equal(inferNeighborhood("agadir", "12 avenue inconnue"), undefined);
});
