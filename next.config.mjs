/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
 
  transpilePackages: ['undici', 'firebase', '@firebase/auth'],
  webpack: (config) => {
    config.resolve.alias.undici = false; 
    return config;
  },
};

export default nextConfig;
