/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  output: "standalone",
};

export default nextConfig;
