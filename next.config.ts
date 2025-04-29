import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configurações para o Styled Components
  compiler: {
    styledComponents: true,
  },
  // Configurações para imagens externas
  images: {
    domains: ['via.placeholder.com', 'placekitten.com'],
  },
};

export default nextConfig;
