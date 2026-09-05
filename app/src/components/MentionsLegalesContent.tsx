import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDict, homeHref } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRightIcon, ShieldCheckIcon } from "@/components/Icons";

export default function MentionsLegalesContent({ locale }: { locale: Locale }) {
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
                {isAr ? "معلومات قانونية وخصوصية" : "Mentions légales & Confidentialité"}
              </span>
            </nav>
            <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {isAr ? "المعلومات القانونية وسياسة الخصوصية" : "Mentions Légales & Politique de Confidentialité"}
            </h1>
            <p className="mt-2 text-sm text-emerald-100">
              {isAr
                ? "شروط الاستخدام، حماية البيانات، وإخلاء المسؤولية الطبية"
                : "Conditions d’utilisation, protection des données et avertissement médical"}
            </p>
          </div>
        </section>

        {/* Content body */}
        <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
          {isAr ? (
            <div className="space-y-8 text-foreground leading-relaxed">
              {/* Emergency Warning */}
              <section className="rounded-card border border-amber-500/20 bg-amber-500/10 p-6 text-amber-950 dark:text-amber-200">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>⚠️</span> تنبيه هام وإخلاء مسؤولية طبية
                </h2>
                <p className="mt-2 text-sm">
                  المعلومات المنشورة على هذا الموقع مقدمة <strong>للمساعدة والاستئناس فقط</strong> وقد يطرأ عليها أي تغيير طارئ من طرف نقابات أو مفتشيات الصيدليات.
                </p>
                <p className="mt-2 text-sm font-semibold">
                  يرجى دائماً الاتصال بالصيدلية عبر الهاتف قبل التوجه إليها للتأكد من فتح أبوابها وتوفر الأدوية المطلوبة.
                </p>
                <div className="mt-3 text-xs border-t border-amber-500/20 pt-2 flex flex-wrap gap-4">
                  <span>الإسعاف الطبي (SAMU): <strong>141</strong></span>
                  <span>الوقاية المدنية: <strong>15</strong></span>
                  <span>الشرطة: <strong>19</strong></span>
                  <span>الدرك الملكي: <strong>177</strong></span>
                </div>
              </section>

              {/* General terms */}
              <section className="rounded-card border border-border bg-surface p-6 shadow-soft space-y-4">
                <h2 className="text-lg font-bold text-foreground">1. طبيعة الخدمة ومصادر البيانات</h2>
                <p className="text-sm text-muted">
                  موقع <strong>صيدليات الحراسة المغرب</strong> منصة إرشادية مجانية ومفتوحة لعموم المواطنين، تهدف لتيسير الوصول السريع إلى صيدليات الحراسة النهارية والليلية في مختلف المدن المغربية.
                </p>
                <p className="text-sm text-muted">
                  تُجمع المعطيات الواردة من مصادر عمومية معتمدة ومفتوحة (بما فيها نقابة صيادلة مراكش، Telecontact.ma، وبلاغات الهيئات المهنية المحلية). نقوم بتنسيق وتحديث البيانات بانتظام لتيسير وصول المواطنين للخدمات الصحية الاستعجالية.
                </p>
              </section>

              {/* Privacy & CNDP */}
              <section className="rounded-card border border-border bg-surface p-6 shadow-soft space-y-4">
                <h2 className="text-lg font-bold text-foreground">2. حماية المعطيات الشخصية (القانون 09-08)</h2>
                <p className="text-sm text-muted">
                  نحن نولي أهمية قصوى لخصوصيتكم وفقاً للتشريعات المغربية المتعلقة بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي (القانون رقم 09-08):
                </p>
                <ul className="list-disc list-inside text-sm text-muted space-y-2">
                  <li><strong>الموقع الجغرافي:</strong> عند طلب «استخدام موقعي»، يتم تحديد الإحداثيات محلياً داخل متصفحك لحساب المسافة نحو أقرب صيدلية، ولا يتم تخزين موقعك الجغرافي الدقيق في خوادمنا.</li>
                  <li><strong>نظام الإبلاغ عن أخطاء:</strong> عند إرسال بلاغ عن صيدلية مغلقة أو هاتف غير صحيح، نقوم بتشفير عنوان IP بتقنية تجزئة أحادية الاتجاه (SHA-256 HMAC Hash) مجهولة الهوية فقط لمنع السبام ورسائل الاحتيال، ولا نجمع أسماء أو إيميلات دون رغبتكم.</li>
                  <li><strong>ملفات تعريف الارتباط (Cookies):</strong> لا نستخدم أي ملفات تجسس أو تتبع لأغراض إعلانية مسيئة.</li>
                </ul>
              </section>

              {/* Contact and Removal */}
              <section className="rounded-card border border-border bg-surface p-6 shadow-soft space-y-4">
                <h2 className="text-lg font-bold text-foreground">3. طلبات التعديل، التحقق أو الحذف</h2>
                <p className="text-sm text-muted">
                  إذا كنت صيدلانياً أو ممثلاً عن هيئة وترغب في تصحيح هاتف صيدليتك، أو تحديث جدول الحراسة، أو تقديم أي استفسار، نرحب بتواصلكم المباشر:
                </p>
                <div className="rounded-lg bg-surface-muted p-4 text-sm">
                  <p>البريد الإلكتروني المخصص: <strong className="text-primary-dark">contact@h24pharmacie.com</strong></p>
                  <p className="mt-1 text-xs text-muted">تتم معالجة طلبات التصحيح في غضون 24 ساعة كحد أقصى حرصاً على صحة وسلامة المواطنين.</p>
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-8 text-foreground leading-relaxed">
              {/* Emergency Warning */}
              <section className="rounded-card border border-amber-500/20 bg-amber-500/10 p-6 text-amber-950 dark:text-amber-200">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>⚠️</span> Avertissement & Responsabilité Médicale
                </h2>
                <p className="mt-2 text-sm">
                  Les horaires et listes de garde sont diffusés <strong>à titre purement indicatif</strong>. Les plannings officiels peuvent faire l’objet de modifications inopinées par les conseils régionaux de l’Ordre des pharmaciens.
                </p>
                <p className="mt-2 text-sm font-semibold">
                  Il est impératif d’appeler l’officine par téléphone avant tout déplacement afin de vous assurer de son ouverture effective.
                </p>
                <div className="mt-3 text-xs border-t border-amber-500/20 pt-2 flex flex-wrap gap-4">
                  <span>SAMU Urgences Médicales: <strong>141</strong></span>
                  <span>Protection Civile (Pompiers): <strong>15</strong></span>
                  <span>Police Secours: <strong>19</strong></span>
                  <span>Gendarmerie Royale: <strong>177</strong></span>
                </div>
              </section>

              {/* Service Nature & Attribution */}
              <section className="rounded-card border border-border bg-surface p-6 shadow-soft space-y-4">
                <h2 className="text-lg font-bold text-foreground">1. Nature du service et attribution des sources</h2>
                <p className="text-sm text-muted">
                  <strong>H24 Pharmacie Maroc</strong> est une initiative citoyenne et indépendante conçue pour faciliter l’accès rapide aux officines de garde (jour, nuit, 24h/24) à travers le Royaume du Maroc.
                </p>
                <p className="text-sm text-muted">
                  Les données factuelles d’intérêt public (noms, adresses, téléphones, coordonnées GPS) sont indexées à partir de sources publiques consultables par tous (notamment le Syndicat des Pharmaciens de Marrakech, Telecontact.ma et les publications officielles locales). Ces informations sont centralisées dans le but exclusif de faciliter l'accès aux soins d'urgence des citoyens.
                </p>
              </section>

              {/* Privacy & CNDP */}
              <section className="rounded-card border border-border bg-surface p-6 shadow-soft space-y-4">
                <h2 className="text-lg font-bold text-foreground">2. Protection des données personnelles (Loi 09-08)</h2>
                <p className="text-sm text-muted">
                  Conformément aux dispositions de la <strong>Loi marocaine n° 09-08</strong> relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel :
                </p>
                <ul className="list-disc list-inside text-sm text-muted space-y-2">
                  <li><strong>Géolocalisation :</strong> La recherche par proximité utilise l’API de géolocalisation native de votre navigateur. Le calcul de distance s’effectue dans votre terminal ; vos coordonnées GPS précises ne sont jamais stockées sur nos serveurs.</li>
                  <li><strong>Signalements d’erreurs :</strong> Afin de prévenir les abus et les attaques par déni de service sur le formulaire de signalement, une empreinte chiffrée à sens unique de l’adresse IP (SHA-256 HMAC avec sel privé) est conservée temporairement. Aucune donnée nominative n’est exigée du visiteur.</li>
                  <li><strong>Traceurs :</strong> Ce site ne revend aucune donnée à des courtiers tiers.</li>
                </ul>
              </section>

              {/* Contact, Rectification & Claim */}
              <section className="rounded-card border border-border bg-surface p-6 shadow-soft space-y-4">
                <h2 className="text-lg font-bold text-foreground">3. Contact, réclamations et professionnels de santé</h2>
                <p className="text-sm text-muted">
                  Vous êtes pharmacien titulaire et souhaitez corriger une information, signaler un changement d’horaires ou demander le retrait de coordonnées ? Notre équipe traite ces demandes en priorité.
                </p>
                <div className="rounded-lg bg-surface-muted p-4 text-sm">
                  <p>Email de contact : <strong className="text-primary-dark">contact@h24pharmacie.com</strong></p>
                  <p className="mt-1 text-xs text-muted">Les requêtes légitimes d’actualisation ou de rectification sont exécutées sous 24h.</p>
                </div>
              </section>
            </div>
          )}

          <div className="flex items-center justify-center pt-4">
            <Link
              href={homeHref(locale)}
              className="inline-flex items-center gap-2 rounded-card bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
            >
              <ShieldCheckIcon className="text-base" />
              {t.backHome}
            </Link>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
