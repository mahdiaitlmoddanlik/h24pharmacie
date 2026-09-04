import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDict, homeHref } from "@/lib/i18n";
import { CrossIcon } from "@/components/Icons";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header({ locale }: { locale: Locale }) {
  const t = getDict(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-primary-dark/95 backdrop-blur supports-[backdrop-filter]:bg-primary-dark/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href={homeHref(locale)} className="flex items-center gap-2.5 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl text-primary shadow-sm">
            <CrossIcon />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight">
              {t.brand}
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-wider text-emerald-200">
              {t.tagline}
            </span>
          </span>
        </Link>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
