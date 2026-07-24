import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root — avoids Next.js guessing wrong when unrelated
  // lockfiles exist elsewhere on disk (e.g. in the user's home directory).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
