"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/types";

function counterpart(pathname: string): { href: string; target: Locale } {
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    const stripped = pathname.replace(/^\/ar/, "") || "/";
    return { href: stripped, target: "fr" };
  }
  const href = pathname === "/" ? "/ar" : `/ar${pathname}`;
  return { href, target: "ar" };
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const { href, target } = counterpart(pathname);

  return (
    <Link
      href={href}
      prefetch={false}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20"
      aria-label={target === "ar" ? "التبديل إلى العربية" : "Passer au français"}
    >
      <span className={target === "ar" ? "font-arabic" : ""}>
        {target === "ar" ? "العربية" : "Français"}
      </span>
    </Link>
  );
}
