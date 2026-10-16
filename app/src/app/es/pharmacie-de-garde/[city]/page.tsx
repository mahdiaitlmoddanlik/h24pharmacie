import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import CityContent from "@/components/CityContent";
import { getCities, getCityBySlug } from "@/lib/data";
import { cityHref } from "@/lib/i18n";
import { cityMetadata } from "@/lib/seo";

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCities()).map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: rawCity } = await params;
  const slug = rawCity?.trim();
  const city = await getCityBySlug(slug);
  if (!city) return {};
  return cityMetadata(city, "es");
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: rawCity } = await params;
  const city = rawCity?.trim();
  if (rawCity && rawCity !== city) {
    permanentRedirect(cityHref("es", city));
  }
  return <CityContent locale="es" citySlug={city} />;
}

