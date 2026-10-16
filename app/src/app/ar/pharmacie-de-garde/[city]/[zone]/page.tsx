import type { Metadata } from "next";
import ZoneContent from "@/components/ZoneContent";
import { getCityBySlug } from "@/lib/data";
import { getAllZoneStaticParams, getZoneBySlug } from "@/lib/data/neighborhoods";
import { zoneMetadata } from "@/lib/seo";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllZoneStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; zone: string }>;
}): Promise<Metadata> {
  const { city: rawCity, zone: rawZone } = await params;
  const citySlug = rawCity?.trim();
  const zoneSlug = rawZone?.trim();
  const [city, zone] = await Promise.all([
    getCityBySlug(citySlug),
    Promise.resolve(getZoneBySlug(citySlug, zoneSlug)),
  ]);
  if (!city || !zone) return {};
  return zoneMetadata(city, zone, "ar");
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string; zone: string }>;
}) {
  const { city: rawCity, zone: rawZone } = await params;
  const city = rawCity?.trim();
  const zone = rawZone?.trim();
  return <ZoneContent locale="ar" citySlug={city} zoneSlug={zone} />;
}

