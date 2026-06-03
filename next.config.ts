import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Only apply static export settings during production build (for GitHub Pages)
  ...(isProd && {
    output: "export",
    basePath: "/studenrseva",
    assetPrefix: "/studenrseva/",
    trailingSlash: true,
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
