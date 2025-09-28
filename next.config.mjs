// /** @type {import('next').NextConfig} */
// const nextConfig = {};


// export default nextConfig;

// export const output = "standalone";
  

const nextConfig = {
    async rewrites() {
      // All other paths will automatically be handled by your Next.js app
      return [
        {
          source: '/wp-admin',
          destination: 'https://102.212.247.83/wp-admin',
        },
        // 2. All files/folders within the WordPress Admin
        {
          source: '/wp-admin/:path*',
          destination: 'https://102.212.247.83/wp-admin/:path*',
        },
        // 3. WordPress login page
        {
          source: '/wp-login.php',
          destination: 'https://102.212.247.83/wp-login.php',
        },
        // 4. Core WordPress files (themes, plugins, uploads, includes)
        {
          source: '/wp-content/:path*',
          destination: 'https://102.212.247.83/wp-content/:path*',
        },
        {
          source: '/wp-includes/:path*',
          destination: 'https://102.212.247.83/wp-includes/:path*',
        },
        // Add other specific WP paths (e.g., for REST API) if needed
        // {
        //   source: '/wp-json/:path*',
        //   destination: 'http://[YOUR_CPANEL_IP]/wp-json/:path*',
        // },
      ];
    },
  };

  export default nextConfig;
  
