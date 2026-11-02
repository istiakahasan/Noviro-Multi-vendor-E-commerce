// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "**",
//       },
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//       {
//         protocol: "https",
//         hostname: "localhost",
//       },
//     ],
//   },

//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   reactStrictMode: true,

//   // Configuration to handle browser APIs properly
//   compiler: {
//     styledComponents: true,
//   },
// };

// export default nextConfig;



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "example.com",
//       },
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3000",
//       },
//     ],
//   },

//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   reactStrictMode: true,

//   compiler: {
//     styledComponents: true,
//   },
// };

// export default nextConfig;



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         pathname: "/**", // Allow all paths on Cloudinary
//       },
//       {
//         protocol: "https",
//         hostname: "ainoviro.s3.eu-north-1.amazonaws.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3000",
//         pathname: "/**",
//       },
//     ],
//     // Optional: Add domains as fallback (deprecated but still works)
//     domains: [
//       'res.cloudinary.com',
//       'ainoviro.s3.eu-north-1.amazonaws.com',
//       'localhost'
//     ],
//   },

//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   reactStrictMode: true,

//   compiler: {
//     styledComponents: true,
//   },
// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ainoviro.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
    ],
    domains: [
      'res.cloudinary.com',
      'ainoviro.s3.eu-north-1.amazonaws.com',
      'example.com',
      'localhost'
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: true,

  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;