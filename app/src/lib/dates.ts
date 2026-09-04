export const MOROCCO_TIME_ZONE = "Africa/Casablanca";

export function moroccoDateISO(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MOROCCO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function dateFromISO(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

export function formatMoroccoDate(locale: "fr" | "ar", date = new Date()): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-MA", {
    timeZone: MOROCCO_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}
