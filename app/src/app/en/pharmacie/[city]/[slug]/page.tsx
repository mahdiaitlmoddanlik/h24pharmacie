import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PharmacyContent from "@/components/PharmacyContent";
import {
  getCityBySlug,
  getPharmacyBySlug,
  getPharmacyStaticParams,
} from "@/lib/data";
import { pharmacyMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPharmacyStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { city: citySlug, slug } = await params;
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
  const { city, slug } = await params;
  if (!(await getPharmacyBySlug(city, slug))) notFound();
  return <PharmacyContent locale="en" citySlug={city} pharmacySlug={slug} />;
}
