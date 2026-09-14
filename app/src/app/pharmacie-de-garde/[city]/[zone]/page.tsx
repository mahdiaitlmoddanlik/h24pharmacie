import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ZoneContent from "@/components/ZoneContent";
import { getCityBySlug } from "@/lib/data";
import { getAllZoneStaticParams, getZoneBySlug } from "@/lib/data/neighborhoods";
import { zoneMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllZoneStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; zone: string }>;
}): Promise<Metadata> {
  const { city: citySlug, zone: zoneSlug } = await params;
  const [city, zone] = await Promise.all([
    getCityBySlug(citySlug),
    Promise.resolve(getZoneBySlug(citySlug, zoneSlug)),
  ]);
  if (!city || !zone) return {};
  return zoneMetadata(city, zone, "fr");
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string; zone: string }>;
}) {
  const { city, zone } = await params;
  const [cityData, zoneData] = await Promise.all([
    getCityBySlug(city),
    Promise.resolve(getZoneBySlug(city, zone)),
  ]);
  if (!cityData || !zoneData) notFound();
  return <ZoneContent locale="fr" citySlug={city} zoneSlug={zone} />;
}
