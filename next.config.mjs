/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan source map di browser untuk library (mencegah error .map 404)
  productionBrowserSourceMaps: false,
  
  // Opsi tambahan untuk kebersihan log
  reactStrictMode: true,
  
  // Konfigurasi agar framer-motion lebih stabil
  transpilePackages: ['framer-motion'],
};

export default nextConfig;
