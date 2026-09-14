"use client";

import { track } from "@vercel/analytics";

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
  }
}

export type AnalyticsEventName =
  | "Phone Click"
  | "WhatsApp Click"
  | "Map Directions Click"
  | "City Search"
  | "Geolocation Used"
  | "Report Issue Submitted"
  | "Language Switched";

export interface AnalyticsEventProps {
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * Universal tracking function that sends events to Vercel Analytics
 * and mirrors them to Google Analytics 4 (GA4) if configured.
 *
 * Designed to strictly protect user privacy: never pass personal names,
 * user phone numbers, or health information.
 */
export function trackEvent(name: AnalyticsEventName, properties?: AnalyticsEventProps) {
  if (typeof window === "undefined") return;

  // 1. Vercel Analytics
  try {
    track(name, properties);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[analytics:vercel] Failed to track event", name, error);
    }
  }

  // 2. Google Analytics 4 (if loaded on window)
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, properties);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[analytics:ga4] Failed to track event", name, error);
    }
  }
}
