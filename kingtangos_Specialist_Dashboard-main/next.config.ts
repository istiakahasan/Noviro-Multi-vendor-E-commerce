// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {


//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
