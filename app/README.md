# app — Pharmacies de Garde Maroc

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. See the root
[`README.md`](../README.md) and [`PROJECT_PLAN.md`](../PROJECT_PLAN.md).

## Scripts

```bash
npm run dev              # start dev server (http://localhost:3000)
npm run build            # production build
npm run start            # serve the production build
npm run lint             # eslint
npm run test             # focused parser/timezone tests
npm run db:migrate       # apply Prisma migrations
npm run db:seed          # seed only source/city metadata
npm run scrape:telecontact # write a Telecontact snapshot to tmp/
npm run scrape:update    # import a snapshot into PostgreSQL
```

## Routes

| Path | Description |
| --- | --- |
| `/` · `/ar` | Homepage (FR / AR) |
| `/pharmacie-de-garde/[city]` · `/ar/...` | City duty list |
| `/pharmacie/[city]/[slug]` · `/ar/...` | Pharmacy detail |
| `/api/reports` | `POST` user error reports |
| `/sitemap.xml` · `/robots.txt` | SEO |

## Key folders

```
src/
  app/            # routes (FR at root, AR under /ar)
  components/     # UI (Header, CitySearch, PharmacyCard, DutyList, modals…)
  lib/
    data/         # Prisma-backed query layer; no generated duty fallback
    i18n.ts       # FR/AR dictionaries, locale + RTL helpers
    geo.ts        # haversine distance, map/tel/whatsapp links
    seo.ts        # metadata + JSON-LD builders
  scripts/        # Telecontact primary scraper plus Saydalia fallback scripts
  proxy.ts        # exposes pathname header for SSR locale/dir
prisma/
  schema.prisma   # Prisma/Supabase database schema
  migrations/     # reproducible SQL migrations with RLS hardening
```

## Supabase / Prisma setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to the Supabase transaction pooler URL.
3. Set `DIRECT_URL` to the Supabase session/direct URL for migrations.
4. Run:

```bash
npm run db:migrate
npm run db:seed
```

The app reads duty schedules only from PostgreSQL. Without a database connection
or a verified schedule for today, it displays an explicit unavailable state.

## Telecontact import

```bash
npm run scrape:telecontact -- --city casablanca
npm run scrape:update -- --file tmp/telecontact-latest.json
```

Omit `--city` to scrape all seed cities. The scraper uses Telecontact city pages
to discover zones, then calls the public zone/day JSON endpoint politely. The
updater writes pharmacies and duty schedules through Prisma, rejects an empty
city response, and removes stale schedules for the imported city/date.

## Automation and reports

`.github/workflows/update-duty-schedules.yml` refreshes the source every six
hours after the repository is pushed to GitHub. Add `DATABASE_URL` and
`DIRECT_URL` as repository secrets before enabling it.

Set `ADMIN_REPORT_TOKEN` to a random value of at least 32 characters, then open
`/admin/reports` to review and resolve public reports. The route uses an
HTTP-only, same-site session cookie and is excluded from search indexing.
