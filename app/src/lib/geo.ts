import type { Locale } from "@/lib/types";
import { cityHref, pharmacyHref, zoneHref } from "@/lib/i18n";
import { PRODUCTION_DOMAIN } from "@/lib/seo";

export interface LatLng {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two points in kilometers. */
export function haversineDistanceKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function buildGoogleMapsDirectionsUrl(
  lat: number,
  lng: number,
): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function buildWazeUrl(lat: number, lng: number): string {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

export function buildTelUrl(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function buildWhatsAppUrl(phone: string, text?: string): string {
  const num = phone.replace(/[^\d]/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${num}${q}`;
}

export function buildWhatsAppShareUrl(
  pharmacy: {
    name: string;
    phone?: string | null;
    address?: string | null;
    slug: string;
    cityId: string;
  },
  locale: Locale,
): string {
  const url = `${PRODUCTION_DOMAIN}${pharmacyHref(locale, pharmacy.cityId, pharmacy.slug)}?utm_source=whatsapp&utm_medium=share`;

  let text = "";
  if (locale === "ar") {
    text = `💊 صيدلية الحراسة: ${pharmacy.name}\n`;
    if (pharmacy.phone) text += `📞 الهاتف: ${pharmacy.phone}\n`;
    if (pharmacy.address) text += `📍 العنوان: ${pharmacy.address}\n`;
    text += `🗺️ الرابط ومسار GPS: ${url}`;
  } else if (locale === "en") {
    text = `💊 Duty Pharmacy: ${pharmacy.name}\n`;
    if (pharmacy.phone) text += `📞 Phone: ${pharmacy.phone}\n`;
    if (pharmacy.address) text += `📍 Address: ${pharmacy.address}\n`;
    text += `🗺️ Map & GPS route: ${url}`;
  } else if (locale === "es") {
    text = `💊 Farmacia de guardia: ${pharmacy.name}\n`;
    if (pharmacy.phone) text += `📞 Teléfono: ${pharmacy.phone}\n`;
    if (pharmacy.address) text += `📍 Dirección: ${pharmacy.address}\n`;
    text += `🗺️ Ruta GPS y detalles: ${url}`;
  } else {
    text = `💊 Pharmacie de garde : ${pharmacy.name}\n`;
    if (pharmacy.phone) text += `📞 Tél : ${pharmacy.phone}\n`;
    if (pharmacy.address) text += `📍 Adresse : ${pharmacy.address}\n`;
    text += `🗺️ Itinéraire GPS & détails : ${url}`;
  }

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function buildCityWhatsAppShareUrl(
  params: {
    cityName: string;
    citySlug: string;
    zoneName?: string;
    zoneSlug?: string;
    pharmacies: Array<{
      name: string;
      phone?: string;
      period?: string;
    }>;
  },
  locale: Locale,
): string {
  const { cityName, citySlug, zoneName, zoneSlug, pharmacies } = params;
  const path = zoneSlug
    ? zoneHref(locale, citySlug, zoneSlug)
    : cityHref(locale, citySlug);
  const targetUrl = `${PRODUCTION_DOMAIN}${path}?utm_source=whatsapp&utm_medium=city_share`;

  const topPharmacies = pharmacies.slice(0, 5);
  let text = "";

  if (locale === "ar") {
    const title = zoneName
      ? `🌙 صيدليات الحراسة في ${cityName} (${zoneName}) اليوم:`
      : `🌙 صيدليات الحراسة في ${cityName} اليوم (ليلاً ونهاراً):`;
    text = `${title}\n\n`;
    topPharmacies.forEach((p, i) => {
      const periodLabel =
        p.period === "24h"
          ? " (24/24)"
          : p.period === "night"
          ? " (ليلاً)"
          : "";
      text += `${i + 1}. ${p.name}${periodLabel}${p.phone ? ` - 📞 ${p.phone}` : ""}\n`;
    });
    if (pharmacies.length > topPharmacies.length) {
      text += `... و ${pharmacies.length - topPharmacies.length} صيدليات أخرى\n`;
    }
    text += `\n📍 القائمة الكاملة، العناوين ومسارات GPS:\n${targetUrl}`;
  } else if (locale === "en") {
    const title = zoneName
      ? `🌙 Duty Pharmacies in ${cityName} (${zoneName}) today:`
      : `🌙 Duty Pharmacies in ${cityName} today (Day & Night 24/7):`;
    text = `${title}\n\n`;
    topPharmacies.forEach((p, i) => {
      const periodLabel =
        p.period === "24h"
          ? " (24/7)"
          : p.period === "night"
          ? " (Night)"
          : "";
      text += `${i + 1}. ${p.name}${periodLabel}${p.phone ? ` - 📞 ${p.phone}` : ""}\n`;
    });
    if (pharmacies.length > topPharmacies.length) {
      text += `... and ${pharmacies.length - topPharmacies.length} more pharmacies\n`;
    }
    text += `\n📍 Full list, phone numbers & GPS navigation:\n${targetUrl}`;
  } else if (locale === "es") {
    const title = zoneName
      ? `🌙 Farmacias de guardia en ${cityName} (${zoneName}) hoy:`
      : `🌙 Farmacias de guardia en ${cityName} hoy (Día y Noche 24h):`;
    text = `${title}\n\n`;
    topPharmacies.forEach((p, i) => {
      const periodLabel =
        p.period === "24h"
          ? " (24h)"
          : p.period === "night"
          ? " (Noche)"
          : "";
      text += `${i + 1}. ${p.name}${periodLabel}${p.phone ? ` - 📞 ${p.phone}` : ""}\n`;
    });
    if (pharmacies.length > topPharmacies.length) {
      text += `... y ${pharmacies.length - topPharmacies.length} farmacias más\n`;
    }
    text += `\n📍 Lista completa, teléfonos y rutas GPS:\n${targetUrl}`;
  } else {
    const title = zoneName
      ? `🌙 Pharmacies de garde à ${cityName} (${zoneName}) aujourd'hui :`
      : `🌙 Pharmacies de garde à ${cityName} aujourd'hui (Nuit & Jour 24h/24) :`;
    text = `${title}\n\n`;
    topPharmacies.forEach((p, i) => {
      const periodLabel =
        p.period === "24h"
          ? " (24h/24)"
          : p.period === "night"
          ? " (Nuit)"
          : "";
      text += `${i + 1}. ${p.name}${periodLabel}${p.phone ? ` - 📞 ${p.phone}` : ""}\n`;
    });
    if (pharmacies.length > topPharmacies.length) {
      text += `... et ${pharmacies.length - topPharmacies.length} autres pharmacies\n`;
    }
    text += `\n📍 Liste complète, téléphones et itinéraires GPS :\n${targetUrl}`;
  }

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function formatDistance(km: number, locale: Locale): string {
  if (km < 1) {
    const m = Math.round(km * 1000);
    return locale === "ar" ? `${m} م` : `${m} m`;
  }
  const v = km < 10 ? km.toFixed(1) : Math.round(km).toString();
  return locale === "ar" ? `${v} كم` : `${v} km`;
}
