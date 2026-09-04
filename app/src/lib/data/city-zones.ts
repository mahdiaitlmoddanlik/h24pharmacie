import type { SourceZone } from "@/lib/types";

export const cityZones: Record<string, SourceZone[]> = {
  casablanca: [
    { slug: "autre", name: "Autre" },
    { slug: "ain-chock", name: "Ain Chock" },
    { slug: "ain-sebaa", name: "Ain Sebaa" },
    { slug: "al-azhar-panorama", name: "Al Azhar Panorama" },
    { slug: "anassi", name: "Anassi" },
    { slug: "belvedere-roches-noires", name: "Belvedere - Roches Noires" },
    { slug: "el-fida-mers-sultan", name: "El Fida - Mers Sultan" },
    { slug: "hay-hassani-el-oulfa", name: "hay Hassani - El Oulfa" },
    { slug: "hay-mohammadi", name: "hay Mohammadi" },
    { slug: "lissasfa", name: "Lissasfa" },
    { slug: "sidi-bernoussi", name: "Sidi Bernoussi" },
    { slug: "sidi-maarouf", name: "Sidi Maarouf" },
    { slug: "sidi-moumen", name: "Sidi Moumen" },
    { slug: "ville-bourgogne-maarif", name: "Ville Bourgogne Maarif" },
  ],
  rabat: [
    { slug: "autre", name: "Autre" },
    { slug: "agdal", name: "Agdal" },
    { slug: "centre-ville", name: "Centre ville" },
    { slug: "hay-riyad", name: "hay Riyad" },
  ],
  marrakech: [
    { slug: "autre", name: "Autre" },
    { slug: "ain-itti", name: "Ain Itti" },
    { slug: "daoudiat", name: "Daoudiat" },
    { slug: "grand-gueliz", name: "Grand Gueliz" },
    { slug: "hay-al-izdihar", name: "hay Al Izdihar" },
    { slug: "hay-charaf", name: "hay Charaf" },
    { slug: "hay-hassani", name: "hay Hassani" },
    { slug: "lamhamid", name: "Lamhamid" },
    { slug: "medina", name: "Medina" },
    { slug: "sidi-ghanem-azzouzia", name: "Sidi Ghanem Azzouzia" },
    { slug: "sidi-youssef", name: "Sidi Youssef" },
    { slug: "targa", name: "Targa" },
  ],
  tanger: [
    { slug: "autre", name: "Autre" },
    { slug: "tanger", name: "Tanger" },
  ],
  fes: [
    { slug: "agdal", name: "Agdal" },
    { slug: "ain-chkef", name: "Ain Chkef" },
    { slug: "les-merinides", name: "Les Merinides" },
    { slug: "medina-jnanat", name: "Medina Jnanat" },
    { slug: "saiss", name: "Saiss" },
    { slug: "zouagha", name: "Zouagha" },
  ],
  agadir: [
    { slug: "adrar-tilila", name: "Adrar Tilila" },
    { slug: "agadir", name: "Agadir" },
    { slug: "al-massira-extension-dakhla", name: "Al Massira Extension Dakhla" },
    { slug: "anza", name: "Anza" },
    { slug: "cite-dakhla", name: "cité Dakhla" },
    { slug: "hay-mohammadi", name: "hay Mohammadi" },
    { slug: "lakhyam-erac-bouargane", name: "Lakhyam Erac Bouargane" },
    { slug: "salam-houda-bensergao", name: "Salam Houda Bensergao" },
    { slug: "taddart", name: "Taddart" },
  ],
};

export function getCityZones(citySlug: string): SourceZone[] {
  return cityZones[citySlug] ?? [];
}
