"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import { GlobeIcon, ChevronDownIcon } from "@/components/Icons";

const LANGUAGE_OPTIONS: { locale: Locale; label: string; short: string; flag: string }[] = [
  { locale: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
  { locale: "ar", label: "العربية", short: "عر", flag: "🇲🇦" },
  { locale: "en", label: "English", short: "EN", flag: "🇬🇧" },
  { locale: "es", label: "Español", short: "ES", flag: "🇪🇸" },
];

function getBasePath(pathname: string): { basePath: string; currentLocale: Locale } {
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return { basePath: pathname.replace(/^\/ar/, "") || "/", currentLocale: "ar" };
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { basePath: pathname.replace(/^\/en/, "") || "/", currentLocale: "en" };
  }
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    return { basePath: pathname.replace(/^\/es/, "") || "/", currentLocale: "es" };
  }
  return { basePath: pathname || "/", currentLocale: "fr" };
}

function getLocalizedHref(basePath: string, targetLocale: Locale): string {
  if (targetLocale === "fr") return basePath;
  const cleanPath = basePath === "/" ? "" : basePath;
  return `/${targetLocale}${cleanPath}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const { basePath, currentLocale } = getBasePath(pathname);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentOption =
    LANGUAGE_OPTIONS.find((opt) => opt.locale === currentLocale) ??
    LANGUAGE_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 sm:text-sm"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Changer de langue / Change language"
      >
        <GlobeIcon className="text-sm text-emerald-200" />
        <span className={currentLocale === "ar" ? "font-arabic" : ""}>
          {currentOption.label}
        </span>
        <ChevronDownIcon
          className={`text-xs transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 min-w-[150px] overflow-hidden rounded-2xl border border-white/15 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 rtl:left-0 rtl:right-auto">
          <div className="flex flex-col gap-0.5">
            {LANGUAGE_OPTIONS.map((opt) => {
              const isActive = opt.locale === currentLocale;
              const href = getLocalizedHref(basePath, opt.locale);
              return (
                <Link
                  key={opt.locale}
                  href={href}
                  prefetch={false}
                  onClick={() => {
                    setOpen(false);
                    if (!isActive) {
                      trackEvent("Language Switched", {
                        from: currentLocale,
                        to: opt.locale,
                      });
                    }
                  }}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-primary-dark"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{opt.flag}</span>
                    <span className={opt.locale === "ar" ? "font-arabic font-bold" : ""}>
                      {opt.label}
                    </span>
                  </span>
                  <span
                    className={`text-xs uppercase font-mono ${
                      isActive ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    {opt.short}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
