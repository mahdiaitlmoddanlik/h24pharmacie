"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { City, Locale } from "@/lib/types";
import { cityHref, getDict } from "@/lib/i18n";
import { haversineDistanceKm } from "@/lib/geo";
import { ChevronRightIcon, ClockIcon, CrossIcon, MapPinIcon } from "@/components/Icons";

export interface CityStat {
  city: City;
  count: number;
}

export default function PopularCities({
  initialCityStats,
  locale,
  detectedCitySlug,
}: {
  initialCityStats: CityStat[];
  locale: Locale;
  detectedCitySlug?: string | null;
}) {
  const t = getDict(locale);
  const [cityStats, setCityStats] = useState<CityStat[]>(initialCityStats);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(
    detectedCitySlug ?? null,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check if user already has GPS coordinates in sessionStorage
    try {
      const saved = sessionStorage.getItem("user_coords");
      if (saved) {
        const coords = JSON.parse(saved);
        if (
          typeof coords?.latitude === "number" &&
          typeof coords?.longitude === "number" &&
          !isNaN(coords.latitude) &&
          !isNaN(coords.longitude)
        ) {
          const sorted = [...initialCityStats].sort(
            (a, b) =>
              haversineDistanceKm(coords, a.city) -
              haversineDistanceKm(coords, b.city),
          );
          if (sorted.length > 0) {
            setCityStats(sorted);
            setHighlightedSlug(sorted[0].city.slug);
            return;
          }
        }
      }
    } catch {}

    // 2. If server detected an IP city, ensure it is placed first
    if (detectedCitySlug) {
      setHighlightedSlug(detectedCitySlug);
      const idx = initialCityStats.findIndex(
        (cs) => cs.city.slug === detectedCitySlug,
      );
      if (idx > 0) {
        const reordered = [
          initialCityStats[idx],
          ...initialCityStats.filter((_, i) => i !== idx),
        ];
        setCityStats(reordered);
      }
    }
  }, [initialCityStats, detectedCitySlug]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cityStats.map(({ city, count }) => {
        const isNear = city.slug === highlightedSlug;
        return (
          <Link
            key={city.id}
            href={cityHref(locale, city.slug)}
            className={`group relative flex items-center justify-between gap-3 rounded-card border p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift ${
              isNear
                ? "border-primary bg-emerald-50/40 ring-1 ring-primary/30"
                : "border-border bg-surface"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
                  isNear
                    ? "bg-primary text-white shadow-sm"
                    : "bg-primary-light text-primary-dark"
                }`}
              >
                <CrossIcon />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-extrabold text-foreground">
                    {locale === "ar" ? city.nameAr : city.nameFr}
                  </p>
                  {isNear && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-900 ring-1 ring-emerald-600/20">
                      <MapPinIcon className="text-xs text-emerald-700" />
                      {t.nearYou}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-primary-dark">
                  <ClockIcon className="text-sm shrink-0" />
                  <span className="truncate">
                    {count > 0
                      ? `${count} ${count > 1 ? t.pharmacies : t.pharmacy} ${t.onDutyNow}`
                      : t.dutyUnavailableShort}
                  </span>
                </p>
              </div>
            </div>
            <ChevronRightIcon className="text-xl text-muted shrink-0 transition group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        );
      })}
    </div>
  );
}
