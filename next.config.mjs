/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
    // Permite subir imágenes/videos de la galería vía Server Actions.
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
