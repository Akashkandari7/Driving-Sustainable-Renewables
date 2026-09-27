import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // the whole site is pre-rendered to files, so it can be served by any static host
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // GitHub Pages serves a project site from /<repo>; set BASE_PATH in the workflow to match
  basePath: process.env.BASE_PATH || "",
  assetPrefix: process.env.BASE_PATH || undefined,
};

export default nextConfig;
