# Data Sources

## Primary seed source

- **Telecontact.ma** — https://www.telecontact.ma/services/pharmacies-de-garde/Maroc
  Principal public source for cached duty schedules. City pages expose zone
  links; the site loads pharmacies from its public zone/day JSON endpoint.
- **Saydalia.ma** — https://saydalia.ma/fr/pharmacies-de-garde/
  Kept as a fallback/investigation source, not the principal dependency.

## Scraping rules (must follow)

- Scrape only the required pages; never on every user request.
- Cache results in the database; serve users from cache.
- Polite user-agent, timeouts, retries with backoff, delays between requests.
- Run only a few times per day (08:00 / 14:00 / 20:00 / 23:30).
- Store raw HTML snapshots for debugging and parser tests.
- Do not hotlink images or copy design/branding.
- Stop immediately if a source requests removal / no scraping.

## Normalized scraper output

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
      "sourceUrl": "https://www.telecontact.ma/pharmacie-de-garde-zone/casablanca/ville-bourgogne-maarif.html"
    }
  ]
}
```

## Fallback sources to add later

- Official pharmacy syndicate / city publications
- Local Facebook pages
- Pharmacy owner submissions
- User reports (already wired via `/api/reports`)
- Manual admin CSV upload

## Investigation checklist (Telecontact)

- [x] City page lists zone links in static HTML.
- [x] Zone/day data is loaded via `/trouver/pharmacie-guarde-zone-jour-fonctionalite.php`.
- [x] `jour=1` maps to day, `jour=2` maps to night, `jour=3` maps to 24h.
- [ ] Save periodic raw snapshots for parser regression fixtures.
