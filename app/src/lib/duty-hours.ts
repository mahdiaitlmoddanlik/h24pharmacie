import type { DutyPeriod, Locale } from "@/lib/types";

export interface DutyHoursInfo {
  scheduleText: string;
  isOpen: boolean;
  statusLabel: string;
  badgeVariant: "open" | "opening_soon" | "continuous" | "closed";
}

/**
 * Returns Morocco's current hour and minute in 24h format.
 */
export function getMoroccoCurrentTime(now: Date = new Date()): { hour: number; minute: number } {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Casablanca",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    }).formatToParts(now);

    const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
    const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
    return { hour, minute };
  } catch {
    // Fallback if Intl timeZone fails
    return { hour: now.getUTCHours() + 1, minute: now.getUTCMinutes() };
  }
}

/**
 * Standard duty schedules in Morocco across all 4 locales.
 */
export const DUTY_SCHEDULE_HOURS: Record<
  DutyPeriod,
  Record<Locale, string>
> = {
  night: {
    fr: "22h00 – 09h00 (sans interruption)",
    ar: "من 22:00 إلى 09:00 (دون انقطاع)",
    en: "10:00 PM – 9:00 AM (non-stop)",
    es: "22:00 – 09:00 (ininterrumpido)",
  },
  day: {
    fr: "09h00 – 22h00",
    ar: "من 09:00 إلى 22:00",
    en: "9:00 AM – 10:00 PM",
    es: "09:00 – 22:00",
  },
  "24h": {
    fr: "24h/24 sans interruption",
    ar: "24/24 دون انقطاع",
    en: "24/7 non-stop",
    es: "24h/24 ininterrumpido",
  },
  unknown: {
    fr: "Horaires variables",
    ar: "أوقات متغيرة",
    en: "Variable hours",
    es: "Horarios variables",
  },
};

/**
 * Calculates whether a pharmacy is currently open based on its duty period and Morocco time.
 */
export function getDutyHoursInfo(
  period: DutyPeriod,
  locale: Locale,
  date: Date = new Date(),
): DutyHoursInfo {
  const scheduleText = DUTY_SCHEDULE_HOURS[period]?.[locale] ?? DUTY_SCHEDULE_HOURS.unknown[locale];

  if (period === "24h") {
    const labels: Record<Locale, string> = {
      fr: "Ouverte actuellement (24h/24)",
      ar: "مفتوحة الآن (24/24)",
      en: "Open now (24/7)",
      es: "Abierta ahora (24h/24)",
    };
    return {
      scheduleText,
      isOpen: true,
      statusLabel: labels[locale],
      badgeVariant: "continuous",
    };
  }

  const { hour, minute } = getMoroccoCurrentTime(date);
  const totalMinutes = hour * 60 + minute;

  // Night duty: 22:00 (1320m) to 09:00 (540m)
  if (period === "night") {
    const isOpen = totalMinutes >= 22 * 60 || totalMinutes < 9 * 60;
    if (isOpen) {
      const labels: Record<Locale, string> = {
        fr: "Ouverte en ce moment · Garde de nuit",
        ar: "مفتوحة حالياً · حراسة ليلية",
        en: "Open now · Night duty",
        es: "Abierta ahora · Guardia nocturna",
      };
      return {
        scheduleText,
        isOpen: true,
        statusLabel: labels[locale],
        badgeVariant: "open",
      };
    } else {
      const labels: Record<Locale, string> = {
        fr: "Ouvre ce soir à 22h00",
        ar: "تفتح هذا المساء عند 22:00",
        en: "Opens tonight at 10:00 PM",
        es: "Abre esta noche a las 22:00",
      };
      return {
        scheduleText,
        isOpen: false,
        statusLabel: labels[locale],
        badgeVariant: "opening_soon",
      };
    }
  }

  // Day duty: 09:00 (540m) to 22:00 (1320m)
  if (period === "day") {
    const isOpen = totalMinutes >= 9 * 60 && totalMinutes < 22 * 60;
    if (isOpen) {
      const labels: Record<Locale, string> = {
        fr: "Ouverte en ce moment · Garde de jour",
        ar: "مفتوحة حالياً · حراسة نهارية",
        en: "Open now · Day duty",
        es: "Abierta ahora · Guardia diurna",
      };
      return {
        scheduleText,
        isOpen: true,
        statusLabel: labels[locale],
        badgeVariant: "open",
      };
    } else {
      const labels: Record<Locale, string> = {
        fr: "Ouvre à 09h00 (Garde de jour)",
        ar: "تفتح عند 09:00 (حراسة نهارية)",
        en: "Opens at 9:00 AM (Day duty)",
        es: "Abre a las 09:00 (Guardia diurna)",
      };
      return {
        scheduleText,
        isOpen: false,
        statusLabel: labels[locale],
        badgeVariant: "closed",
      };
    }
  }

  return {
    scheduleText,
    isOpen: false,
    statusLabel: scheduleText,
    badgeVariant: "closed",
  };
}
