# Legal / Ethical Notes

- Pharmacy name, address, phone, GPS, city and duty date are generally factual data,
  but wholesale database copying can still create disputes. Add unique value (better
  UX, bilingual SEO, location search, reporting, verification).
- Use Telecontact.ma as the principal public seed source, with Saydalia.ma kept as a fallback/investigation source.
- Always show **attribution** and a **last-checked timestamp** (implemented on city
  and pharmacy pages).
- Provide a contact / removal / update flow. If a data source requests removal or no
  scraping, **comply immediately**.
- Show a call-first disclaimer everywhere.

## Disclaimer (shown in the app)

**FR:** Les informations sont fournies à titre indicatif et peuvent changer.
Veuillez appeler la pharmacie avant de vous déplacer.

**AR:** المعلومات مقدمة للمساعدة وقد تتغير. يرجى الاتصال بالصيدلية قبل التوجه إليها.

## Data quality safeguards

- Last-updated time on every city/pharmacy page.
- Source label linking back to the origin.
- User reports (`/api/reports`) + admin review queue (planned).
- Confidence score per duty schedule (in the data model).
