import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Permitir qualquer domínio HTTPS
      {
        protocol: "https",
        hostname: "**",
      },
      // Backend local
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
    formats: ["image/avif", "image/webp"],
  },
  // Configuração adicional para resolver problemas de CORS
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
