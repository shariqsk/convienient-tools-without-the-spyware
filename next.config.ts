import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["fluent-ffmpeg", "ffmpeg-static"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
