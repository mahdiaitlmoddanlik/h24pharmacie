# Pharmacies de Garde Maroc — Website/PWA Project Plan

> **Project folder:** `M:/Vibe/pharmacies-garde-maroc/`  
> **Main plan file:** `M:/Vibe/pharmacies-garde-maroc/PROJECT_PLAN.md`

## Goal

Build a bilingual French/Arabic SEO website/PWA for **Pharmacies de garde au Maroc** that helps users quickly find duty pharmacies by city or location, with call/map buttons, last-updated timestamps, source attribution, user reports, and future monetization through ads and sponsored/verified pharmacy listings.

## Core Product Concept

A fast mobile-first website where users can search:

- `pharmacie de garde casablanca`
- `pharmacie de garde rabat nuit`
- `صيدليات الحراسة الدار البيضاء`
- `pharmacie ouverte maintenant maroc`
- `pharmacie de garde près de moi`

Then immediately see:

- pharmacy name
- day/night duty status
- address
- phone number
- Google Maps/Waze directions
- distance from current location
- last updated time
- source/verification status
- report incorrect info button

## Recommended Product Type

Start with a **website/PWA**, not a native mobile app.

Reasons:

1. Search demand comes from Google.
2. Emergency users do not want to install an app first.
3. SEO city pages can bring passive traffic.
4. PWA can later behave like an app with install prompt.
5. Android app can be added after traffic is proven.

---

# Phase 0 — Project Principles

## Important Rules

1. **Accuracy first.** Wrong health/emergency information damages trust.
2. **Source attribution.** Always show where/when data was last checked.
3. **Cache data.** Never scrape the source site on every user request.
4. **Respect source websites.** Do not overload, bypass protections, or copy branding/design.
5. **Add unique value.** Better UX, bilingual SEO, location search, reporting, verification.
6. **Start small.** Validate with a few cities before scaling nationwide.

## Legal/Ethical Notes

- Public facts like pharmacy name, address, phone, GPS, city, and duty date are generally factual data, but database copying can still create disputes.
- Use Saydalia.ma as one public source/seed, not the entire long-term dependency.
- Include attribution and contact/removal/update flow.
- If a data source requests removal or no scraping, comply.
- Add disclaimer: users should call pharmacy before going.

Suggested disclaimer:

> Les informations sont fournies à titre indicatif et peuvent changer. Veuillez appeler la pharmacie avant de vous déplacer.

Arabic disclaimer:

> المعلومات مقدمة للمساعدة وقد تتغير. يرجى الاتصال بالصيدلية قبل التوجه إليها.

---

# Phase 1 — MVP Scope

## Initial Cities

Start with 6 high-value cities:

1. Casablanca
2. Rabat
3. Marrakech
4. Tanger
5. Fès
6. Agadir

Optional next cities:

- Meknès
- Oujda
- Tétouan
- Salé
- Kenitra
- El Jadida
- Nador
- Safi
- Beni Mellal
- Dakhla
- Laayoune

## MVP Features

### Public Website

- Homepage with city search
- Popular city cards
- City pharmacy duty pages
- Pharmacy detail pages
- French/Arabic interface
- Mobile-first UI
- Call button
- Google Maps button
- Waze button
- Last updated timestamp
- Source label
- Report incorrect info button
- Basic SEO metadata
- Sitemap
- Robots.txt

### Admin/Internal Features

- Scraper status page or admin table
- Manual data correction ability
- Report review queue
- City update timestamps
- Failed scrape alerts/logs

### Data Pipeline

- Scheduled scraping/import job
- Raw HTML/data snapshot storage
- Parser/normalizer
- Database upsert
- Public API for frontend
- City page generation

---

# Phase 2 — Suggested Tech Stack

## Recommended Stack

### Frontend + Backend

- **Next.js** with App Router
- **TypeScript**
- **Tailwind CSS**
- **PostgreSQL** database
- **Prisma ORM**
- **Supabase** or self-hosted PostgreSQL
- **Node.js scraper scripts** or Python scraper scripts
- **Vercel** for frontend deployment, or VPS if scraper/backend needs more control

### Why Next.js

- Great SEO support
- Static/server rendering for city pages
- Easy API routes
- Good PWA support
- Fast mobile pages
- Easy future monetization with AdSense

### Alternative Simpler Stack

If you prefer quick SEO publishing over custom app features:

- WordPress
- Custom plugin/script for data import
- RankMath/Yoast
- AdSense
- Caching plugin

But for a better app-like experience, use **Next.js + PostgreSQL**.

---

# Phase 3 — Folder Structure

Recommended project structure:

```text
M:/Vibe/pharmacies-garde-maroc/
  PROJECT_PLAN.md
  README.md
  docs/
    data-sources.md
    seo-plan.md
    monetization-plan.md
    legal-notes.md
  app/
    package.json
    next.config.js
    tailwind.config.ts
    prisma/
      schema.prisma
    src/
      app/
        page.tsx
        layout.tsx
        sitemap.ts
        robots.ts
        pharmacie-de-garde/[city]/page.tsx
        ar/[city]/page.tsx
        pharmacie/[city]/[slug]/page.tsx
        api/
          cities/route.ts
          pharmacies/route.ts
          reports/route.ts
      components/
        CitySearch.tsx
        PharmacyCard.tsx
        LanguageSwitcher.tsx
        ReportIssueModal.tsx
        AdSlot.tsx
      lib/
        db.ts
        geo.ts
        seo.ts
        normalize.ts
        sources.ts
      scripts/
        scrape-saydalia.ts
        parse-saydalia.ts
        update-duty-schedules.ts
        seed-cities.ts
      tests/
        normalize.test.ts
        geo.test.ts
        parser-saydalia.test.ts
```

---

# Phase 4 — Database Design

## Table: `sources`

Stores data source metadata.

Fields:

- `id`
- `name`
- `baseUrl`
- `type` — `website`, `manual`, `official`, `user`, `pharmacy`
- `lastCheckedAt`
- `createdAt`
- `updatedAt`

Example source:

```text
name: Saydalia.ma
baseUrl: https://saydalia.ma/fr/pharmacies-de-garde/
type: website
```

## Table: `cities`

Fields:

- `id`
- `nameFr`
- `nameAr`
- `slug`
- `region`
- `latitude`
- `longitude`
- `isActive`
- `createdAt`
- `updatedAt`

Example:

```text
nameFr: Casablanca
nameAr: الدار البيضاء
slug: casablanca
latitude: 33.5731
longitude: -7.5898
```

## Table: `pharmacies`

Fields:

- `id`
- `name`
- `slug`
- `cityId`
- `address`
- `phone`
- `whatsapp`
- `latitude`
- `longitude`
- `googleMapsUrl`
- `wazeUrl`
- `sourceId`
- `verificationStatus` — `unverified`, `source_verified`, `user_confirmed`, `pharmacy_claimed`
- `claimedByPharmacy`
- `createdAt`
- `updatedAt`

## Table: `duty_schedules`

Fields:

- `id`
- `pharmacyId`
- `cityId`
- `dutyDate`
- `period` — `day`, `night`, `24h`, `unknown`
- `sourceId`
- `sourceUrl`
- `scrapedAt`
- `confidenceScore`
- `createdAt`
- `updatedAt`

## Table: `scrape_runs`

Fields:

- `id`
- `sourceId`
- `startedAt`
- `finishedAt`
- `status` — `success`, `partial`, `failed`
- `citiesUpdated`
- `recordsFound`
- `errorMessage`
- `rawSnapshotPath`

## Table: `reports`

Fields:

- `id`
- `pharmacyId`
- `cityId`
- `issueType` — `closed`, `wrong_phone`, `wrong_address`, `not_on_duty`, `other`
- `message`
- `userIpHash`
- `status` — `new`, `reviewed`, `resolved`, `rejected`
- `createdAt`
- `updatedAt`

---

# Phase 5 — Data Source Plan

## Primary Seed Source

Saydalia page:

```text
https://saydalia.ma/fr/pharmacies-de-garde/
```

Use it carefully as a public data source.

## Scraping Rules

- Scrape only required pages.
- Cache results in database.
- Do not scrape on every page view.
- Use a polite user-agent.
- Add delays/retries.
- Run only a few times per day.
- Store raw snapshots for debugging.
- Do not hotlink images or copy design/branding.
- Stop if requested.

Suggested scrape schedule:

```text
08:00 — morning refresh
14:00 — afternoon refresh
20:00 — evening refresh
23:30 — night refresh
```

## Scraper Output Format

Normalize scraped data to this structure:

```json
{
  "city": "Casablanca",
  "period": "night",
  "date": "2026-06-28",
  "pharmacies": [
    {
      "name": "Pharmacie Example",
      "address": "123 Boulevard Example, Casablanca",
      "phone": "+212...",
      "latitude": 33.5731,
      "longitude": -7.5898,
      "googleMapsUrl": "https://maps.google.com/...",
      "sourceUrl": "https://saydalia.ma/fr/pharmacies-de-garde/"
    }
  ]
}
```

## Fallback Sources to Add Later

- Official pharmacy syndicate/city publications
- Local Facebook pages
- Pharmacy owner submissions
- User reports
- Manual admin CSV upload

---

# Phase 6 — SEO Plan

## Main SEO Targets

French keywords:

- pharmacie de garde casablanca
- pharmacie de garde rabat
- pharmacie de garde marrakech
- pharmacie de garde nuit casablanca
- pharmacie ouverte maintenant maroc
- pharmacie de garde près de moi
- pharmacie de garde aujourd'hui

Arabic keywords:

- صيدلية الحراسة الدار البيضاء
- صيدليات الحراسة الرباط
- صيدلية مفتوحة الآن
- صيدليات الحراسة اليوم
- صيدلية الحراسة مراكش

Darija/Latin search variants:

- pharmacie garde casa
- pharmacie garde rabat
- saydalia garde casablanca
- pharmacie nuit casa

## URL Structure

French:

```text
/pharmacie-de-garde/casablanca
/pharmacie-de-garde/rabat
/pharmacie-de-garde/marrakech
```

Arabic:

```text
/ar/pharmacie-garde/casablanca
/ar/pharmacie-garde/rabat
```

Pharmacy profile:

```text
/pharmacie/casablanca/pharmacie-al-amal
```

## Metadata Example

City page title:

```text
Pharmacie de garde Casablanca aujourd'hui — Jour et Nuit
```

Meta description:

```text
Trouvez les pharmacies de garde à Casablanca aujourd'hui: adresses, téléphones, itinéraires Google Maps et Waze. Données mises à jour régulièrement.
```

Arabic title:

```text
صيدليات الحراسة بالدار البيضاء اليوم — نهار وليل
```

## Structured Data

Add JSON-LD for:

- `LocalBusiness`
- `Pharmacy`
- `MedicalBusiness`
- `BreadcrumbList`

## SEO Content Blocks

Each city page should include a short unique text:

- how to find a duty pharmacy in the city
- call before going disclaimer
- mention day/night duty
- list nearby neighborhoods if available

Avoid thin duplicate pages.

---

# Phase 7 — UI/UX Plan

## Homepage Layout

1. Hero section:
   - title: “Pharmacies de garde au Maroc”
   - subtitle: “Trouvez rapidement une pharmacie ouverte près de vous”
   - city search bar
   - use my location button

2. Popular cities grid:
   - Casablanca
   - Rabat
   - Marrakech
   - Tanger
   - Fès
   - Agadir

3. Emergency disclaimer

4. SEO intro text

5. Footer with links and legal pages

## City Page Layout

1. City title:
   - “Pharmacie de garde Casablanca aujourd’hui”

2. Last updated badge:
   - “Dernière mise à jour: 28/06/2026 22:30”

3. Day/night tabs:
   - Jour
   - Nuit
   - 24h

4. Pharmacy cards:
   - name
   - address
   - phone call button
   - Google Maps button
   - Waze button
   - distance if location enabled
   - report issue

5. Source/disclaimer block

6. Related city links

## Pharmacy Card Design

Each card should prioritize actions:

- Big pharmacy name
- Address
- `Appeler` button
- `Google Maps` button
- `Waze` button
- `Signaler une erreur` small link

## Mobile First Requirements

- Load fast on 3G/4G
- Buttons large enough for emergency use
- No intrusive ad before useful result
- Sticky bottom call/map actions only on detail page

---

# Phase 8 — Monetization Plan

## Stage 1: AdSense

Add ads only after basic traffic and content quality exist.

Good placements:

- Below search block
- Between list sections
- Footer/sidebar on desktop
- One mobile sticky ad only if it does not hurt UX

Avoid:

- Popups
- Interstitials
- Too many ads before pharmacy results

## Stage 2: Featured Pharmacy Listings

Offer pharmacies:

- verified badge
- logo/photo
- WhatsApp button
- priority display when relevant
- service tags
- dashboard analytics

Pricing ideas:

- 50 MAD/month basic verified profile
- 100 MAD/month enhanced profile
- 200 MAD/month sponsored city placement

## Stage 3: Sponsored Health Ads

Potential advertisers:

- labs
- clinics
- dentists
- parapharmacies
- telemedicine services
- medical transport
- home nurse services
- health insurance agents

## Stage 4: Pharmacy Dashboard SaaS

Features:

- update profile
- confirm duty status
- add WhatsApp
- add services
- see clicks/calls/directions

Pricing:

- 49–199 MAD/month

---

# Phase 9 — Detailed Implementation Tasks

## Task 1 — Create Project Repository

**Objective:** Create the base project folder and initialize app structure.

**Files:**

- Create: `M:/Vibe/pharmacies-garde-maroc/README.md`
- Create: `M:/Vibe/pharmacies-garde-maroc/docs/data-sources.md`
- Create: `M:/Vibe/pharmacies-garde-maroc/docs/seo-plan.md`
- Create: `M:/Vibe/pharmacies-garde-maroc/docs/monetization-plan.md`
- Create: `M:/Vibe/pharmacies-garde-maroc/app/`

**Commands:**

```bash
cd /m/Vibe/pharmacies-garde-maroc
npx create-next-app@latest app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Verification:**

```bash
cd /m/Vibe/pharmacies-garde-maroc/app
npm run dev
```

Open:

```text
http://localhost:3000
```

Expected: Next.js starter page loads.

---

## Task 2 — Add Database and Prisma

**Objective:** Add PostgreSQL ORM setup.

**Commands:**

```bash
cd /m/Vibe/pharmacies-garde-maroc/app
npm install prisma @prisma/client
npx prisma init
```

**Files:**

- Modify: `app/prisma/schema.prisma`
- Modify: `app/.env`

**Verification:**

```bash
npx prisma validate
```

Expected: Prisma schema validates.

---

## Task 3 — Define Prisma Schema

**Objective:** Add the database models for cities, pharmacies, schedules, sources, scrape runs, and reports.

**File:**

- Modify: `app/prisma/schema.prisma`

**Models to add:**

- `Source`
- `City`
- `Pharmacy`
- `DutySchedule`
- `ScrapeRun`
- `Report`

**Verification:**

```bash
npx prisma format
npx prisma validate
```

Expected: schema formatted and valid.

---

## Task 4 — Seed Initial Cities

**Objective:** Add seed script for initial Moroccan cities.

**Files:**

- Create: `app/src/scripts/seed-cities.ts`

Initial cities:

- Casablanca
- Rabat
- Marrakech
- Tanger
- Fès
- Agadir

**Verification:**

```bash
npx tsx src/scripts/seed-cities.ts
```

Expected: cities inserted/upserted into database.

---

## Task 5 — Build Normalization Utilities

**Objective:** Normalize city names, pharmacy names, phone numbers, addresses, and slugs.

**Files:**

- Create: `app/src/lib/normalize.ts`
- Create: `app/src/tests/normalize.test.ts`

Functions:

- `normalizeCityName(input)`
- `normalizePhone(input)`
- `slugifyPharmacyName(input)`
- `cleanAddress(input)`

**Verification:**

```bash
npm test
```

Expected: normalization tests pass.

---

## Task 6 — Build Geo Utilities

**Objective:** Calculate distance and generate map links.

**Files:**

- Create: `app/src/lib/geo.ts`
- Create: `app/src/tests/geo.test.ts`

Functions:

- `haversineDistanceKm(a, b)`
- `buildGoogleMapsDirectionsUrl(lat, lng)`
- `buildWazeUrl(lat, lng)`

**Verification:**

```bash
npm test
```

Expected: geo tests pass.

---

## Task 7 — Investigate Saydalia Page Structure

**Objective:** Determine reliable selectors/API calls for extracting pharmacy duty data.

**Files:**

- Create: `docs/data-sources.md`
- Create: `app/src/scripts/inspect-saydalia.ts`

**Investigation checklist:**

- Check if data is in static HTML.
- Check if data is loaded by JavaScript/AJAX.
- Check WordPress `admin-ajax.php` calls.
- Check if city filter has hidden endpoint.
- Save sample HTML snapshot.
- Document selectors and risks.

**Verification:**

Run:

```bash
npx tsx src/scripts/inspect-saydalia.ts
```

Expected: prints detected cities/pharmacy data or documents where data is loaded from.

---

## Task 8 — Build Saydalia Scraper

**Objective:** Fetch and parse pharmacy duty data from Saydalia responsibly.

**Files:**

- Create: `app/src/scripts/scrape-saydalia.ts`
- Create: `app/src/scripts/parse-saydalia.ts`
- Create: `app/src/tests/parser-saydalia.test.ts`

Scraper requirements:

- polite user-agent
- timeout
- retry with backoff
- store raw snapshot
- no scraping on every request
- parser test with saved sample

**Verification:**

```bash
npx tsx src/scripts/scrape-saydalia.ts
npm test
```

Expected:

- raw snapshot saved
- normalized pharmacy records printed
- parser tests pass

---

## Task 9 — Upsert Scraped Data

**Objective:** Save scraped records into database.

**Files:**

- Create: `app/src/scripts/update-duty-schedules.ts`
- Modify: `app/src/lib/db.ts`

Behavior:

- upsert source
- upsert pharmacy
- upsert duty schedule
- create scrape run record
- mark failed run if parser breaks

**Verification:**

```bash
npx tsx src/scripts/update-duty-schedules.ts
npx prisma studio
```

Expected:

- cities exist
- pharmacies exist
- duty schedules exist
- scrape run logged

---

## Task 10 — Build Homepage

**Objective:** Create the first public page.

**Files:**

- Modify: `app/src/app/page.tsx`
- Create: `app/src/components/CitySearch.tsx`

Homepage sections:

- hero
- search city
- use my location button
- popular cities
- disclaimer
- SEO intro text

**Verification:**

```bash
npm run dev
```

Expected: homepage loads and is mobile-friendly.

---

## Task 11 — Build City Page

**Objective:** Show current duty pharmacies for a city.

**Files:**

- Create: `app/src/app/pharmacie-de-garde/[city]/page.tsx`
- Create: `app/src/components/PharmacyCard.tsx`

Page features:

- city title
- last updated timestamp
- day/night tabs if data supports it
- pharmacy cards
- call/map/waze buttons
- source/disclaimer
- related city links

**Verification:**

Open:

```text
http://localhost:3000/pharmacie-de-garde/casablanca
```

Expected: Casablanca page shows duty pharmacies from database.

---

## Task 12 — Build Report Issue Flow

**Objective:** Let users report wrong pharmacy info.

**Files:**

- Create: `app/src/components/ReportIssueModal.tsx`
- Create: `app/src/app/api/reports/route.ts`

Report types:

- closed
- wrong phone
- wrong address
- not on duty
- other

**Verification:**

- Submit a test report.
- Confirm it appears in database.

---

## Task 13 — Add Arabic Pages/Language Switcher

**Objective:** Add bilingual experience.

**Files:**

- Create: `app/src/components/LanguageSwitcher.tsx`
- Create: `app/src/app/ar/[city]/page.tsx`
- Modify: metadata generation

**Verification:**

Open Arabic city page and verify RTL layout.

---

## Task 14 — Add SEO Metadata, Sitemap, Robots

**Objective:** Prepare for indexing.

**Files:**

- Create: `app/src/app/sitemap.ts`
- Create: `app/src/app/robots.ts`
- Modify: city page metadata
- Modify: pharmacy page metadata

**Verification:**

Open:

```text
http://localhost:3000/sitemap.xml
http://localhost:3000/robots.txt
```

Expected: valid sitemap and robots output.

---

## Task 15 — Add Ad Slots

**Objective:** Prepare monetization without hurting UX.

**Files:**

- Create: `app/src/components/AdSlot.tsx`

Ad positions:

- homepage below search
- city page below first useful result block
- footer desktop area

**Verification:**

Ad placeholders render in development. No intrusive ad before pharmacy results.

---

## Task 16 — Add PWA Support

**Objective:** Make the website installable.

**Files:**

- Create: `app/public/manifest.webmanifest`
- Add icons to `app/public/icons/`
- Modify: `app/src/app/layout.tsx`

Features:

- app name
- theme color
- icons
- installable manifest

**Verification:**

Chrome Lighthouse PWA check passes basic installability.

---

## Task 17 — Deployment

**Objective:** Deploy website and scraper safely.

Options:

### Option A — Vercel + Supabase

- Vercel for website
- Supabase PostgreSQL
- GitHub Actions or cron service for scraper

### Option B — VPS

- Docker Compose
- PostgreSQL
- Next.js app
- cron scraper
- Nginx/Caddy reverse proxy

Recommended for scraper control: **VPS**.  
Recommended for fast start: **Vercel + Supabase + external cron**.

**Verification:**

- Production site loads.
- Scheduled scraper updates data.
- Sitemap accessible.
- Google Search Console added.

---

# Phase 10 — Launch Checklist

## Before Launch

- [ ] At least 6 cities have data.
- [ ] Each city page has useful content.
- [ ] Call buttons work.
- [ ] Maps/Waze buttons work.
- [ ] Last updated time is visible.
- [ ] Source label is visible.
- [ ] Disclaimer is visible.
- [ ] Report issue works.
- [ ] Sitemap exists.
- [ ] Robots file exists.
- [ ] Mobile performance is good.
- [ ] No intrusive ads.

## After Launch

- [ ] Submit sitemap to Google Search Console.
- [ ] Track indexed pages.
- [ ] Track top city keywords.
- [ ] Track clicks on call/map buttons.
- [ ] Monitor scrape failures.
- [ ] Review user reports weekly.
- [ ] Add more cities based on search impressions.

---

# Phase 11 — Growth Plan

## Month 1

- Build MVP.
- Launch 6 cities.
- Submit to Google Search Console.
- Add analytics.
- Monitor search impressions.

## Month 2

- Expand to 15–25 cities.
- Improve Arabic pages.
- Add user reports.
- Apply for AdSense if content/traffic is sufficient.

## Month 3

- Add pharmacy profile pages.
- Add claim pharmacy flow.
- Start contacting pharmacies for verified listings.
- Add local sponsored ad slots.

## Month 4+

- Build pharmacy dashboard.
- Add self-serve sponsorship.
- Add Android wrapper app only if traffic justifies it.
- Add additional medical/local services.

---

# Key Risks and Mitigations

## Risk: Data source blocks scraper

Mitigation:

- scrape politely
- cache data
- avoid aggressive crawling
- add fallback sources
- allow manual upload
- build pharmacy self-claim/update system

## Risk: Incorrect pharmacy data

Mitigation:

- show last updated time
- add call-first disclaimer
- user reports
- admin review
- confidence score
- multiple sources later

## Risk: Low AdSense revenue

Mitigation:

- add featured listings
- direct sponsors
- pharmacy dashboard
- health-related local ads

## Risk: SEO competition

Mitigation:

- faster mobile UX
- Arabic + French content
- city-specific pages
- location-based nearest pharmacy
- structured data
- fresh timestamps

---

# Success Metrics

## Traffic Metrics

- indexed pages
- impressions in Google Search Console
- clicks by city keyword
- mobile page speed
- bounce rate

## Utility Metrics

- call button clicks
- map button clicks
- user location searches
- report submissions

## Data Quality Metrics

- scrape success rate
- records updated per city
- reports per 1,000 visits
- verified pharmacy count

## Revenue Metrics

- AdSense RPM
- monthly ad revenue
- sponsored listing count
- pharmacy dashboard subscribers

---

# Recommended First Action

Start with a working MVP for **Casablanca only**, then expand.

Minimum first milestone:

1. Create Next.js app.
2. Create database schema.
3. Seed Casablanca.
4. Scrape/import Casablanca duty pharmacies.
5. Build `/pharmacie-de-garde/casablanca` page.
6. Show call/maps buttons.
7. Add last updated/source/disclaimer.
8. Test on mobile.

Once Casablanca works, duplicate the pipeline for Rabat, Marrakech, Tanger, Fès, and Agadir.
