type NeighborhoodRule = {
  name: string;
  aliases: readonly string[];
};

const NEIGHBORHOODS: Record<string, readonly NeighborhoodRule[]> = {
  casablanca: [
    { name: "Ain Chock", aliases: ["ain chok", "ain chock"] },
    { name: "Ain Sebaa", aliases: ["ain sebaa"] },
    { name: "Anfa", aliases: ["anfa"] },
    { name: "Bourgogne", aliases: ["bourgogne"] },
    { name: "California", aliases: ["california"] },
    { name: "Dar Lamane", aliases: ["dar lamane"] },
    { name: "Hay Hassani", aliases: ["hay hassani"] },
    { name: "Maarif", aliases: ["maarif"] },
    { name: "Nouvelle Medina", aliases: ["nouvelle medina"] },
    { name: "Oulfa", aliases: ["oulfa"] },
    { name: "Sidi Maarouf", aliases: ["sidi maarouf"] },
  ],
  rabat: [
    { name: "Agdal", aliases: ["agdal"] },
    { name: "Akkari", aliases: ["akkari"] },
    { name: "Hassan", aliases: ["hassan"] },
    { name: "Hay Riad", aliases: ["hay riad"] },
    { name: "Massira", aliases: ["massira"] },
    { name: "Ocean", aliases: ["ocean"] },
    { name: "Sale", aliases: ["sale", "sala"] },
    { name: "Temara", aliases: ["temara"] },
    { name: "Yacoub El Mansour", aliases: ["yacoub el mansour"] },
  ],
  marrakech: [
    { name: "Ain Itti", aliases: ["ain itti"] },
    { name: "Azzouzia", aliases: ["azzouzia"] },
    { name: "Azli", aliases: ["azli"] },
    { name: "Daoudiate", aliases: ["daoudiate"] },
    { name: "Gueliz", aliases: ["gueliz"] },
    { name: "Hay Mohammadi", aliases: ["hay mohamadi", "hay mohammadi"] },
    { name: "Iziki", aliases: ["iziki"] },
    {
      name: "Medina",
      aliases: ["jemaa el fna", "bab doukkala", "bab lakhmis", "bab taghzout", "hay lakssour"],
    },
    { name: "Mhamid", aliases: ["mhamid"] },
    { name: "Nakhil Sud", aliases: ["nakhil sud"] },
    { name: "Sidi Ghanem", aliases: ["sidi ghanem"] },
    { name: "Targa", aliases: ["targa"] },
  ],
  tanger: [
    { name: "Aouama", aliases: ["aouama"] },
    { name: "Branes", aliases: ["branes"] },
    { name: "Drissia", aliases: ["drissia"] },
    { name: "Hay Bouhout", aliases: ["hay bouhout"] },
    { name: "Iberia", aliases: ["iberia"] },
    { name: "Malabata", aliases: ["malabata"] },
    { name: "Moujahidine", aliases: ["moujahidine"] },
  ],
  fes: [
    { name: "Agdal", aliases: ["agdal"] },
    { name: "Ben Souda", aliases: ["ben souda"] },
    { name: "Fes el Bali", aliases: ["fes el bali"] },
    { name: "Narjiss", aliases: ["narjiss"] },
    { name: "Saiss", aliases: ["saiss"] },
    { name: "Ville Nouvelle", aliases: ["ville nouvelle"] },
    { name: "Zohour", aliases: ["zohour"] },
  ],
  agadir: [
    { name: "Al Houda", aliases: ["al houda"] },
    { name: "Anza", aliases: ["anza"] },
    { name: "Bensergao", aliases: ["ben sergao"] },
    { name: "Bouargane", aliases: ["bouargane"] },
    { name: "Dakhla", aliases: ["dakhla"] },
    { name: "Founty", aliases: ["founty"] },
    { name: "Hay Mohammadi", aliases: ["hay mohammadi"] },
    { name: "Talborjt", aliases: ["talborjt"] },
    { name: "Tikiouine", aliases: ["tikiouine"] },
  ],
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Returns an area only when a known, city-specific address alias is present.
 * Unknown addresses deliberately stay unclassified instead of guessing.
 */
export function inferNeighborhood(
  citySlug: string,
  address: string | null | undefined,
): string | undefined {
  if (!address) return undefined;

  const normalizedAddress = ` ${normalize(address)} `;
  for (const rule of NEIGHBORHOODS[citySlug] ?? []) {
    if (
      rule.aliases.some((alias) =>
        normalizedAddress.includes(` ${normalize(alias)} `),
      )
    ) {
      return rule.name;
    }
  }

  return undefined;
}
