import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // generates a static /out folder
  basePath: "/studenrseva",  // must match your GitHub repo name exactly
  assetPrefix: "/studenrseva/",
  images: {
    unoptimized: true,       // required for static export
  },
  trailingSlash: true,       // GitHub Pages needs this for clean URLs
};

export default nextConfig;
