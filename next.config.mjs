/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jim-nielsen.com",
      },
    ],
  },
};
export default nextConfig;
