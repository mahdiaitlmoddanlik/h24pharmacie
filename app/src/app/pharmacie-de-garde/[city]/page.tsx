import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityContent from "@/components/CityContent";
import { getCities, getCityBySlug } from "@/lib/data";
import { cityMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCities()).map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) return {};
  return cityMetadata(city, "fr");
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  if (!(await getCityBySlug(city))) notFound();
  return <CityContent locale="fr" citySlug={city} />;
}
