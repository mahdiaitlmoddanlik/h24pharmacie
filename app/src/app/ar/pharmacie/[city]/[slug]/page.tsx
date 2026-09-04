import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PharmacyContent from "@/components/PharmacyContent";
import {
  getCityBySlug,
  getPharmacyBySlug,
  getPharmacyStaticParams,
} from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import { pharmacyHref } from "@/lib/i18n";

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
  const title = `${pharmacy.name} — صيدلية حراسة ${city.nameAr}`;
  const description = `${pharmacy.name}، ${pharmacy.addressAr ?? pharmacy.address}. الهاتف والاتجاهات عبر خرائط Google وWaze. صيدلية حراسة في ${city.nameAr}.`;
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(pharmacyHref("ar", citySlug, slug)) },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;
  if (!(await getPharmacyBySlug(city, slug))) notFound();
  return <PharmacyContent locale="ar" citySlug={city} pharmacySlug={slug} />;
}
