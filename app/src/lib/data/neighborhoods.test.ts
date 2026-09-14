import test from "node:test";
import assert from "node:assert/strict";
import {
  getZonesForCity,
  getZoneBySlug,
  matchesZone,
  getAllZoneStaticParams,
  getZoneName,
} from "./neighborhoods";
import { getHomeFaqs, getCityFaqs, getZoneFaqs, getFaqSectionMeta } from "@/lib/faqs";
import { locales } from "@/lib/i18n";

test("neighborhoods registry provides canonical zones for top cities", () => {
  const casaZones = getZonesForCity("casablanca");
  assert.ok(casaZones.length >= 10);
  assert.ok(casaZones.some((z) => z.slug === "maarif"));
  assert.ok(casaZones.some((z) => z.slug === "ain-sebaa"));

  const marrakechZones = getZonesForCity("marrakech");
  assert.ok(marrakechZones.length >= 8);
  assert.ok(marrakechZones.some((z) => z.slug === "gueliz"));
  assert.ok(marrakechZones.some((z) => z.slug === "medina"));

  const rabatZones = getZonesForCity("rabat");
  assert.ok(rabatZones.some((z) => z.slug === "agdal"));
  assert.ok(rabatZones.some((z) => z.slug === "hay-riad"));
});

test("matchesZone matches aliases with accents, case differences, and compound names", () => {
  const maarif = getZoneBySlug("casablanca", "maarif");
  assert.ok(maarif);
  assert.equal(matchesZone("Maarif", maarif), true);
  assert.equal(matchesZone("Maârif", maarif), true);
  assert.equal(matchesZone("Ville Bourgogne Maarif", maarif), true);
  assert.equal(matchesZone("Sidi Bernoussi", maarif), false);

  const gueliz = getZoneBySlug("marrakech", "gueliz");
  assert.ok(gueliz);
  assert.equal(matchesZone("Guéliz", gueliz), true);
  assert.equal(matchesZone("Grand Gueliz", gueliz), true);
  assert.equal(matchesZone("gueliz", gueliz), true);
  assert.equal(matchesZone("Targa", gueliz), false);
});

test("getAllZoneStaticParams produces valid city and zone slug pairs", () => {
  const params = getAllZoneStaticParams();
  assert.ok(params.length > 30);
  for (const { city, zone } of params) {
    assert.ok(city && typeof city === "string");
    assert.ok(zone && typeof zone === "string");
    assert.ok(!zone.includes(" "));
    assert.ok(!zone.includes("/"));
  }
});

test("faqs provide full translations across all 4 locales (fr, ar, en, es)", () => {
  for (const locale of locales) {
    const homeFaqs = getHomeFaqs(locale);
    assert.ok(homeFaqs.length >= 4);
    for (const faq of homeFaqs) {
      assert.ok(faq.question.length > 5, `Empty question in home FAQ for ${locale}`);
      assert.ok(faq.answer.length > 10, `Empty answer in home FAQ for ${locale}`);
    }

    const cityFaqs = getCityFaqs(locale, "Casablanca");
    assert.ok(cityFaqs.length >= 3);
    for (const faq of cityFaqs) {
      assert.ok(faq.question.length > 5, `Empty question in city FAQ for ${locale}`);
      assert.ok(faq.answer.length > 10, `Empty answer in city FAQ for ${locale}`);
    }

    const zoneFaqs = getZoneFaqs(locale, "Casablanca", "Maârif");
    assert.ok(zoneFaqs.length >= 3);
    for (const faq of zoneFaqs) {
      assert.ok(faq.question.length > 5, `Empty question in zone FAQ for ${locale}`);
      assert.ok(faq.answer.length > 10, `Empty answer in zone FAQ for ${locale}`);
    }

    const meta = getFaqSectionMeta(locale, "Casablanca");
    assert.ok(meta.title.length > 0);
    assert.ok(meta.subtitle.length > 0);
  }
});

test("buildWhatsAppShareUrl builds valid WhatsApp share links with metadata", () => {
  const { buildWhatsAppShareUrl } = require("@/lib/geo");
  const url = buildWhatsAppShareUrl(
    {
      name: "Pharmacie Guéliz",
      phone: "0524430101",
      address: "Av. Mohammed V",
      slug: "pharmacie-gueliz",
      cityId: "marrakech",
    },
    "fr",
  );

  assert.ok(url.startsWith("https://api.whatsapp.com/send?text="));
  const decoded = decodeURIComponent(url);
  assert.ok(decoded.includes("Pharmacie Guéliz"));
  assert.ok(decoded.includes("0524430101"));
  assert.ok(decoded.includes("Av. Mohammed V"));
  assert.ok(decoded.includes("utm_source=whatsapp"));
});
