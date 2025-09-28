// next.config.js
/** @type {import('next').NextConfig} */
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'https://cocomedia.co.ke/';
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://cocomedia.co.ke/';

const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      { source: '/wp-admin/:path*', destination: `${BACKEND_ORIGIN}/wp-admin/:path*` },
      { source: '/wp-login.php', destination: `${BACKEND_ORIGIN}/wp-login.php` },
      { source: '/wp-json/:path*', destination: `${BACKEND_ORIGIN}/wp-json/:path*` },
      { source: '/wp-content/:path*', destination: `${BACKEND_ORIGIN}/wp-content/:path*` },
      { source: '/wp-includes/:path*', destination: `${BACKEND_ORIGIN}/wp-includes/:path*` },
    ];
  },

  async headers() {
    return [
      {
        source: '/(wp-admin|wp-login.php|wp-json|wp-content|wp-includes)(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: SITE_ORIGIN },
          { key: 'Access-Control-Allow-Headers', value: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
