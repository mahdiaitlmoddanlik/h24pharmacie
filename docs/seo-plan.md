# SEO Plan

## Target keywords

**French:** pharmacie de garde casablanca · pharmacie de garde rabat · pharmacie de
garde marrakech · pharmacie de garde nuit casablanca · pharmacie ouverte maintenant
maroc · pharmacie de garde près de moi · pharmacie de garde aujourd'hui

**Arabic:** صيدلية الحراسة الدار البيضاء · صيدليات الحراسة الرباط · صيدلية مفتوحة الآن ·
صيدليات الحراسة اليوم · صيدلية الحراسة مراكش

**Darija / Latin:** pharmacie garde casa · pharmacie garde rabat · saydalia garde
casablanca · pharmacie nuit casa

## URL structure

```
/pharmacie-de-garde/casablanca         (FR)
/ar/pharmacie-de-garde/casablanca      (AR)
/pharmacie/casablanca/pharmacie-al-amal
```

> Note: Arabic city pages use the same `/pharmacie-de-garde/` segment under the
> `/ar` prefix for a consistent, symmetric structure and easy hreflang mapping.

## Implemented

- Per-page `<title>` / meta description (FR + AR).
- `hreflang` alternates between FR and AR (`alternates.languages`).
- Canonical URLs.
- `sitemap.xml` with language alternates + `robots.txt`.
- JSON-LD: `ItemList` of `Pharmacy`, `BreadcrumbList`.
- Open Graph / Twitter cards.
- Unique SEO intro text per city page (avoid thin/duplicate pages).

## Metadata examples

```
Pharmacie de garde Casablanca aujourd'hui — Jour et Nuit
صيدليات الحراسة بالدار البيضاء اليوم — نهار وليل
```
