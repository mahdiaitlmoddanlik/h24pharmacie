import type { Metadata } from "next";
import PharmacyContent from "@/components/PharmacyContent";
import {
  getCityBySlug,
  getPharmacyBySlug,
  getPharmacyStaticParams,
} from "@/lib/data";
import { pharmacyMetadata } from "@/lib/seo";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getPharmacyStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { city: rawCity, slug: rawSlug } = await params;
  const citySlug = rawCity?.trim();
  const slug = rawSlug?.trim();
  const [city, pharmacy] = await Promise.all([
    getCityBySlug(citySlug),
    getPharmacyBySlug(citySlug, slug),
  ]);
  if (!city || !pharmacy) return {};
  return pharmacyMetadata(pharmacy, city, "en");
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city: rawCity, slug: rawSlug } = await params;
  const city = rawCity?.trim();
  const slug = rawSlug?.trim();
  return <PharmacyContent locale="en" citySlug={city} pharmacySlug={slug} />;
}

