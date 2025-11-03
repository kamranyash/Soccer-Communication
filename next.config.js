/** @type {import('next').NextConfig} */
const CANONICAL_HOST = 'soccer-communication-o5vf.vercel.app';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(.*)-[a-z0-9]+\\.vercel\\.app',
          },
        ],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;  

