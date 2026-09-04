import * as cheerio from "cheerio";
import { cities } from "../lib/data/cities";
import {
  extractSaydaliaApiKey,
  getSaydaliaBrandFilters,
  parseSaydaliaItems,
  SAYDALIA_API_URL,
  SAYDALIA_PAGE_URL,
  SAYDALIA_USER_AGENT,
} from "./parse-saydalia";

async function main() {
  const response = await fetch(SAYDALIA_PAGE_URL, {
    headers: { "user-agent": SAYDALIA_USER_AGENT },
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  const apiKey = extractSaydaliaApiKey(html);

  console.log(`Saydalia page: ${response.status} ${SAYDALIA_PAGE_URL}`);
  console.log(`Title: ${$("title").text().trim()}`);
  console.log(`API endpoint: ${SAYDALIA_API_URL}`);
  console.log(`API key found: ${apiKey ? "yes" : "no"}`);
  console.log(
    `Script count: ${$("script[src]").length} external, ${$("script:not([src])").length} inline`,
  );

  for (const city of cities) {
    const filters = getSaydaliaBrandFilters(city.slug)
      .map((filter) => `${filter.period}:${filter.brand}`)
      .join(", ");
    console.log(`${city.slug}: ${filters}`);
  }

  if (!apiKey) return;

  const sampleCity = cities.find((city) => city.slug === "casablanca") ?? cities[0];
  const sampleFilter = getSaydaliaBrandFilters(sampleCity.slug)[0];
  const url = new URL(SAYDALIA_API_URL);
  url.searchParams.set("origin", `${sampleCity.latitude},${sampleCity.longitude}`);
  url.searchParams.set("limit", "35");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("brand", sampleFilter.brand);

  const sampleResponse = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": SAYDALIA_USER_AGENT,
    },
  });
  const sampleJson = (await sampleResponse.json()) as unknown;
  const sampleItems = Array.isArray(sampleJson) ? sampleJson : [];
  const parsed = parseSaydaliaItems(sampleItems.slice(0, 3), {
    cityName: sampleCity.nameFr,
    period: sampleFilter.period,
  });

  console.log(
    `Sample ${sampleCity.slug}/${sampleFilter.period}: ${sampleResponse.status}, ${sampleItems.length} rows`,
  );
  console.log(JSON.stringify(parsed, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
