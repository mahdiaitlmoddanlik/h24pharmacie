import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/types";
import { contactHref, getDict, homeHref, legalHref } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <Link
            href={homeHref(locale)}
            className="inline-flex items-center gap-3 text-foreground transition hover:opacity-90"
            aria-label={t.brand}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 p-1">
              <Image
                src="/logo-icon.png"
                alt="H24 Pharmacie"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <span className="flex items-center gap-1 text-lg font-black tracking-tight">
                <span className="text-[#02604f]">h24</span>
                <span className="text-[#504e4e]">pharmacie</span>
              </span>
              <span className="block text-[11px] font-medium text-muted">
                {t.tagline}
              </span>
            </div>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {t.footer.aboutText}
          </p>
        </div>

        <div className="text-sm">
          <h3 className="mb-3 font-semibold text-foreground">
            {t.footer.legal}
          </h3>
          <ul className="space-y-2 text-muted">
            <li>
              <Link
                href={legalHref(locale)}
                className="transition hover:text-primary"
              >
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link
                href={legalHref(locale)}
                className="transition hover:text-primary"
              >
                {t.footer.terms}
              </Link>
            </li>
            <li>
              <Link
                href={contactHref(locale)}
                className="transition hover:text-primary"
              >
                {t.footer.contact}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-5 text-xs leading-relaxed text-muted">
          <p>{t.footer.sourcesNote}</p>
          <p className="mt-2">
            © {year} {t.brand}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
