// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//    images: {
//     remotePatterns: [
//       {
//         hostname: "i.ibb.co.com",
//         protocol: "https",
//         pathname: "**",
//       },
//       {
//         hostname: "i.ibb.co",
//         protocol: "https",
//         pathname: "**",
//       },
//       {
//         hostname: "res.cloudinary.com",
//         protocol: "https",
//         pathname: "**",
//       },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "i.ibb.co.com",
        protocol: "https",
        pathname: "**",
      },
      {
        hostname: "i.ibb.co",
        protocol: "https",
        pathname: "**",
      },
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
        pathname: "**",
      },
      {
        hostname: "ainoviro.s3.eu-north-1.amazonaws.com",
        protocol: "https",
        pathname: "**",
      },
    ],
  },
  turbopack: {},
};

export default nextConfig;