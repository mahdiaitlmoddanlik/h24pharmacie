"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type {
  City,
  DutyPeriod,
  DutyPharmacy,
  Locale,
  Pharmacy,
  SourceZone,
} from "@/lib/types";
import { getDict } from "@/lib/i18n";
import { haversineDistanceKm } from "@/lib/geo";
import PharmacyCard from "@/components/PharmacyCard";
import ReportIssueModal from "@/components/ReportIssueModal";
import CityWhatsAppShare from "@/components/CityWhatsAppShare";
import { CrosshairIcon } from "@/components/Icons";
import { trackEvent } from "@/lib/analytics";

const CityDutyMap = dynamic(() => import("@/components/CityDutyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[620px] w-full items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <span className="text-sm font-semibold">Chargement de la carte satellite...</span>
      </div>
    </div>
  ),
});

type Filter = "all" | DutyPeriod;

const FILTERS: Filter[] = ["all", "day", "night", "24h"];

function matches(p: DutyPharmacy, f: Filter): boolean {
  if (f === "all") return true;
  if (f === "24h") return p.period === "24h";
  return p.period === f || p.period === "24h";
}

function matchesNeighborhood(
  pharmacyNb: string | undefined,
  selectedNb: string,
): boolean {
  if (!pharmacyNb) return false;
  if (pharmacyNb === selectedNb) return true;
  const a = pharmacyNb
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const b = selectedNb
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return a === b || a.includes(b) || b.includes(a);
}

export default function DutyList({
  city,
  duties,
  allPharmacies = [],
  locale,
  sourceZones,
  initialNeighborhood,
}: {
  city: City;
  duties: DutyPharmacy[];
  allPharmacies?: Pharmacy[];
  locale: Locale;
  sourceZones?: SourceZone[];
  initialNeighborhood?: string;
}) {
  const t = getDict(locale);
  const [viewMode, setViewMode] = useState<"list" | "map">("map");
  const [filter, setFilter] = useState<Filter>("all");
  const [neighborhood, setNeighborhood] = useState<string | null>(
    initialNeighborhood ?? null,
  );
  const [reportTarget, setReportTarget] = useState<DutyPharmacy | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    if (viewParam === "list" || viewParam === "map") {
      setViewMode(viewParam);
    }

    const latStr = params.get("lat");
    const lngStr = params.get("lng");
    if (latStr && lngStr) {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
        const urlCoords = { latitude: lat, longitude: lng };
        setCoords(urlCoords);
        try {
          sessionStorage.setItem("user_coords", JSON.stringify(urlCoords));
        } catch {}
        return;
      }
    }

    try {
      const saved = sessionStorage.getItem("user_coords");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed?.latitude === "number" &&
          typeof parsed?.longitude === "number" &&
          !isNaN(parsed.latitude) &&
          !isNaN(parsed.longitude)
        ) {
          setCoords({ latitude: parsed.latitude, longitude: parsed.longitude });
        }
      }
    } catch {}
  }, []);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: duties.length,
      day: 0,
      night: 0,
      "24h": 0,
      unknown: 0,
    };
    for (const p of duties) {
      if (matches(p, "day")) c.day++;
      if (matches(p, "night")) c.night++;
      if (p.period === "24h") c["24h"]++;
    }
    return c;
  }, [duties]);

  useEffect(() => {
    if (neighborhood) {
      const stillHasPharmacies = duties.some(
        (p) =>
          matches(p, filter) &&
          matchesNeighborhood(p.neighborhood, neighborhood),
      );
      if (!stillHasPharmacies && !initialNeighborhood) {
        setNeighborhood(null);
      }
    }
  }, [filter, neighborhood, duties, initialNeighborhood]);

  const activeNeighborhoods = useMemo(() => {
    const periodDuties = duties.filter((p) => matches(p, filter));
    const byName = new Map<string, number>();
    for (const pharmacy of periodDuties) {
      if (!pharmacy.neighborhood) continue;
      byName.set(
        pharmacy.neighborhood,
        (byName.get(pharmacy.neighborhood) ?? 0) + 1,
      );
    }

    if (sourceZones && sourceZones.length > 0) {
      const configuredNames = new Set(sourceZones.map((zone) => zone.name));
      const configured = sourceZones
        .map((zone) => ({
          name: zone.name,
          count: byName.get(zone.name) ?? 0,
        }))
        .filter((item) => item.count > 0);

      const discovered = [...byName.entries()]
        .filter(([name]) => !configuredNames.has(name))
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name, "fr"));

      return [...configured, ...discovered];
    }

    return [...byName.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [duties, filter, sourceZones]);

  const visible = useMemo(() => {
    let list = duties.filter(
      (p) =>
        matches(p, filter) &&
        (!neighborhood || matchesNeighborhood(p.neighborhood, neighborhood)),
    );

    if (coords) {
      list = list
        .map((p) => {
          const hasCoords =
            typeof p.latitude === "number" &&
            typeof p.longitude === "number" &&
            !isNaN(p.latitude) &&
            !isNaN(p.longitude) &&
            (p.latitude !== 0 || p.longitude !== 0);

          const distanceKm = hasCoords
            ? haversineDistanceKm(coords, {
                latitude: p.latitude,
                longitude: p.longitude,
              })
            : undefined;

          return {
            ...p,
            distanceKm,
          };
        })
        .sort((a, b) => {
          const hasA = typeof a.distanceKm === "number" && !isNaN(a.distanceKm);
          const hasB = typeof b.distanceKm === "number" && !isNaN(b.distanceKm);
          if (hasA && hasB) {
            return (a.distanceKm as number) - (b.distanceKm as number);
          }
          if (hasA && !hasB) return -1;
          if (!hasA && hasB) return 1;
          return a.name.localeCompare(b.name, "fr");
        });
    }

    return list;
  }, [duties, filter, neighborhood, coords]);

  function enableLocation() {
    trackEvent("Geolocation Used", {
      context: "duty_list",
      city: city.slug,
      locale,
    });
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userCoords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setCoords(userCoords);
        try {
          sessionStorage.setItem("user_coords", JSON.stringify(userCoords));
        } catch {}
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  function clearLocation() {
    setCoords(null);
    try {
      sessionStorage.removeItem("user_coords");
    } catch {}
    if (typeof window !== "undefined" && window.location.search) {
      const url = new URL(window.location.href);
      url.searchParams.delete("lat");
      url.searchParams.delete("lng");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  }

  if (duties.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border bg-surface p-8 text-center">
        <p className="text-base font-bold text-foreground">{t.dutyUnavailableTitle}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{t.dutyUnavailable}</p>
      </div>
    );
  }

  return (
    <div>
      {/* View Switcher: [ 🗺️ Carte Satellite ] vs [ 📋 Liste ] */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-2xl bg-surface p-1 border border-border shadow-soft">
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition ${
              viewMode === "map"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-foreground hover:bg-surface-muted"
            }`}
          >
            <span>🗺️</span>
            <span>{locale === "ar" ? "خريطة الأقمار الصناعية" : "Carte Satellite"}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-black uppercase ring-1 ${
                viewMode === "map"
                  ? "bg-white/20 text-white ring-white/30"
                  : "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30"
              }`}
            >
              {locale === "ar" ? "جديد" : "Nouveau"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition ${
              viewMode === "list"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-foreground hover:bg-surface-muted"
            }`}
          >
            <span>📋</span>
            <span>{locale === "ar" ? "قائمة" : "Liste"}</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full ${
                viewMode === "list" ? "bg-white/20 text-white" : "bg-surface-muted text-muted"
              }`}
            >
              {visible.length}
            </span>
          </button>
        </div>

        {/* Desktop GPS locate button */}
        <button
          type="button"
          onClick={coords ? clearLocation : enableLocation}
          className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold shadow-soft transition ${
            coords
              ? "border-emerald-500/30 bg-emerald-50 text-emerald-800"
              : "border-border bg-surface text-foreground hover:bg-surface-muted"
          }`}
        >
          <CrosshairIcon className={`text-sm ${locating ? "animate-spin text-primary" : ""}`} />
          <span>{coords ? t.clearLocation : locating ? t.hero.locating : t.hero.useLocation}</span>
        </button>
      </div>

      {viewMode === "map" ? (
        <div className="space-y-6">
          <CityDutyMap
            city={city}
            duties={duties}
            allPharmacies={allPharmacies}
            locale={locale}
            userCoords={coords}
            onLocate={enableLocation}
            selectedNeighborhood={neighborhood}
          />

          <CityWhatsAppShare
            cityName={locale === "ar" ? city.nameAr : city.nameFr}
            citySlug={city.slug}
            zoneName={neighborhood || undefined}
            locale={locale}
            duties={visible.length > 0 ? visible : duties}
          />
        </div>
      ) : (
        <>
          {/* 1. Period Filters Bar (City-wide scope) */}
          <div className="flex items-center justify-between gap-3">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface text-foreground ring-1 ring-border hover:bg-surface-muted"
              }`}
            >
              {f === "all" ? t.periodAll : t.periods[f]}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  filter === f ? "bg-white/25" : "bg-surface-muted text-muted"
                }`}
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Neighborhoods Section (Contextualized to selected period, count > 0) */}
      {activeNeighborhoods.length > 0 && (
        <section aria-label={t.neighborhoods} className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold text-foreground">{t.neighborhoods}</h2>
            <span className="text-xs font-medium text-muted">
              {activeNeighborhoods.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              aria-pressed={!neighborhood}
              onClick={() => setNeighborhood(null)}
              className={`col-span-2 flex min-w-0 items-center justify-between gap-2 rounded-card border px-3 py-2.5 text-start text-sm font-semibold transition sm:col-span-3 ${
                !neighborhood
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-surface text-foreground hover:border-primary hover:bg-surface-muted"
              }`}
            >
              <span className="min-w-0 truncate">{t.neighborhoodsAll}</span>
              <span
                className={`shrink-0 rounded-full px-1.5 text-xs ${
                  !neighborhood ? "bg-white/25" : "bg-surface-muted text-muted"
                }`}
              >
                {counts[filter]}
              </span>
            </button>
            {activeNeighborhoods.map((area) => (
              <button
                key={area.name}
                type="button"
                aria-pressed={neighborhood === area.name}
                onClick={() => setNeighborhood(area.name)}
                className={`flex min-w-0 items-center justify-between gap-2 rounded-card border px-3 py-2.5 text-start text-sm font-semibold transition ${
                  neighborhood === area.name
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-surface text-foreground hover:border-primary hover:bg-surface-muted"
                }`}
              >
                <span className="min-w-0 truncate">{area.name}</span>
                <span
                  className={`shrink-0 rounded-full px-1.5 text-xs ${
                    neighborhood === area.name
                      ? "bg-white/25"
                      : "bg-surface-muted text-muted"
                  }`}
                >
                  {area.count}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 3. Geolocation Action & Status Banner */}
      <div className="mt-4">
        {!coords ? (
          <button
            type="button"
            onClick={enableLocation}
            disabled={locating}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-light px-4 py-2.5 text-sm font-semibold text-primary-dark transition hover:bg-emerald-200 disabled:opacity-60"
          >
            <CrosshairIcon className={`text-lg ${locating ? "animate-spin" : ""}`} />
            {locating ? t.hero.locating : t.hero.useLocation}
          </button>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900">
            <div className="flex items-center gap-2">
              <CrosshairIcon className="shrink-0 text-base text-emerald-600" />
              <span>{t.sortedByDistance}</span>
            </div>
            <button
              type="button"
              onClick={clearLocation}
              className="shrink-0 text-emerald-700 underline hover:text-emerald-900"
            >
              {t.clearLocation}
            </button>
          </div>
        )}
      </div>

      {/* City & Zone WhatsApp Share Card */}
      <CityWhatsAppShare
        cityName={locale === "ar" ? city.nameAr : city.nameFr}
        citySlug={city.slug}
        zoneName={neighborhood || undefined}
        locale={locale}
        duties={visible.length > 0 ? visible : duties}
      />

      {/* 4. Pharmacy Cards List */}
      <div className="mt-4 space-y-3">
        {visible.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-surface p-8 text-center">
            <p className="text-base font-bold text-foreground">{t.noResults}</p>
            <p className="mt-1 text-sm text-muted">{t.noResultsSub}</p>
          </div>
        ) : (
          visible.map((p) => (
            <PharmacyCard
              key={`${p.id}-${p.dutyDate}-${p.period}`}
              pharmacy={p}
              locale={locale}
              distanceKm={p.distanceKm}
              onReport={setReportTarget}
            />
          ))
        )}
      </div>
      </>
      )}

      {reportTarget && (
        <ReportIssueModal
          pharmacy={reportTarget}
          cityId={city.id}
          locale={locale}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
}
