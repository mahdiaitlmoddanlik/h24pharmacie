"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/types";
import { getDict } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import { CloseIcon, ShieldCheckIcon } from "@/components/Icons";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallPrompt({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);

    if (isStandalone) return;

    // Check dismissal cool-off (7 days)
    try {
      const dismissedUntil = localStorage.getItem("pwa_prompt_dismissed_until");
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        return;
      }
    } catch {}

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isAppleMobile);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
      trackEvent("PWA Install Prompt Shown", { locale, platform: "standard" });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If on iOS mobile browser, show after 4 seconds of reading
    let timer: NodeJS.Timeout | undefined;
    if (isAppleMobile) {
      timer = setTimeout(() => {
        setShow(true);
        trackEvent("PWA Install Prompt Shown", { locale, platform: "ios" });
      }, 4000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      if (timer) clearTimeout(timer);
    };
  }, [locale]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          trackEvent("PWA Install Accepted", { locale, platform: "standard" });
        } else {
          trackEvent("PWA Install Dismissed", { locale, platform: "standard" });
        }
      } catch {}
      setDeferredPrompt(null);
      setShow(false);
      return;
    }

    if (isIos) {
      setShowIosHelp(true);
      trackEvent("PWA Install Prompt Shown", { locale, platform: "ios_guide" });
    }
  };

  const handleDismiss = () => {
    setShow(false);
    try {
      // Dismiss for 7 days
      localStorage.setItem(
        "pwa_prompt_dismissed_until",
        (Date.now() + 7 * 24 * 60 * 60 * 1000).toString(),
      );
    } catch {}
    trackEvent("PWA Install Dismissed", { locale });
  };

  if (!show) return null;

  return (
    <aside
      aria-label={t.pwaPrompt.title}
      className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:end-4 z-50 mx-auto max-w-sm rounded-2xl border border-emerald-600/30 bg-surface/95 p-4 text-foreground shadow-2xl backdrop-blur-md ring-1 ring-black/5"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-50 shadow-sm">
          <Image
            src="/logo-icon.png"
            alt="H24 Pharmacie"
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 pr-6 rtl:pr-0 rtl:pl-6">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-extrabold text-foreground truncate">
              {t.pwaPrompt.title}
            </h4>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
              <ShieldCheckIcon className="text-xs" />
              24h/24
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">
            {t.pwaPrompt.description}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer"
          className="absolute top-3 end-3 rounded-lg p-1 text-muted hover:bg-surface-muted hover:text-foreground transition"
        >
          <CloseIcon className="text-base" />
        </button>
      </div>

      {showIosHelp && (
        <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-50/80 p-3 text-xs leading-relaxed text-emerald-950">
          <p className="font-semibold text-emerald-900">
            {t.pwaPrompt.iosInstructions}
          </p>
        </div>
      )}

      <div className="mt-3.5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-muted hover:text-foreground transition"
        >
          {t.pwaPrompt.later}
        </button>
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-primary-dark active:scale-95"
        >
          {t.pwaPrompt.install}
        </button>
      </div>
    </aside>
  );
}
