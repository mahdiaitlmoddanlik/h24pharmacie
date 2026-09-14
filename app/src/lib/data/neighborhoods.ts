import type { Locale } from "@/lib/types";

export interface Zone {
  slug: string;
  citySlug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  nameEs: string;
  aliases: string[];
}

export function getZoneName(zone: Zone, locale: Locale): string {
  switch (locale) {
    case "ar":
      return zone.nameAr;
    case "en":
      return zone.nameEn;
    case "es":
      return zone.nameEs;
    case "fr":
    default:
      return zone.nameFr;
  }
}

export const CANONICAL_ZONES: Record<string, Zone[]> = {
  casablanca: [
    {
      slug: "maarif",
      citySlug: "casablanca",
      nameFr: "Maârif",
      nameAr: "المعاريف",
      nameEn: "Maarif",
      nameEs: "Maârif",
      aliases: ["maarif", "ville bourgogne maarif"],
    },
    {
      slug: "bourgogne",
      citySlug: "casablanca",
      nameFr: "Bourgogne",
      nameAr: "بوركون",
      nameEn: "Bourgogne",
      nameEs: "Bourgogne",
      aliases: ["bourgogne", "ville bourgogne maarif"],
    },
    {
      slug: "ain-sebaa",
      citySlug: "casablanca",
      nameFr: "Aïn Sebaâ",
      nameAr: "عين السبع",
      nameEn: "Ain Sebaa",
      nameEs: "Aïn Sebaâ",
      aliases: ["ain sebaa"],
    },
    {
      slug: "sidi-bernoussi",
      citySlug: "casablanca",
      nameFr: "Sidi Bernoussi",
      nameAr: "سيدي البرنوصي",
      nameEn: "Sidi Bernoussi",
      nameEs: "Sidi Bernoussi",
      aliases: ["sidi bernoussi"],
    },
    {
      slug: "sidi-maarouf",
      citySlug: "casablanca",
      nameFr: "Sidi Maârouf",
      nameAr: "سيدي معروف",
      nameEn: "Sidi Maarouf",
      nameEs: "Sidi Maârouf",
      aliases: ["sidi maarouf"],
    },
    {
      slug: "hay-hassani",
      citySlug: "casablanca",
      nameFr: "Hay Hassani",
      nameAr: "الحي الحسني",
      nameEn: "Hay Hassani",
      nameEs: "Hay Hassani",
      aliases: ["hay hassani", "hay hassani - el oulfa"],
    },
    {
      slug: "oulfa",
      citySlug: "casablanca",
      nameFr: "El Oulfa",
      nameAr: "الألفة",
      nameEn: "El Oulfa",
      nameEs: "El Oulfa",
      aliases: ["oulfa", "hay hassani - el oulfa"],
    },
    {
      slug: "ain-chock",
      citySlug: "casablanca",
      nameFr: "Aïn Chock",
      nameAr: "عين الشق",
      nameEn: "Ain Chock",
      nameEs: "Aïn Chock",
      aliases: ["ain chock", "ain chok"],
    },
    {
      slug: "sidi-moumen",
      citySlug: "casablanca",
      nameFr: "Sidi Moumen",
      nameAr: "سيدي مومن",
      nameEn: "Sidi Moumen",
      nameEs: "Sidi Moumen",
      aliases: ["sidi moumen"],
    },
    {
      slug: "hay-mohammadi",
      citySlug: "casablanca",
      nameFr: "Hay Mohammadi",
      nameAr: "الحي المحمدي",
      nameEn: "Hay Mohammadi",
      nameEs: "Hay Mohammadi",
      aliases: ["hay mohammadi"],
    },
    {
      slug: "belvedere-roches-noires",
      citySlug: "casablanca",
      nameFr: "Belvédère - Roches Noires",
      nameAr: "بلفيدير - الصخور السوداء",
      nameEn: "Belvedere - Roches Noires",
      nameEs: "Belvédère - Roches Noires",
      aliases: ["belvedere - roches noires", "belvédère - roches noires"],
    },
    {
      slug: "california",
      citySlug: "casablanca",
      nameFr: "California",
      nameAr: "كاليفورنيا",
      nameEn: "California",
      nameEs: "California",
      aliases: ["california"],
    },
    {
      slug: "nouvelle-medina",
      citySlug: "casablanca",
      nameFr: "Nouvelle Médina",
      nameAr: "المدينة الجديدة",
      nameEn: "Nouvelle Medina",
      nameEs: "Nueva Medina",
      aliases: ["nouvelle medina"],
    },
    {
      slug: "anassi",
      citySlug: "casablanca",
      nameFr: "Anassi",
      nameAr: "أناسي",
      nameEn: "Anassi",
      nameEs: "Anassi",
      aliases: ["anassi"],
    },
    {
      slug: "lissasfa",
      citySlug: "casablanca",
      nameFr: "Lissasfa",
      nameAr: "ليساسفة",
      nameEn: "Lissasfa",
      nameEs: "Lissasfa",
      aliases: ["lissasfa"],
    },
  ],
  marrakech: [
    {
      slug: "gueliz",
      citySlug: "marrakech",
      nameFr: "Guéliz",
      nameAr: "جليز",
      nameEn: "Gueliz",
      nameEs: "Guéliz",
      aliases: ["guéliz", "gueliz", "grand gueliz"],
    },
    {
      slug: "medina",
      citySlug: "marrakech",
      nameFr: "Médina",
      nameAr: "المدينة القديمة",
      nameEn: "Medina",
      nameEs: "Medina",
      aliases: ["médina", "medina"],
    },
    {
      slug: "targa",
      citySlug: "marrakech",
      nameFr: "Targa",
      nameAr: "تاركة",
      nameEn: "Targa",
      nameEs: "Targa",
      aliases: ["targa"],
    },
    {
      slug: "daoudiat",
      citySlug: "marrakech",
      nameFr: "Daoudiate",
      nameAr: "الداوديات",
      nameEn: "Daoudiate",
      nameEs: "Daoudiate",
      aliases: ["daoudiat", "daoudiate"],
    },
    {
      slug: "mhamid",
      citySlug: "marrakech",
      nameFr: "Mhamid",
      nameAr: "المحاميد",
      nameEn: "Mhamid",
      nameEs: "Mhamid",
      aliases: ["mhamid", "lamhamid"],
    },
    {
      slug: "hay-al-izdihar",
      citySlug: "marrakech",
      nameFr: "Izdihar",
      nameAr: "الازدهار",
      nameEn: "Izdihar",
      nameEs: "Izdihar",
      aliases: ["izdihar", "hay al izdihar"],
    },
    {
      slug: "sidi-youssef",
      citySlug: "marrakech",
      nameFr: "Sidi Youssef Ben Ali",
      nameAr: "سيدي يوسف بن علي",
      nameEn: "Sidi Youssef Ben Ali",
      nameEs: "Sidi Youssef Ben Ali",
      aliases: ["sidi youssef ben ali", "sidi youssef"],
    },
    {
      slug: "palmeraie-nakhil",
      citySlug: "marrakech",
      nameFr: "Palmeraie / Ennakhil",
      nameAr: "النخيل - النخيل الجنوبي",
      nameEn: "Palmeraie / Ennakhil",
      nameEs: "Palmeral / Ennakhil",
      aliases: ["palmeraie / ennakhil", "nakhil sud"],
    },
    {
      slug: "sidi-ghanem-azzouzia",
      citySlug: "marrakech",
      nameFr: "Sidi Ghanem - Azzouzia",
      nameAr: "سيدي غانم - العزوزية",
      nameEn: "Sidi Ghanem - Azzouzia",
      nameEs: "Sidi Ghanem - Azzouzia",
      aliases: ["sidi ghanem", "azzouzia", "sidi ghanem azzouzia"],
    },
    {
      slug: "ain-itti",
      citySlug: "marrakech",
      nameFr: "Aïn Itti",
      nameAr: "عين إيطي",
      nameEn: "Ain Itti",
      nameEs: "Aïn Itti",
      aliases: ["aïn itti", "ain itti"],
    },
  ],
  rabat: [
    {
      slug: "agdal",
      citySlug: "rabat",
      nameFr: "Agdal",
      nameAr: "أكدال",
      nameEn: "Agdal",
      nameEs: "Agdal",
      aliases: ["agdal"],
    },
    {
      slug: "hay-riad",
      citySlug: "rabat",
      nameFr: "Hay Riad",
      nameAr: "حي الرياض",
      nameEn: "Hay Riad",
      nameEs: "Hay Riad",
      aliases: ["hay riad", "hay riyad"],
    },
    {
      slug: "centre-ville",
      citySlug: "rabat",
      nameFr: "Centre-ville",
      nameAr: "وسط المدينة",
      nameEn: "City Center",
      nameEs: "Centro Ciudad",
      aliases: ["centre ville", "centre-ville"],
    },
    {
      slug: "hassan",
      citySlug: "rabat",
      nameFr: "Hassan",
      nameAr: "حسان",
      nameEn: "Hassan",
      nameEs: "Hassan",
      aliases: ["hassan"],
    },
    {
      slug: "ocean-akkari",
      citySlug: "rabat",
      nameFr: "Océan - Akkari",
      nameAr: "المحيط - العكاري",
      nameEn: "Ocean - Akkari",
      nameEs: "Océano - Akkari",
      aliases: ["akkari océan orangers", "akkari ocean orangers", "ocean", "akkari"],
    },
    {
      slug: "medina",
      citySlug: "rabat",
      nameFr: "Médina",
      nameAr: "المدينة القديمة",
      nameEn: "Medina",
      nameEs: "Medina",
      aliases: ["medina", "médina"],
    },
  ],
  tanger: [
    {
      slug: "centre-ville",
      citySlug: "tanger",
      nameFr: "Centre-ville",
      nameAr: "وسط المدينة",
      nameEn: "City Center",
      nameEs: "Centro Ciudad",
      aliases: ["centre ville", "centre-ville", "tanger"],
    },
    {
      slug: "malabata",
      citySlug: "tanger",
      nameFr: "Malabata",
      nameAr: "مالاباطا",
      nameEn: "Malabata",
      nameEs: "Malabata",
      aliases: ["malabata"],
    },
    {
      slug: "iberia",
      citySlug: "tanger",
      nameFr: "Iberia",
      nameAr: "إيبيريا",
      nameEn: "Iberia",
      nameEs: "Iberia",
      aliases: ["iberia"],
    },
    {
      slug: "branes",
      citySlug: "tanger",
      nameFr: "Branes",
      nameAr: "البرانس",
      nameEn: "Branes",
      nameEs: "Branes",
      aliases: ["branes"],
    },
    {
      slug: "aouama",
      citySlug: "tanger",
      nameFr: "Aouama",
      nameAr: "العوامة",
      nameEn: "Aouama",
      nameEs: "Aouama",
      aliases: ["aouama"],
    },
  ],
  fes: [
    {
      slug: "agdal",
      citySlug: "fes",
      nameFr: "Agdal",
      nameAr: "أكدال",
      nameEn: "Agdal",
      nameEs: "Agdal",
      aliases: ["agdal"],
    },
    {
      slug: "saiss",
      citySlug: "fes",
      nameFr: "Saïss",
      nameAr: "سايس",
      nameEn: "Saiss",
      nameEs: "Saïss",
      aliases: ["saiss", "saïss"],
    },
    {
      slug: "ville-nouvelle",
      citySlug: "fes",
      nameFr: "Ville Nouvelle",
      nameAr: "المدينة الجديدة",
      nameEn: "Ville Nouvelle",
      nameEs: "Ville Nouvelle",
      aliases: ["ville nouvelle", "les merinides", "les mérinides"],
    },
    {
      slug: "narjiss",
      citySlug: "fes",
      nameFr: "Narjiss",
      nameAr: "نرجس",
      nameEn: "Narjiss",
      nameEs: "Narjiss",
      aliases: ["narjiss"],
    },
    {
      slug: "medina-jnanat",
      citySlug: "fes",
      nameFr: "Médina - Jnanat",
      nameAr: "المدينة القديمة - جنانات",
      nameEn: "Medina - Jnanat",
      nameEs: "Medina - Jnanat",
      aliases: ["medina jnanat", "fes el bali"],
    },
  ],
  agadir: [
    {
      slug: "talborjt",
      citySlug: "agadir",
      nameFr: "Talborjt",
      nameAr: "تالبرجت",
      nameEn: "Talborjt",
      nameEs: "Talborjt",
      aliases: ["talborjt"],
    },
    {
      slug: "dakhla",
      citySlug: "agadir",
      nameFr: "Cité Dakhla",
      nameAr: "حي الداخلة",
      nameEn: "Cite Dakhla",
      nameEs: "Ciudad Dakhla",
      aliases: ["dakhla", "cité dakhla", "cite dakhla", "al massira-dakhla"],
    },
    {
      slug: "centre-ville",
      citySlug: "agadir",
      nameFr: "Centre-ville",
      nameAr: "وسط المدينة",
      nameEn: "City Center",
      nameEs: "Centro Ciudad",
      aliases: ["centre ville", "centre-ville", "agadir"],
    },
    {
      slug: "hay-mohammadi",
      citySlug: "agadir",
      nameFr: "Hay Mohammadi",
      nameAr: "الحي المحمدي",
      nameEn: "Hay Mohammadi",
      nameEs: "Hay Mohammadi",
      aliases: ["hay mohammadi"],
    },
    {
      slug: "anza",
      citySlug: "agadir",
      nameFr: "Anza",
      nameAr: "أنزا",
      nameEn: "Anza",
      nameEs: "Anza",
      aliases: ["anza"],
    },
    {
      slug: "salam-bensergao",
      citySlug: "agadir",
      nameFr: "Salam - Bensergao",
      nameAr: "السلام - بنسركاو",
      nameEn: "Salam - Bensergao",
      nameEs: "Salam - Bensergao",
      aliases: ["salam houda bensergao", "ben sergao", "bensergao"],
    },
    {
      slug: "adrar-tilila",
      citySlug: "agadir",
      nameFr: "Adrar - Tilila",
      nameAr: "أدرار - تليلا",
      nameEn: "Adrar - Tilila",
      nameEs: "Adrar - Tilila",
      aliases: ["adrar tilila"],
    },
  ],
};

function normalizeString(val: string): string {
  return val
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getZonesForCity(citySlug: string): Zone[] {
  return CANONICAL_ZONES[citySlug] ?? [];
}

export function getZoneBySlug(citySlug: string, zoneSlug: string): Zone | undefined {
  const zones = getZonesForCity(citySlug);
  return zones.find((z) => z.slug === zoneSlug);
}

export function matchesZone(
  pharmacyNeighborhood: string | null | undefined,
  zone: Zone,
): boolean {
  if (!pharmacyNeighborhood) return false;
  const pNorm = normalizeString(pharmacyNeighborhood);
  if (!pNorm) return false;

  return zone.aliases.some((alias) => {
    const aNorm = normalizeString(alias);
    if (!aNorm) return false;
    return pNorm === aNorm || pNorm.includes(aNorm) || aNorm.includes(pNorm);
  });
}

export function getAllZoneStaticParams(): { city: string; zone: string }[] {
  const params: { city: string; zone: string }[] = [];
  for (const [citySlug, zones] of Object.entries(CANONICAL_ZONES)) {
    for (const zone of zones) {
      params.push({ city: citySlug, zone: zone.slug });
    }
  }
  return params;
}
