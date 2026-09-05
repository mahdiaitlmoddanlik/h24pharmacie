import type { DutyPeriod, Locale, VerificationStatus } from "@/lib/types";

export const locales: Locale[] = ["fr", "ar"];
export const defaultLocale: Locale = "fr";

export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return isRTL(locale) ? "rtl" : "ltr";
}

/** Path prefix for a locale ("" for default fr, "/ar" for arabic). */
export function localePrefix(locale: Locale): string {
  return locale === "ar" ? "/ar" : "";
}

export function cityHref(locale: Locale, slug: string): string {
  return `${localePrefix(locale)}/pharmacie-de-garde/${slug}`;
}

export function pharmacyHref(
  locale: Locale,
  citySlug: string,
  pharmacySlug: string,
): string {
  return `${localePrefix(locale)}/pharmacie/${citySlug}/${pharmacySlug}`;
}

export function homeHref(locale: Locale): string {
  return locale === "ar" ? "/ar" : "/";
}

export function legalHref(locale: Locale): string {
  return `${localePrefix(locale)}/mentions-legales`;
}

type Dict = {
  brand: string;
  tagline: string;
  hero: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    useLocation: string;
    locating: string;
    searchCta: string;
  };
  nav: {
    home: string;
    cities: string;
  };
  popularCities: string;
  popularCitiesSub: string;
  onDutyNow: string;
  pharmacy: string;
  pharmacies: string;
  viewCity: string;
  periods: Record<DutyPeriod, string>;
  periodAll: string;
  neighborhoods: string;
  neighborhoodsAll: string;
  lastUpdated: string;
  source: string;
  call: string;
  directions: string;
  waze: string;
  whatsapp: string;
  reportIssue: string;
  distanceUnknown: string;
  verification: Record<VerificationStatus, string>;
  disclaimerTitle: string;
  disclaimer: string;
  seoIntroTitle: (city: string) => string;
  seoIntro: (city: string) => string;
  cityTitle: (city: string) => string;
  noResults: string;
  noResultsSub: string;
  dutyUnavailableTitle: string;
  dutyUnavailable: string;
  dutyUnavailableShort: string;
  noLastUpdated: string;
  notOnDuty: string;
  relatedCities: string;
  backHome: string;
  footer: {
    about: string;
    aboutText: string;
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    rights: string;
    sourcesNote: string;
  };
  report: {
    title: string;
    subtitle: string;
    type: string;
    types: Record<string, string>;
    message: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    successSub: string;
    error: string;
    cancel: string;
    close: string;
  };
  ad: string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  justNow: string;
  installApp: string;
};

const fr: Dict = {
  brand: "H24 Pharmacie",
  tagline: "Pharmacies de garde au Maroc",
  hero: {
    title: "Pharmacies de garde au Maroc",
    subtitle: "Trouvez rapidement une pharmacie ouverte près de vous",
    searchPlaceholder: "Cherchez votre ville (ex. Casablanca)…",
    useLocation: "Utiliser ma position",
    locating: "Localisation…",
    searchCta: "Rechercher",
  },
  nav: { home: "Accueil", cities: "Villes" },
  popularCities: "Villes populaires",
  popularCitiesSub: "Sélectionnez une ville pour voir les pharmacies de garde",
  onDutyNow: "de garde aujourd'hui",
  pharmacy: "pharmacie",
  pharmacies: "pharmacies",
  viewCity: "Voir",
  periods: {
    day: "Jour",
    night: "Nuit",
    "24h": "24h/24",
    unknown: "Inconnu",
  },
  periodAll: "Toutes",
  neighborhoods: "Quartiers",
  neighborhoodsAll: "Tous les quartiers",
  lastUpdated: "Dernière mise à jour",
  source: "Source",
  call: "Appeler",
  directions: "Google Maps",
  waze: "Waze",
  whatsapp: "WhatsApp",
  reportIssue: "Signaler une erreur",
  distanceUnknown: "Activez la localisation pour voir la distance",
  verification: {
    unverified: "Non vérifiée",
    source_verified: "Vérifiée (source)",
    user_confirmed: "Confirmée par les utilisateurs",
    pharmacy_claimed: "Pharmacie vérifiée",
  },
  disclaimerTitle: "Important",
  disclaimer:
    "Les informations sont fournies à titre indicatif et peuvent changer. Veuillez appeler la pharmacie avant de vous déplacer.",
  seoIntroTitle: (city) => `Trouver une pharmacie de garde à ${city}`,
  seoIntro: (city) =>
    `Consultez la liste des pharmacies de garde à ${city} aujourd'hui, de jour comme de nuit. Pour chaque pharmacie, retrouvez l'adresse, le numéro de téléphone et l'itinéraire via Google Maps ou Waze. Les gardes changent quotidiennement : appelez toujours la pharmacie avant de vous déplacer pour confirmer qu'elle est bien ouverte.`,
  cityTitle: (city) => `Pharmacie de garde ${city} aujourd'hui`,
  noResults: "Aucune pharmacie trouvée",
  noResultsSub:
    "Aucune pharmacie de garde n'est disponible pour cette sélection. Essayez un autre filtre.",
  dutyUnavailableTitle: "Liste de garde indisponible",
  dutyUnavailable:
    "La liste de garde de cette ville n'a pas encore été vérifiée aujourd'hui. Consultez la source et appelez avant de vous déplacer.",
  dutyUnavailableShort: "Liste en cours de mise à jour",
  noLastUpdated: "Non disponible",
  notOnDuty: "Cette pharmacie n'est pas actuellement confirmée de garde.",
  relatedCities: "Autres villes",
  backHome: "Retour à l'accueil",
  footer: {
    about: "À propos",
    aboutText:
      "H24 Pharmacie vous aide à trouver rapidement une pharmacie ouverte, de jour comme de nuit (24h/24), dans les principales villes du Maroc.",
    legal: "Informations légales",
    privacy: "Confidentialité",
    terms: "Conditions d'utilisation",
    contact: "Contact",
    rights: "Tous droits réservés.",
    sourcesNote:
      "Données agrégées à partir de sources publiques. Signalez toute erreur pour nous aider à améliorer la qualité.",
  },
  report: {
    title: "Signaler une erreur",
    subtitle: "Aidez-nous à garder les informations exactes",
    type: "Type de problème",
    types: {
      closed: "La pharmacie est fermée",
      wrong_phone: "Numéro de téléphone incorrect",
      wrong_address: "Adresse incorrecte",
      not_on_duty: "Pas de garde aujourd'hui",
      other: "Autre",
    },
    message: "Message (optionnel)",
    messagePlaceholder: "Décrivez le problème…",
    submit: "Envoyer le signalement",
    submitting: "Envoi…",
    success: "Merci !",
    successSub: "Votre signalement a bien été enregistré.",
    error: "Une erreur est survenue. Réessayez.",
    cancel: "Annuler",
    close: "Fermer",
  },
  ad: "Publicité",
  minutesAgo: (n) => `il y a ${n} min`,
  hoursAgo: (n) => `il y a ${n} h`,
  justNow: "à l'instant",
  installApp: "Installer l'application",
};

const ar: Dict = {
  brand: "H24 Pharmacie",
  tagline: "صيدليات الحراسة بالمغرب",
  hero: {
    title: "صيدليات الحراسة بالمغرب",
    subtitle: "اعثر بسرعة على صيدلية مفتوحة بالقرب منك",
    searchPlaceholder: "ابحث عن مدينتك (مثال: الدار البيضاء)…",
    useLocation: "استخدام موقعي",
    locating: "تحديد الموقع…",
    searchCta: "بحث",
  },
  nav: { home: "الرئيسية", cities: "المدن" },
  popularCities: "المدن الأكثر بحثاً",
  popularCitiesSub: "اختر مدينة لعرض صيدليات الحراسة",
  onDutyNow: "في الحراسة اليوم",
  pharmacy: "صيدلية",
  pharmacies: "صيدليات",
  viewCity: "عرض",
  periods: {
    day: "نهار",
    night: "ليل",
    "24h": "24 ساعة",
    unknown: "غير محدد",
  },
  periodAll: "الكل",
  neighborhoods: "الأحياء",
  neighborhoodsAll: "كل الأحياء",
  lastUpdated: "آخر تحديث",
  source: "المصدر",
  call: "اتصال",
  directions: "خرائط Google",
  waze: "Waze",
  whatsapp: "واتساب",
  reportIssue: "الإبلاغ عن خطأ",
  distanceUnknown: "فعّل تحديد الموقع لمعرفة المسافة",
  verification: {
    unverified: "غير مؤكدة",
    source_verified: "مؤكدة (مصدر)",
    user_confirmed: "مؤكدة من المستخدمين",
    pharmacy_claimed: "صيدلية موثقة",
  },
  disclaimerTitle: "هام",
  disclaimer:
    "المعلومات مقدمة للمساعدة وقد تتغير. يرجى الاتصال بالصيدلية قبل التوجه إليها.",
  seoIntroTitle: (city) => `العثور على صيدلية حراسة في ${city}`,
  seoIntro: (city) =>
    `اطّلع على قائمة صيدليات الحراسة في ${city} اليوم، نهاراً وليلاً. لكل صيدلية ستجد العنوان ورقم الهاتف والاتجاهات عبر خرائط Google أو Waze. تتغير الحراسة يومياً: اتصل دائماً بالصيدلية قبل التوجه إليها للتأكد من أنها مفتوحة.`,
  cityTitle: (city) => `صيدليات الحراسة ${city} اليوم`,
  noResults: "لم يتم العثور على صيدليات",
  noResultsSub: "لا توجد صيدلية حراسة لهذا الاختيار. جرّب عامل تصفية آخر.",
  dutyUnavailableTitle: "قائمة الحراسة غير متاحة",
  dutyUnavailable:
    "لم يتم التحقق من قائمة الحراسة لهذه المدينة اليوم بعد. راجع المصدر واتصل بالصيدلية قبل التوجه إليها.",
  dutyUnavailableShort: "القائمة قيد التحديث",
  noLastUpdated: "غير متاح",
  notOnDuty: "لم يتم تأكيد أن هذه الصيدلية في الحراسة حالياً.",
  relatedCities: "مدن أخرى",
  backHome: "العودة إلى الرئيسية",
  footer: {
    about: "حول",
    aboutText:
      "H24 Pharmacie يساعدكم في العثور السريع على صيدلية حراسة مفتوحة، ليلاً ونهاراً (24/24)، في كبرى مدن المملكة المغربية.",
    legal: "معلومات قانونية",
    privacy: "الخصوصية",
    terms: "شروط الاستخدام",
    contact: "اتصل بنا",
    rights: "جميع الحقوق محفوظة.",
    sourcesNote:
      "بيانات مجمّعة من مصادر عامة. أبلغ عن أي خطأ لمساعدتنا في تحسين الجودة.",
  },
  report: {
    title: "الإبلاغ عن خطأ",
    subtitle: "ساعدنا في الحفاظ على دقة المعلومات",
    type: "نوع المشكلة",
    types: {
      closed: "الصيدلية مغلقة",
      wrong_phone: "رقم هاتف غير صحيح",
      wrong_address: "عنوان غير صحيح",
      not_on_duty: "ليست في الحراسة اليوم",
      other: "أخرى",
    },
    message: "رسالة (اختياري)",
    messagePlaceholder: "صف المشكلة…",
    submit: "إرسال البلاغ",
    submitting: "جارٍ الإرسال…",
    success: "شكراً لك!",
    successSub: "تم تسجيل بلاغك بنجاح.",
    error: "حدث خطأ. حاول مرة أخرى.",
    cancel: "إلغاء",
    close: "إغلاق",
  },
  ad: "إعلان",
  minutesAgo: (n) => `قبل ${n} دقيقة`,
  hoursAgo: (n) => `قبل ${n} ساعة`,
  justNow: "الآن",
  installApp: "تثبيت التطبيق",
};

const dictionaries: Record<Locale, Dict> = { fr, ar };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? fr;
}

export function formatRelativeTime(date: Date | null, locale: Locale): string {
  const t = getDict(locale);
  if (!date) return t.noLastUpdated;
  const diffMs = Date.now() - date.getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return t.justNow;
  if (mins < 60) return t.minutesAgo(mins);
  return t.hoursAgo(Math.floor(mins / 60));
}

export function formatDateTime(date: Date | null, locale: Locale): string {
  if (!date) return getDict(locale).noLastUpdated;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-MA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
