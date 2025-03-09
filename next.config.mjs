/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mysten/sui.js"],
  webpack: (config) => {
    // This is needed for the Sui SDK to work properly in Next.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify',
      url: 'url',
      zlib: 'browserify-zlib',
    };
    return config;
  },
};

export default nextConfig;

