import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDict, homeHref, legalHref } from "@/lib/i18n";
import { CrossIcon } from "@/components/Icons";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <Link
            href={homeHref(locale)}
            className="flex items-center gap-2 text-foreground"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg text-white">
              <CrossIcon />
            </span>
            <span className="font-extrabold">{t.brand}</span>
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
                href={legalHref(locale)}
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
            © {year} {t.brand} {t.tagline}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
