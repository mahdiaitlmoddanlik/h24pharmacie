export type Locale = "fr" | "ar";

export type DutyPeriod = "day" | "night" | "24h" | "unknown";

export type VerificationStatus =
  | "unverified"
  | "source_verified"
  | "user_confirmed"
  | "pharmacy_claimed";

export type ReportIssueType =
  | "closed"
  | "wrong_phone"
  | "wrong_address"
  | "not_on_duty"
  | "other";

export interface Source {
  id: string;
  name: string;
  baseUrl: string;
  type: "website" | "manual" | "official" | "user" | "pharmacy";
  lastCheckedAt: string;
}

export interface City {
  id: string;
  nameFr: string;
  nameAr: string;
  slug: string;
  region: string;
  regionAr: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export interface SourceZone {
  slug: string;
  name: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  address: string;
  addressAr?: string;
  phone: string;
  whatsapp?: string;
  latitude: number;
  longitude: number;
  verificationStatus: VerificationStatus;
  /** Optional neighborhood for richer city content */
  neighborhood?: string;
}

export interface DutySchedule {
  id: string;
  pharmacyId: string;
  cityId: string;
  dutyDate: string; // ISO date (YYYY-MM-DD)
  period: DutyPeriod;
  sourceId: string;
  sourceUrl: string;
  scrapedAt: string; // ISO datetime
  confidenceScore: number; // 0..1
}

/** A pharmacy joined with its current duty info + computed fields */
export interface DutyPharmacy extends Pharmacy {
  period: DutyPeriod;
  dutyDate: string;
  scrapedAt: string;
  confidenceScore: number;
  sourceUrl: string;
  distanceKm?: number;
}
