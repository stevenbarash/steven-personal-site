/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_TEST_DIST_DIR || '.next',
  typescript: {
    tsconfigPath: process.env.NEXT_TEST_DIST_DIR
      ? 'tsconfig.playwright.json'
      : 'tsconfig.json',
  },
  // API-based integrations still require the compatibility compiler.
  experimental: {
    useTypeScriptCli: false,
  },

  // Enable image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Enable compression
  compress: true,
  
  // Add headers for better caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
  
};

export default nextConfig;
