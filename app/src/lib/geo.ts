import type { Locale } from "@/lib/types";
import { pharmacyHref } from "@/lib/i18n";
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

export function formatDistance(km: number, locale: Locale): string {
  if (km < 1) {
    const m = Math.round(km * 1000);
    return locale === "ar" ? `${m} م` : `${m} m`;
  }
  const v = km < 10 ? km.toFixed(1) : Math.round(km).toString();
  return locale === "ar" ? `${v} كم` : `${v} km`;
}
