# Pharmacies de Garde Maroc

Bilingual (Français / العربية) SEO website & PWA that helps people quickly find
**duty pharmacies (pharmacies de garde)** in Morocco — with call, Google Maps and
Waze buttons, last-updated timestamps, source attribution and user reporting.

Full product plan: [`PROJECT_PLAN.md`](./PROJECT_PLAN.md).

## Quick start

```bash
cd app
npm install
npm run dev
```

Then open http://localhost:3000 (French) or http://localhost:3000/ar (Arabic).

## What's implemented

- **Mobile-first, bilingual UI** — French (LTR) at `/`, Arabic (RTL) at `/ar`,
  with a language switcher that preserves the current page.
- **Homepage** — hero, city autocomplete search, "use my location" (nearest city),
  popular cities grid with live duty counts, disclaimer and SEO intro text.
- **City duty pages** — `/pharmacie-de-garde/[city]` (and `/ar/...`): day / night / 24h
  filter tabs, distance sorting via geolocation, last-updated badge, source label,
  related cities and JSON-LD structured data.
- **Pharmacy detail pages** — `/pharmacie/[city]/[slug]`: map embed, big call/maps/waze
  actions and a sticky mobile action bar.
- **Report an error** — validated, rate-limited reports stored in PostgreSQL, with a private `/admin/reports` review area.
- **SEO & PWA** — per-page metadata + hreflang, `sitemap.xml`, `robots.txt`,
  `LocalBusiness`/`Pharmacy`/`BreadcrumbList` JSON-LD, web app manifest and theme color.

## Data

The app has a Prisma/PostgreSQL data layer ready for Supabase. City metadata can
fall back locally, but duty schedules never do: an unavailable database or a
missing verified schedule produces an explicit unavailable state.

Production flow:

```bash
cd app
npm run db:migrate
npm run db:seed
npm run scrape:telecontact
npm run scrape:update
```

The migration includes Supabase-oriented RLS hardening. The Telecontact scraper
writes a snapshot under `app/tmp/`, then imports pharmacies and `duty_schedules`
through Prisma. The importer uses Morocco's calendar date, rejects incomplete
city responses, and removes stale schedules.

After pushing the repository to GitHub, add `DATABASE_URL` and `DIRECT_URL` as
repository secrets. The included workflow refreshes the schedule every six hours.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma · Supabase/PostgreSQL.

## Project structure

```
pharmacies-garde-maroc/
  PROJECT_PLAN.md
  README.md
  docs/                 # data sources, SEO, monetization, legal notes
  app/                  # Next.js application (see app/README.md)
```

## Disclaimer

> Les informations sont fournies à titre indicatif et peuvent changer.
> Veuillez appeler la pharmacie avant de vous déplacer.
>
> المعلومات مقدمة للمساعدة وقد تتغير. يرجى الاتصال بالصيدلية قبل التوجه إليها.
