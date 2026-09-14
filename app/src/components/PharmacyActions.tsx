"use client";

import type { Locale, Pharmacy } from "@/lib/types";
import { getDict } from "@/lib/i18n";
import {
  buildGoogleMapsDirectionsUrl,
  buildTelUrl,
  buildWazeUrl,
  buildWhatsAppShareUrl,
  buildWhatsAppUrl,
} from "@/lib/geo";
import {
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { trackEvent } from "@/lib/analytics";

export function PharmacyActionGrid({
  pharmacy,
  locale,
}: {
  pharmacy: Pharmacy;
  locale: Locale;
}) {
  const t = getDict(locale);

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
      <a
        href={buildTelUrl(pharmacy.phone)}
        onClick={() => {
          trackEvent("Phone Click", {
            city: pharmacy.cityId,
            pharmacySlug: pharmacy.slug,
            location: "detail_grid",
            locale,
          });
        }}
        className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark sm:col-span-1"
      >
        <PhoneIcon /> {t.call}
      </a>
      <a
        href={buildGoogleMapsDirectionsUrl(pharmacy.latitude, pharmacy.longitude)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent("Map Directions Click", {
            provider: "google_maps",
            city: pharmacy.cityId,
            pharmacySlug: pharmacy.slug,
            location: "detail_grid",
            locale,
          });
        }}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
      >
        <MapPinIcon className="text-accent" /> {t.directions}
      </a>
      <a
        href={buildWazeUrl(pharmacy.latitude, pharmacy.longitude)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent("Map Directions Click", {
            provider: "waze",
            city: pharmacy.cityId,
            pharmacySlug: pharmacy.slug,
            location: "detail_grid",
            locale,
          });
        }}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
      >
        <NavigationIcon className="text-sky-500" /> {t.waze}
      </a>
      {pharmacy.whatsapp ? (
        <a
          href={buildWhatsAppUrl(pharmacy.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("WhatsApp Click", {
              city: pharmacy.cityId,
              pharmacySlug: pharmacy.slug,
              location: "detail_grid",
              locale,
            });
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
        >
          <WhatsAppIcon className="text-[#25D366]" /> {t.whatsapp}
        </a>
      ) : (
        <a
          href={buildWhatsAppShareUrl(pharmacy, locale)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("Share Click", {
              provider: "whatsapp",
              city: pharmacy.cityId,
              pharmacySlug: pharmacy.slug,
              location: "detail_grid",
              locale,
            });
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-200"
        >
          <WhatsAppIcon className="text-[#25D366]" /> {t.shareWhatsApp}
        </a>
      )}
    </div>
  );
}

export function PharmacyStickyBar({
  pharmacy,
  locale,
}: {
  pharmacy: Pharmacy;
  locale: Locale;
}) {
  const t = getDict(locale);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-3xl gap-2">
        <a
          href={buildTelUrl(pharmacy.phone)}
          onClick={() => {
            trackEvent("Phone Click", {
              city: pharmacy.cityId,
              pharmacySlug: pharmacy.slug,
              location: "sticky_bar",
              locale,
            });
          }}
          className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm"
        >
          <PhoneIcon /> {t.call}
        </a>
        <a
          href={buildGoogleMapsDirectionsUrl(pharmacy.latitude, pharmacy.longitude)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("Map Directions Click", {
              provider: "google_maps",
              city: pharmacy.cityId,
              pharmacySlug: pharmacy.slug,
              location: "sticky_bar",
              locale,
            });
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground"
        >
          <MapPinIcon className="text-accent" /> {t.directions}
        </a>
        <a
          href={buildWhatsAppShareUrl(pharmacy, locale)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("Share Click", {
              provider: "whatsapp",
              city: pharmacy.cityId,
              pharmacySlug: pharmacy.slug,
              location: "sticky_bar",
              locale,
            });
          }}
          className="flex items-center justify-center rounded-xl bg-surface-muted px-3.5 py-3 text-foreground transition hover:bg-slate-200"
          aria-label={t.shareWhatsApp}
        >
          <WhatsAppIcon className="text-lg text-[#25D366]" />
        </a>
      </div>
    </div>
  );
}
