import type { NextConfig } from "next";

// The site is a GitHub Pages project site, so every URL lives under /<repo>.
// Set NEXT_PUBLIC_BASE_PATH="" to build for a custom domain at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/catburglarx";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    // GitHub Pages has no image optimiser. scripts/process-assets.mjs writes
    // WebP files at exactly these widths and the loader maps to them.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 960, 1280],
    imageSizes: [64, 128, 256],
  },
};

export default nextConfig;
