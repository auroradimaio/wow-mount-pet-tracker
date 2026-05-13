import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "render.worldofwarcraft.com" },
      { protocol: "https", hostname: "blzmedia-a.akamaihd.net" },
      { protocol: "https", hostname: "eu.api.blizzard.com" },
    ],
  },
};

export default nextConfig;
