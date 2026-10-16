"use client";

import { useEffect, useRef, useState } from "react";
import type { City, DutyPeriod, DutyPharmacy, Locale, Pharmacy } from "@/lib/types";
import { getDict, pharmacyHref } from "@/lib/i18n";
import { getDutyHoursInfo } from "@/lib/duty-hours";
import {
  buildGoogleMapsDirectionsUrl,
  buildTelUrl,
  buildWazeUrl,
  formatDistance,
  haversineDistanceKm,
} from "@/lib/geo";
import {
  ChevronRightIcon,
  ClockIcon,
  CrosshairIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "@/components/Icons";
import "leaflet/dist/leaflet.css";

type MapFilterMode = "duty" | "all";
type PeriodFilter = "all" | DutyPeriod;

interface CityDutyMapProps {
  city: City;
  duties: DutyPharmacy[];
  allPharmacies?: Pharmacy[];
  locale: Locale;
  userCoords?: { latitude: number; longitude: number } | null;
  onLocate?: () => void;
  selectedNeighborhood?: string | null;
}

export default function CityDutyMap({
  city,
  duties,
  allPharmacies = [],
  locale,
  userCoords,
  onLocate,
  selectedNeighborhood,
}: CityDutyMapProps) {
  const t = getDict(locale);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [mode, setMode] = useState<MapFilterMode>("duty");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [selectedPharmacy, setSelectedPharmacy] = useState<{
    pharmacy: Pharmacy | DutyPharmacy;
    duty?: DutyPharmacy;
    distanceKm?: number;
  } | null>(null);
  const [mapType, setMapType] = useState<"satellite" | "streets">("satellite");
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // Map of duties by pharmacy ID for O(1) lookup
  const dutiesById = useRef(new Map<string, DutyPharmacy>());
  useEffect(() => {
    const map = new Map<string, DutyPharmacy>();
    duties.forEach((d) => map.set(d.id, d));
    dutiesById.current = map;
  }, [duties]);

  // Duty pharmacies list filtered by period and neighborhood
  const filteredDuties = duties.filter((p) => {
    if (periodFilter !== "all") {
      if (periodFilter === "24h" && p.period !== "24h") return false;
      if (periodFilter === "day" && p.period !== "day" && p.period !== "24h") return false;
      if (periodFilter === "night" && p.period !== "night" && p.period !== "24h") return false;
    }
    if (selectedNeighborhood && p.neighborhood && !p.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Combined list for "all" mode
  const displayedPharmacies = mode === "duty" ? filteredDuties : allPharmacies.length > 0 ? allPharmacies : duties;

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // City center with slight bounding box constraint (±0.25 degrees)
      const centerLat = city.latitude || 31.6295;
      const centerLng = city.longitude || -7.9811;
      const boundsPadding = 0.28;
      const southWest = L.latLng(centerLat - boundsPadding, centerLng - boundsPadding);
      const northEast = L.latLng(centerLat + boundsPadding, centerLng + boundsPadding);
      const bounds = L.latLngBounds(southWest, northEast);

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 13,
        minZoom: 11,
        maxZoom: 19,
        maxBounds: bounds,
        maxBoundsViscosity: 0.8,
        zoomControl: false,
      });

      // Satellite Hybrid tile layer by default (with road and neighborhood labels)
      const satelliteLayer = L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          subdomains: ["0", "1", "2", "3"],
          maxZoom: 20,
          attribution: "&copy; Google Maps / Maxar",
        },
      );

      const streetLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
        },
      );

      satelliteLayer.addTo(map);

      // Store layers on map for toggle
      (map as any)._satelliteLayer = satelliteLayer;
      (map as any)._streetLayer = streetLayer;

      // Layer group for pharmacy markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
      setIsLeafletReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [city.latitude, city.longitude]);

  // Handle Satellite vs Street tile switch
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (mapType === "satellite") {
      if (map._streetLayer && map.hasLayer(map._streetLayer)) map.removeLayer(map._streetLayer);
      if (map._satelliteLayer && !map.hasLayer(map._satelliteLayer)) map.addLayer(map._satelliteLayer);
    } else {
      if (map._satelliteLayer && map.hasLayer(map._satelliteLayer)) map.removeLayer(map._satelliteLayer);
      if (map._streetLayer && !map.hasLayer(map._streetLayer)) map.addLayer(map._streetLayer);
    }
  }, [mapType]);

  // Render Pharmacy Markers
  useEffect(() => {
    if (!isLeafletReady || !mapInstanceRef.current || !markersLayerRef.current) return;

    let isMounted = true;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      if (!isMounted || !markersLayerRef.current) return;

      markersLayerRef.current.clearLayers();

      const validPharmacies = displayedPharmacies.filter(
        (p) => typeof p.latitude === "number" && typeof p.longitude === "number" && !isNaN(p.latitude) && !isNaN(p.longitude) && (p.latitude !== 0 || p.longitude !== 0)
      );

      validPharmacies.forEach((pharmacy) => {
        const duty = dutiesById.current.get(pharmacy.id);
        const isOnDuty = Boolean(duty);

        // Custom HTML pin (DEGARDE style)
        // Green badge with '24' for duty, sleek white with green outline for off-duty
        const iconHtml = isOnDuty
          ? `<div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-xs shadow-lg border-2 border-white ring-2 ring-emerald-500/50 transform hover:scale-115 transition-transform cursor-pointer">
              <span>24</span>
              <span class="absolute -top-1 -right-1 flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>`
          : `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/95 text-emerald-700 font-bold text-xs shadow-md border-2 border-emerald-600/60 transform hover:scale-110 transition-transform cursor-pointer opacity-85 hover:opacity-100">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
              </svg>
            </div>`;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-map-pin",
          iconSize: isOnDuty ? [40, 40] : [32, 32],
          iconAnchor: isOnDuty ? [20, 20] : [16, 16],
        });

        const marker = L.marker([pharmacy.latitude, pharmacy.longitude], {
          icon: customIcon,
          zIndexOffset: isOnDuty ? 100 : 10,
        });

        marker.on("click", () => {
          const distanceKm = userCoords
            ? haversineDistanceKm(userCoords, {
                latitude: pharmacy.latitude,
                longitude: pharmacy.longitude,
              })
            : undefined;

          setSelectedPharmacy({
            pharmacy,
            duty,
            distanceKm,
          });

          // Smooth pan to tapped marker
          mapInstanceRef.current?.panTo([pharmacy.latitude, pharmacy.longitude], {
            animate: true,
            duration: 0.5,
          });
        });

        markersLayerRef.current.addLayer(marker);
      });
    }

    updateMarkers();

    return () => {
      isMounted = false;
    };
  }, [isLeafletReady, displayedPharmacies, mode, periodFilter, userCoords]);

  // User Location Marker
  useEffect(() => {
    if (!isLeafletReady || !mapInstanceRef.current) return;

    let isMounted = true;

    async function updateUserMarker() {
      const L = (await import("leaflet")).default;
      if (!isMounted || !mapInstanceRef.current) return;

      if (userMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }

      if (!userCoords) return;

      const userIconHtml = `
        <div class="relative flex items-center justify-center w-6 h-6">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-md"></span>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userIconHtml,
        className: "user-location-pin",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const userMarker = L.marker([userCoords.latitude, userCoords.longitude], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapInstanceRef.current);

      userMarkerRef.current = userMarker;
    }

    updateUserMarker();

    return () => {
      isMounted = false;
    };
  }, [isLeafletReady, userCoords]);

  function handleFlyToUser() {
    if (userCoords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userCoords.latitude, userCoords.longitude], 15, {
        animate: true,
        duration: 1,
      });
    } else if (onLocate) {
      onLocate();
    }
  }

  // Precompute selected pharmacy info
  const selectedDuty = selectedPharmacy?.duty;
  const selectedHours = selectedDuty ? getDutyHoursInfo(selectedDuty.period, locale) : null;
  const selectedAddress =
    locale === "ar" && selectedPharmacy?.pharmacy.addressAr
      ? selectedPharmacy.pharmacy.addressAr
      : selectedPharmacy?.pharmacy.address;

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 text-white select-none">
      {/* 1. Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 2. Top Header Bar (Location + Controls) */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between gap-2">
          {/* City & Mode Badge */}
          <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-lg text-xs font-semibold text-slate-200">
            <MapPinIcon className="text-emerald-400 text-sm" />
            <span className="uppercase tracking-wider">
              {locale === "ar" ? city.nameAr : city.nameFr}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-bold">
              {filteredDuties.length} {locale === "ar" ? "صيدلية حراسة" : "de garde"}
            </span>
          </div>

          {/* Satellite / Street Switcher */}
          <div className="pointer-events-auto flex items-center rounded-full bg-slate-950/85 backdrop-blur-md p-0.5 border border-slate-700/60 shadow-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMapType("satellite")}
              className={`px-2.5 py-1 rounded-full transition ${
                mapType === "satellite"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapType("streets")}
              className={`px-2.5 py-1 rounded-full transition ${
                mapType === "streets"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Plan
            </button>
          </div>
        </div>

        {/* Filter Toggle: [ En Garde ] vs [ Tout ] (DEGARDE style) */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-950/90 backdrop-blur-md p-1 border border-slate-700/60 shadow-lg text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode("duty")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                mode === "duty"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {locale === "ar" ? "صيدليات الحراسة" : "En Garde"}
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                {filteredDuties.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("all")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                mode === "all"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>✓</span>
              {locale === "ar" ? "جميع الصيدليات" : "Toutes"}
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                {allPharmacies.length > 0 ? allPharmacies.length : duties.length}
              </span>
            </button>
          </div>

          {/* Period Filter (when in duty mode) */}
          {mode === "duty" && (
            <div className="inline-flex rounded-xl bg-slate-950/90 backdrop-blur-md p-1 border border-slate-700/60 shadow-lg text-xs font-semibold">
              {(["all", "night", "day", "24h"] as PeriodFilter[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setPeriodFilter(period)}
                  className={`px-2 py-1 rounded-lg transition ${
                    periodFilter === period
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {period === "all" ? (locale === "ar" ? "الكل" : "Tous") : t.periods[period]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Floating GPS Center Button */}
      <button
        type="button"
        onClick={handleFlyToUser}
        aria-label="Centrer sur ma position"
        className="absolute top-28 right-3 z-[400] h-10 w-10 flex items-center justify-center rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-slate-200 shadow-xl hover:text-emerald-400 hover:scale-105 active:scale-95 transition"
      >
        <CrosshairIcon className="text-xl" />
      </button>

      {/* 4. Bottom Detail Sheet / Card (Appears on Pin Click, DEGARDE Screenshot 3) */}
      {selectedPharmacy && (
        <div className="absolute bottom-3 left-3 right-3 z-[500] bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-slate-100 transition-all animate-in slide-in-from-bottom-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {selectedDuty ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {selectedHours?.statusLabel ?? t.periods[selectedDuty.period]}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                    {t.notOnDuty}
                  </span>
                )}

                {selectedPharmacy.distanceKm !== undefined && (
                  <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                    {formatDistance(selectedPharmacy.distanceKm, locale)}
                  </span>
                )}
              </div>

              <h4 className="mt-1.5 text-base font-extrabold text-white truncate">
                {selectedPharmacy.pharmacy.name}
              </h4>

              <p className="mt-0.5 text-xs text-slate-300 flex items-start gap-1 line-clamp-2">
                <MapPinIcon className="text-emerald-400 text-sm shrink-0 mt-0.5" />
                <span>{selectedAddress}</span>
              </p>

              {selectedHours && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                  <ClockIcon className="text-xs text-emerald-400" />
                  <span>{selectedHours.scheduleText}</span>
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPharmacy(null)}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Quick Action Buttons (Call, Maps, Waze) */}
          <div className="mt-3.5 grid grid-cols-3 gap-2">
            <a
              href={buildTelUrl(selectedPharmacy.pharmacy.phone)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              <PhoneIcon className="text-sm" />
              <span>{t.call}</span>
            </a>

            <a
              href={buildGoogleMapsDirectionsUrl(
                selectedPharmacy.pharmacy.latitude,
                selectedPharmacy.pharmacy.longitude,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
            >
              <NavigationIcon className="text-sm" />
              <span>Maps</span>
            </a>

            <a
              href={buildWazeUrl(
                selectedPharmacy.pharmacy.latitude,
                selectedPharmacy.pharmacy.longitude,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition"
            >
              <span>🚗 Waze</span>
            </a>
          </div>

          {/* Full Page Link */}
          <div className="mt-2 text-center">
            <a
              href={pharmacyHref(locale, selectedPharmacy.pharmacy.cityId, selectedPharmacy.pharmacy.slug)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-emerald-400 transition"
            >
              <span>{locale === "ar" ? "عرض تفاصيل الصيدلية" : "Voir la fiche complète"}</span>
              <ChevronRightIcon className="text-xs rtl:rotate-180" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
