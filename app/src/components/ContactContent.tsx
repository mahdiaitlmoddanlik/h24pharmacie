import Link from "next/link";
import type { Locale } from "@/lib/types";
import { contactHref, getDict, homeHref, legalHref } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRightIcon, PhoneIcon, ShieldCheckIcon } from "@/components/Icons";

export default function ContactContent({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const isAr = locale === "ar";

  return (
    <>
      <Header locale={locale} />

      <main className="flex-1">
        {/* Header band */}
        <section className="border-b border-emerald-900/10 bg-gradient-to-b from-primary-dark to-primary px-4 pb-8 pt-6 text-white">
          <div className="mx-auto max-w-3xl">
            <nav className="flex items-center gap-1.5 text-xs font-medium text-emerald-100">
              <Link href={homeHref(locale)} className="hover:text-white">
                {t.nav.home}
              </Link>
              <ChevronRightIcon className="text-sm rtl:rotate-180" />
              <span className="text-white">
                {isAr ? "اتصل بنا" : "Contact"}
              </span>
            </nav>
            <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {isAr ? "تواصل مع فريق H24 Pharmacie" : "Contactez l'équipe H24 Pharmacie"}
            </h1>
            <p className="mt-2 text-sm text-emerald-100">
              {isAr
                ? "نحن رهن إشارتكم للإجابة عن استفساراتكم أو لتحديث معلومات الصيدليات"
                : "Nous sommes à votre disposition pour toute question, suggestion ou mise à jour"}
            </p>
          </div>
        </section>

        {/* Content body */}
        <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
          {/* Main Contact Card */}
          <section className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-900 ring-1 ring-emerald-600/20">
                  {isAr ? "البريد الإلكتروني الرسمي" : "Email officiel"}
                </span>
                <h2 className="mt-2 text-xl font-extrabold text-foreground">
                  contact@h24pharmacie.com
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {isAr
                    ? "نرد على جميع الرسائل والطلبات في أقل من 24 ساعة."
                    : "Nous répondons à tous vos messages sous 24 heures ouvrées."}
                </p>
              </div>

              <a
                href="mailto:contact@h24pharmacie.com"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-primary-dark"
              >
                <span>{isAr ? "إرسال رسالة" : "Envoyer un email"}</span>
              </a>
            </div>
          </section>

          {/* Section Pharmacists / Health Pros */}
          <section className="rounded-card border border-border bg-surface p-6 shadow-soft space-y-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheckIcon className="text-lg text-primary-dark" />
              <span>
                {isAr
                  ? "هل أنت صيدلاني أو ممثل عن هيئة مهنية؟"
                  : "Vous êtes pharmacien ou professionnel de santé ?"}
              </span>
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {isAr
                ? "إذا كنتم ترغبون في تحيين أرقام الهاتف، مواعيد الحراسة، أو إضافة معلومات صيدليتكم، يرجى مراسلتنا مباشرة عبر البريد الإلكتروني مع ذكر اسم الصيدلية والمدينة."
                : "Pour mettre à jour les coordonnées de votre officine, corriger des horaires de garde ou vérifier votre fiche, écrivez-nous directement à contact@h24pharmacie.com en mentionnant le nom de votre établissement et sa ville."}
            </p>
          </section>

          {/* Emergency reminder */}
          <section className="rounded-card border border-amber-300 bg-amber-50 p-6 text-amber-950 shadow-xs">
            <h3 className="text-base font-bold flex items-center gap-2 text-amber-950">
              <span>⚠️</span>
              <span>{isAr ? "في حالات الطوارئ الطبية الحرجة" : "En cas d'urgence médicale vitale"}</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-amber-900">
              {isAr
                ? "H24 Pharmacie هو دليل إرشادي لمساعدتكم في الوصول إلى الصيدليات. في الحالات الطارئة الحرجة، يرجى الاتصال الفوري بأرقام الإسعاف الوطنية:"
                : "H24 Pharmacie est un service d'orientation vers les officines de garde. En cas d'urgence vitale, contactez directement les services de secours :"}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-lg border border-amber-200 bg-white p-2.5 text-center shadow-xs">
                <span className="block text-xs font-medium text-amber-800">{isAr ? "الإسعاف (SAMU)" : "SAMU (Urgences)"}</span>
                <strong className="text-lg font-black text-amber-950">141</strong>
              </div>
              <div className="rounded-lg border border-amber-200 bg-white p-2.5 text-center shadow-xs">
                <span className="block text-xs font-medium text-amber-800">{isAr ? "الوقاية المدنية" : "Protection Civile"}</span>
                <strong className="text-lg font-black text-amber-950">15</strong>
              </div>
              <div className="rounded-lg border border-amber-200 bg-white p-2.5 text-center shadow-xs">
                <span className="block text-xs font-medium text-amber-800">{isAr ? "الشرطة" : "Police Secours"}</span>
                <strong className="text-lg font-black text-amber-950">19</strong>
              </div>
              <div className="rounded-lg border border-amber-200 bg-white p-2.5 text-center shadow-xs">
                <span className="block text-xs font-medium text-amber-800">{isAr ? "الدرك الملكي" : "Gendarmerie"}</span>
                <strong className="text-lg font-black text-amber-950">177</strong>
              </div>
            </div>
          </section>

          {/* Links back */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted">
            <Link href={legalHref(locale)} className="underline hover:text-primary">
              {isAr ? "المعلومات القانونية وسياسة الخصوصية" : "Mentions légales & Confidentialité"}
            </Link>
            <Link href={homeHref(locale)} className="underline hover:text-primary">
              {t.backHome}
            </Link>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
