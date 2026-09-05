import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Cairo } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import type { Locale } from "@/lib/types";
import { dir } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Pharmacie de garde au Maroc (24h/24, Nuit & Jour)`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Trouvez rapidement la pharmacie de garde ouverte près de vous au Maroc aujourd'hui (24h/24, nuit & jour) : adresses, téléphones directs et itinéraires Google Maps / Waze.",
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/icons/icon-180.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "fr_MA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Pharmacies de garde au Maroc`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#02604f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const locale: Locale = pathname.startsWith("/ar") ? "ar" : "fr";

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${geistSans.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-foreground">
        {children}
      </body>
    </html>
  );
}
