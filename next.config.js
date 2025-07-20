// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api-proxy/:path*",
//         destination: "http://rashroff3decommerce.somee.com/api/:path*", // Proxy to backend
//       },
//     ];
//   },

//   output: "export",
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     unoptimized: true,
//     domains: [
//       "res.cloudinary.com",
//       "images.pexels.com",
//       "firebasestorage.googleapis.com",
//     ],
//   },
//   experimental: {
//     turbo: {
//       rules: {
//         "*.svg": {
//           loaders: ["@svgr/webpack"],
//           as: "*.js",
//         },
//       },
//     },
//   },
// };

// // module.exports = nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api-proxy/:path*",
//         destination: "http://rashroff3decommerce.somee.com/api/:path*",
//       },
//     ];
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     unoptimized: true,
//     domains: [
//       "res.cloudinary.com",
//       "images.pexels.com",
//       "firebasestorage.googleapis.com",
//     ],
//   },
//   turbopack: {
//     enabled: true,
//   },
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ["@svgr/webpack"],
//     });
//     return config;
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "https://rashroff3decommerce.somee.com/api/:path*", // ✅ Use HTTPS
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "res.cloudinary.com",
      "images.pexels.com",
      "firebasestorage.googleapis.com",
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;
