import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [new URL('https://ik.imagekit.io')],
  },
    typescript:{
    ignoreBuildErrors:true
  },
};

export default nextConfig;
