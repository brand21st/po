/** @type {import('next').NextConfig} */
const nextConfig = {
  // The shared package ships TypeScript source; let Next compile it.
  transpilePackages: ['@flower/shared'],
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
