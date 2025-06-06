import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "render.worldofwarcraft.com",
      "blzmedia-a.akamaihd.net",
      "eu.api.blizzard.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eu.api.blizzard.com",
        pathname: "/data/wow/media/**",
      },
    ],
  },
};

export default nextConfig;
