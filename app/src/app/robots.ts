import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: [
          "Bytespider",
          "AhrefsBot",
          "SemrushBot",
          "DotBot",
          "PetalBot",
          "MJ12bot",
          "MegaIndex",
          "Amazonbot",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
