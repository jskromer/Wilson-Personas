/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
  // Configure Next.js to use port 5000
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Allow Replit dev URL
  allowedDevOrigins: [
    '461a9e52-201d-4290-a704-49f34f0a1413-00-2xu08235d2adw.riker.replit.dev'
  ],
}

export default nextConfig