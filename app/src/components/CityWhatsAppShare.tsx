"use client";

import { useState } from "react";
import type { DutyPharmacy, Locale } from "@/lib/types";
import { getDict, cityHref, zoneHref } from "@/lib/i18n";
import { PRODUCTION_DOMAIN } from "@/lib/seo";
import { buildCityWhatsAppShareUrl } from "@/lib/geo";
import { WhatsAppIcon, LinkIcon, CheckCircleIcon } from "@/components/Icons";
import { trackEvent } from "@/lib/analytics";

interface CityWhatsAppShareProps {
  cityName: string;
  citySlug: string;
  zoneName?: string;
  zoneSlug?: string;
  locale: Locale;
  duties: DutyPharmacy[];
}

export default function CityWhatsAppShare({
  cityName,
  citySlug,
  zoneName,
  zoneSlug,
  locale,
  duties,
}: CityWhatsAppShareProps) {
  const t = getDict(locale);
  const [copied, setCopied] = useState(false);

  if (duties.length === 0) return null;

  const shareUrl = buildCityWhatsAppShareUrl(
    {
      cityName,
      citySlug,
      zoneName,
      zoneSlug,
      pharmacies: duties,
    },
    locale,
  );

  const canonicalPath = zoneSlug
    ? zoneHref(locale, citySlug, zoneSlug)
    : cityHref(locale, citySlug);
  const webUrl = `${PRODUCTION_DOMAIN}${canonicalPath}`;

  const handleShareClick = () => {
    trackEvent("City WhatsApp Share Click", {
      city: citySlug,
      zone: zoneSlug ?? null,
      locale,
      count: duties.length,
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(webUrl);
      setCopied(true);
      trackEvent("Copy Link Click", {
        city: citySlug,
        zone: zoneSlug ?? null,
        locale,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <aside
      aria-label={t.shareCityWhatsApp.title(cityName)}
      className="my-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/20 text-[#25D366]">
            <WhatsAppIcon className="text-2xl" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {t.shareCityWhatsApp.title(cityName)}
            </h3>
            <p className="text-xs text-muted">
              {t.shareCityWhatsApp.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleShareClick}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#20ba59] active:scale-95"
          >
            <WhatsAppIcon className="text-lg" />
            <span>{t.shareCityWhatsApp.button}</span>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={copied ? t.shareCityWhatsApp.copied : "Copy link"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted transition hover:bg-surface-muted hover:text-foreground active:scale-95"
            title={copied ? t.shareCityWhatsApp.copied : "Copy link"}
          >
            {copied ? (
              <CheckCircleIcon className="text-emerald-600 text-base" />
            ) : (
              <LinkIcon className="text-base" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
