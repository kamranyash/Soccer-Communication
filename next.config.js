/** @type {import('next').NextConfig} */
const CANONICAL_HOST = 'soccer-communication.vercel.app'; // TODO: replace with your custom domain if set

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

