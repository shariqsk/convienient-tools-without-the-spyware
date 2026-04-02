import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["ytdl-core", "fluent-ffmpeg", "ffmpeg-static"],
};

export default nextConfig;
