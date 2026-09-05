import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/types";
import { getDict, homeHref } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header({ locale }: { locale: Locale }) {
  const t = getDict(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-[#01473d] via-[#02604f] to-[#01473d] text-white shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href={homeHref(locale)}
          className="flex items-center gap-3 transition hover:opacity-95"
          aria-label={t.brand}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-md ring-1 ring-white/20">
            <Image
              src="/logo-icon.png"
              alt="H24 Pharmacie"
              width={40}
              height={40}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <div className="leading-tight">
            <span className="flex items-center gap-1 text-lg font-black tracking-tight text-white">
              <span>h24</span>
              <span className="text-emerald-200">pharmacie</span>
            </span>
            <span className="block text-[11px] font-medium tracking-wide text-emerald-100/90">
              {t.tagline}
            </span>
          </div>
        </Link>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
