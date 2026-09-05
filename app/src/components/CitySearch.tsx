"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { City, Locale } from "@/lib/types";
import { cityHref, getDict } from "@/lib/i18n";
import { haversineDistanceKm } from "@/lib/geo";
import { CrosshairIcon, SearchIcon, ChevronRightIcon } from "@/components/Icons";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function CitySearch({
  cities,
  locale,
}: {
  cities: City[];
  locale: Locale;
}) {
  const t = getDict(locale);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return cities;
    return cities.filter(
      (c) =>
        normalize(c.nameFr).includes(q) ||
        c.nameAr.includes(query.trim()) ||
        normalize(c.slug).includes(q),
    );
  }, [query, cities]);

  function go(city: City) {
    router.push(cityHref(locale, city.slug));
  }

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setError(t.distanceUnknown);
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        const nearest = [...cities].sort(
          (a, b) => haversineDistanceKm(here, a) - haversineDistanceKm(here, b),
        )[0];
        setLocating(false);
        if (nearest) router.push(cityHref(locale, nearest.slug));
      },
      () => {
        setLocating(false);
        setError(t.distanceUnknown);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="w-full">
      <div className="relative z-30">
        <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lift">
          <div className="pointer-events-none flex items-center pl-2 text-muted">
            <SearchIcon className="text-xl" />
          </div>
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) go(results[0]);
            }}
            placeholder={t.hero.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-foreground outline-none placeholder:text-muted"
            aria-label={t.hero.searchPlaceholder}
          />
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="hidden shrink-0 items-center gap-2 rounded-xl bg-primary-light px-3.5 py-2.5 text-sm font-semibold text-primary-dark transition hover:bg-emerald-200 disabled:opacity-60 sm:inline-flex"
          >
            <CrosshairIcon className={`text-lg ${locating ? "animate-spin" : ""}`} />
            {locating ? t.hero.locating : t.hero.useLocation}
          </button>
        </div>

        {open && results.length > 0 && (
          <ul className="absolute left-0 right-0 z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-border bg-white py-2 shadow-2xl ring-1 ring-black/5">
            {results.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(c)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-start transition hover:bg-surface-muted"
                >
                  <span>
                    <span className="block font-semibold text-foreground">
                      {locale === "ar" ? c.nameAr : c.nameFr}
                    </span>
                    <span className="block text-xs text-muted">
                      {locale === "ar" ? c.regionAr : c.region}
                    </span>
                  </span>
                  <ChevronRightIcon className="text-lg text-muted rtl:rotate-180" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25 disabled:opacity-60 sm:hidden"
      >
        <CrosshairIcon className={`text-lg ${locating ? "animate-spin" : ""}`} />
        {locating ? t.hero.locating : t.hero.useLocation}
      </button>

      {error && <p className="mt-2 text-sm text-emerald-100">{error}</p>}
    </div>
  );
}
