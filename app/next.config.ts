import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/fr",
        destination: "/",
        permanent: true,
      },
      {
        source: "/fr/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/pharmacie/:city",
        destination: "/pharmacie-de-garde/:city",
        permanent: true,
      },
      {
        source: "/:locale(ar|en|es)/pharmacie/:city",
        destination: "/:locale/pharmacie-de-garde/:city",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
