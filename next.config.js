// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,

//   async rewrites() {
//     return [
//       // Proxy WordPress admin
//       {
//         source: '/wp-admin/:path*',
//         destination: 'https://backend.cocomedia.co.ke/wp-admin/:path*',
//       },
//       {
//         source: '/wp-login.php',
//         destination: 'https://backend.cocomedia.co.ke/wp-login.php',
//       },

//       // Proxy WordPress REST API
//       {
//         source: '/wp-json/:path*',
//         destination: 'https://backend.cocomedia.co.ke/wp-json/:path*',
//       },

//       // Proxy media & uploads
//       {
//         source: '/wp-content/:path*',
//         destination: 'https://backend.cocomedia.co.ke/wp-content/:path*',
//       },
//     ];
//   },

//   async headers() {
//     return [
//       {
//         // Forward cookies + allow CORS on proxied routes
//         source: '/:path*',
//         headers: [
//           { key: 'Access-Control-Allow-Origin', value: 'https://cocomedia.co.ke' },
//           { key: 'Access-Control-Allow-Credentials', value: 'true' },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // REST API requests -> WordPress
      {
        source: "/wp-json/:path*",
        destination: "https://backend.example.com/wp-json/:path*",
      },
      // Media uploads -> WordPress
      {
        source: "/wp-content/uploads/:path*",
        destination: "https://backend.example.com/wp-content/uploads/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        // Forward cookies/sessions for API requests
        source: "/wp-json/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://example.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,POST" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
