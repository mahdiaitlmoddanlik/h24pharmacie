"use client";

import { useMemo, useState } from "react";
import type {
  City,
  DutyPeriod,
  DutyPharmacy,
  Locale,
  SourceZone,
} from "@/lib/types";
import { getDict } from "@/lib/i18n";
import { haversineDistanceKm } from "@/lib/geo";
import PharmacyCard from "@/components/PharmacyCard";
import ReportIssueModal from "@/components/ReportIssueModal";
import { CrosshairIcon } from "@/components/Icons";

type Filter = "all" | DutyPeriod;

const FILTERS: Filter[] = ["all", "day", "night", "24h"];

function matches(p: DutyPharmacy, f: Filter): boolean {
  if (f === "all") return true;
  if (f === "24h") return p.period === "24h";
  return p.period === f || p.period === "24h";
}

export default function DutyList({
  city,
  duties,
  locale,
  sourceZones,
}: {
  city: City;
  duties: DutyPharmacy[];
  locale: Locale;
  sourceZones?: SourceZone[];
}) {
  const t = getDict(locale);
  const [filter, setFilter] = useState<Filter>("all");
  const [neighborhood, setNeighborhood] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<DutyPharmacy | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [locating, setLocating] = useState(false);

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

  const neighborhoods = useMemo(() => {
    const byName = new Map<string, number>();
    for (const pharmacy of duties) {
      if (!pharmacy.neighborhood) continue;
      byName.set(
        pharmacy.neighborhood,
        (byName.get(pharmacy.neighborhood) ?? 0) + 1,
      );
    }

    if (sourceZones && sourceZones.length > 0) {
      const configuredNames = new Set(sourceZones.map((zone) => zone.name));
      const configured = sourceZones.map((zone) => ({
        name: zone.name,
        count: byName.get(zone.name) ?? 0,
      }));
      const discovered = [...byName.entries()]
        .filter(([name]) => !configuredNames.has(name))
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name, "fr"));
      return [...configured, ...discovered];
    }

    return [...byName.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [duties, sourceZones]);

  const visible = useMemo(() => {
    let list = duties.filter(
      (p) => matches(p, filter) && (!neighborhood || p.neighborhood === neighborhood),
    );
    if (coords) {
      list = list
        .map((p) => ({
          ...p,
          distanceKm: haversineDistanceKm(coords, {
            latitude: p.latitude,
            longitude: p.longitude,
          }),
        }))
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    }
    return list;
  }, [duties, filter, neighborhood, coords]);

  function enableLocation() {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
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
      {neighborhoods.length > 0 && (
        <section aria-label={t.neighborhoods}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold text-foreground">{t.neighborhoods}</h2>
            <span className="text-xs font-medium text-muted">{neighborhoods.length}</span>
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
                {duties.length}
              </span>
            </button>
            {neighborhoods.map((area) => (
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

      {!coords && (
        <button
          type="button"
          onClick={enableLocation}
          disabled={locating}
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary-light px-4 py-2.5 text-sm font-semibold text-primary-dark transition hover:bg-emerald-200 disabled:opacity-60"
        >
          <CrosshairIcon className={`text-lg ${locating ? "animate-spin" : ""}`} />
          {locating ? t.hero.locating : t.hero.useLocation}
        </button>
      )}

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
