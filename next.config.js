/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      // Proxy WordPress admin
      {
        source: '/wp-admin/:path*',
        destination: 'https://backend.cocomedia.co.ke/wp-admin/:path*',
      },
      {
        source: '/wp-login.php',
        destination: 'https://backend.cocomedia.co.ke/wp-login.php',
      },

      // Proxy WordPress REST API
      {
        source: '/wp-json/:path*',
        destination: 'https://backend.cocomedia.co.ke/wp-json/:path*',
      },

      // Proxy media & uploads
      {
        source: '/wp-content/:path*',
        destination: 'https://backend.cocomedia.co.ke/wp-content/:path*',
      },
    ];
  },

  async headers() {
    return [
      {
        // Forward cookies + allow CORS on proxied routes
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://cocomedia.co.ke' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};

export default nextConfig;

