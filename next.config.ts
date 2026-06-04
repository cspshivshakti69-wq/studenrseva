import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isProd && {
    output: "export",
    basePath: "/studenrseva",
    assetPrefix: "/studenrseva/",
    trailingSlash: true,
  }),
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname), // fixes the "multiple lockfiles" warning
  },
};

export default nextConfig;
