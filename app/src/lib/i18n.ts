import type { DutyPeriod, Locale, VerificationStatus } from "@/lib/types";

export const locales: Locale[] = ["fr", "ar", "en", "es"];
export const defaultLocale: Locale = "fr";

export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return isRTL(locale) ? "rtl" : "ltr";
}

/** Path prefix for a locale ("" for default fr, "/ar", "/en", "/es"). */
export function localePrefix(locale: Locale): string {
  return locale === "fr" ? "" : `/${locale}`;
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
  return locale === "fr" ? "/" : `/${locale}`;
}

export function legalHref(locale: Locale): string {
  return `${localePrefix(locale)}/mentions-legales`;
}

export function contactHref(locale: Locale): string {
  return `${localePrefix(locale)}/contact`;
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
  nearYou: string;
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
  sortedByDistance: string;
  clearLocation: string;
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
  nearYou: "Près de vous",
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
  sortedByDistance: "Trié par distance (la plus proche en premier)",
  clearLocation: "Désactiver le tri GPS",
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
  nearYou: "بالقرب منك",
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
  sortedByDistance: "مرتبة حسب المسافة (الأقرب أولاً)",
  clearLocation: "إلغاء الترتيب حسب المسافة",
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

const en: Dict = {
  brand: "H24 Pharmacie",
  tagline: "Duty Pharmacies in Morocco",
  hero: {
    title: "Duty Pharmacies in Morocco",
    subtitle: "Quickly find an open pharmacy on duty near you (24/7, night & day)",
    searchPlaceholder: "Search your city (e.g. Marrakech, Casablanca)…",
    useLocation: "Use my location",
    locating: "Locating…",
    searchCta: "Search",
  },
  nav: { home: "Home", cities: "Cities" },
  popularCities: "Popular Cities",
  popularCitiesSub: "Select a city to view pharmacies on duty today",
  nearYou: "Near you",
  onDutyNow: "on duty today",
  pharmacy: "pharmacy",
  pharmacies: "pharmacies",
  viewCity: "View",
  periods: {
    day: "Day",
    night: "Night",
    "24h": "24h/24",
    unknown: "Unknown",
  },
  periodAll: "All",
  neighborhoods: "Districts",
  neighborhoodsAll: "All districts",
  lastUpdated: "Last updated",
  source: "Source",
  call: "Call",
  directions: "Google Maps",
  waze: "Waze",
  whatsapp: "WhatsApp",
  reportIssue: "Report error",
  distanceUnknown: "Enable location to calculate distance",
  sortedByDistance: "Sorted by distance (closest first)",
  clearLocation: "Clear distance sorting",
  verification: {
    unverified: "Unverified",
    source_verified: "Verified",
    user_confirmed: "Confirmed by users",
    pharmacy_claimed: "Official pharmacy",
  },
  disclaimerTitle: "Important Notice",
  disclaimer:
    "Duty schedules are provided for informational assistance and may change. Please call the pharmacy before traveling.",
  seoIntroTitle: (city) => `Find a duty pharmacy in ${city}`,
  seoIntro: (city) =>
    `View the full schedule of on-duty pharmacies open today in ${city}, day and night. For each pharmacy you will find the address, direct phone number, and GPS routes via Google Maps or Waze. Shifts change regularly: always call ahead before traveling.`,
  cityTitle: (city) => `Duty Pharmacies in ${city} Today`,
  noResults: "No pharmacies found",
  noResultsSub: "No duty pharmacy matches this selection. Try another filter.",
  dutyUnavailableTitle: "Duty schedule unavailable",
  dutyUnavailable:
    "The duty schedule for this city has not been verified yet today. Please check the source or call the nearest pharmacy.",
  dutyUnavailableShort: "Updating schedule…",
  noLastUpdated: "Unavailable",
  notOnDuty: "This pharmacy is not confirmed to be on duty right now.",
  relatedCities: "Other cities",
  backHome: "Back to Home",
  footer: {
    about: "About",
    aboutText:
      "H24 Pharmacie helps you quickly find verified on-duty pharmacies open day and night (24/7) in major cities across the Kingdom of Morocco.",
    legal: "Legal Notice",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    contact: "Contact Us",
    rights: "All rights reserved.",
    sourcesNote:
      "Data aggregated from official syndicates and public records. Report any discrepancy to help us improve accuracy.",
  },
  report: {
    title: "Report an issue",
    subtitle: "Help us keep duty pharmacy information 100% accurate",
    type: "Issue type",
    types: {
      closed: "Pharmacy is closed",
      wrong_phone: "Incorrect phone number",
      wrong_address: "Incorrect address",
      not_on_duty: "Not on duty today",
      other: "Other issue",
    },
    message: "Message (optional)",
    messagePlaceholder: "Describe the issue…",
    submit: "Submit report",
    submitting: "Submitting…",
    success: "Thank you!",
    successSub: "Your report has been recorded.",
    error: "An error occurred. Please try again.",
    cancel: "Cancel",
    close: "Close",
  },
  ad: "Advertisement",
  minutesAgo: (n) => `${n} min ago`,
  hoursAgo: (n) => `${n} h ago`,
  justNow: "Just now",
  installApp: "Install App",
};

const es: Dict = {
  brand: "H24 Pharmacie",
  tagline: "Farmacias de guardia en Marruecos",
  hero: {
    title: "Farmacias de guardia en Marruecos",
    subtitle: "Encuentra rápidamente una farmacia de turno abierta cerca de ti (24h, noche y día)",
    searchPlaceholder: "Busca tu ciudad (ej. Marrakech, Casablanca)…",
    useLocation: "Usar mi ubicación",
    locating: "Localizando…",
    searchCta: "Buscar",
  },
  nav: { home: "Inicio", cities: "Ciudades" },
  popularCities: "Ciudades populares",
  popularCitiesSub: "Selecciona una ciudad para ver las farmacias de guardia hoy",
  nearYou: "Cerca de ti",
  onDutyNow: "de guardia hoy",
  pharmacy: "farmacia",
  pharmacies: "farmacias",
  viewCity: "Ver",
  periods: {
    day: "Día",
    night: "Noche",
    "24h": "24h/24",
    unknown: "Desconocido",
  },
  periodAll: "Todas",
  neighborhoods: "Barrios",
  neighborhoodsAll: "Todos los barrios",
  lastUpdated: "Última actualización",
  source: "Fuente",
  call: "Llamar",
  directions: "Google Maps",
  waze: "Waze",
  whatsapp: "WhatsApp",
  reportIssue: "Informar de un error",
  distanceUnknown: "Activa la ubicación para calcular la distancia",
  sortedByDistance: "Ordenado por distancia (más cercana primero)",
  clearLocation: "Borrar orden por distancia",
  verification: {
    unverified: "Sin verificar",
    source_verified: "Verificada",
    user_confirmed: "Confirmada por usuarios",
    pharmacy_claimed: "Farmacia oficial",
  },
  disclaimerTitle: "Aviso importante",
  disclaimer:
    "Los turnos de guardia se facilitan a título informativo y pueden cambiar. Llama siempre a la farmacia antes de desplazarte.",
  seoIntroTitle: (city) => `Encontrar una farmacia de guardia en ${city}`,
  seoIntro: (city) =>
    `Consulta la lista de farmacias de guardia abiertas hoy en ${city}, de día y de noche. Para cada farmacia encontrarás la dirección exacta, teléfono directo y rutas GPS mediante Google Maps o Waze. Los turnos cambian a diario: llama antes de desplazarte.`,
  cityTitle: (city) => `Farmacias de guardia en ${city} hoy`,
  noResults: "No se encontraron farmacias",
  noResultsSub: "Ninguna farmacia de turno coincide con esta selección. Prueba con otro filtro.",
  dutyUnavailableTitle: "Turno no disponible",
  dutyUnavailable:
    "El horario de guardia para esta ciudad aún no ha sido confirmado hoy. Consulta la fuente oficial o llama a la farmacia.",
  dutyUnavailableShort: "Actualizando turno…",
  noLastUpdated: "No disponible",
  notOnDuty: "No se ha confirmado que esta farmacia esté de guardia en este momento.",
  relatedCities: "Otras ciudades",
  backHome: "Volver al inicio",
  footer: {
    about: "Acerca de",
    aboutText:
      "H24 Pharmacie te ayuda a encontrar rápidamente farmacias de guardia abiertas, de noche y de día (24h/24), en las principales ciudades de Marruecos.",
    legal: "Aviso legal",
    privacy: "Privacidad",
    terms: "Términos de uso",
    contact: "Contacto",
    rights: "Todos los derechos reservados.",
    sourcesNote:
      "Datos recopilados de fuentes públicas oficiales. Informa de cualquier error para ayudarnos a mantener la máxima precisión.",
  },
  report: {
    title: "Informar de un error",
    subtitle: "Ayúdanos a mantener los horarios de guardia 100% exactos",
    type: "Tipo de problema",
    types: {
      closed: "La farmacia está cerrada",
      wrong_phone: "Teléfono incorrecto",
      wrong_address: "Dirección incorrecta",
      not_on_duty: "No está de guardia hoy",
      other: "Otro problema",
    },
    message: "Mensaje (opcional)",
    messagePlaceholder: "Describe el problema…",
    submit: "Enviar reporte",
    submitting: "Enviando…",
    success: "¡Muchas gracias!",
    successSub: "Tu reporte ha sido registrado con éxito.",
    error: "Ocurrió un error. Inténtalo de nuevo.",
    cancel: "Cancelar",
    close: "Cerrar",
  },
  ad: "Publicidad",
  minutesAgo: (n) => `hace ${n} min`,
  hoursAgo: (n) => `hace ${n} h`,
  justNow: "Ahora mismo",
  installApp: "Instalar aplicación",
};

const dictionaries: Record<Locale, Dict> = { fr, ar, en, es };

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
  const localeMap: Record<Locale, string> = {
    fr: "fr-MA",
    ar: "ar-MA",
    en: "en-US",
    es: "es-ES",
  };
  return new Intl.DateTimeFormat(localeMap[locale] || "fr-MA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
