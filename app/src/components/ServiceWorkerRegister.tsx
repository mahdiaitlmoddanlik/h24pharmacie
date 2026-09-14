"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";

export default function ServiceWorkerRegister({ locale }: { locale: Locale }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          // Service worker registered successfully
        })
        .catch(() => {
          // Silent fallback if service worker fails or is unsupported
        });
    }

    // 2. Offline / Online event listeners
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("offline", handleOffline);
      window.addEventListener("online", handleOnline);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("online", handleOnline);
      }
    };
  }, []);

  if (!isOffline) return null;

  return (
    <aside
      aria-live="polite"
      role="status"
      className="fixed bottom-3 start-3 end-3 z-50 mx-auto max-w-md rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900 shadow-lg sm:bottom-4 sm:end-4 sm:start-auto sm:max-w-sm"
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
        <span>
          {locale === "ar"
            ? "أنت في وضع غير متصل. البيانات المحفوظة متاحة للاطلاع."
            : locale === "en"
            ? "Offline mode active. Cached pharmacy pages remain accessible."
            : locale === "es"
            ? "Modo sin conexión. Las páginas guardadas siguen accesibles."
            : "Mode hors-ligne actif. Les pages déjà consultées restent accessibles."}
        </span>
      </div>
    </aside>
  );
}
