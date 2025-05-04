/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "friendly-snail-78.convex.cloud",
      },
    ],
  },
}

export default nextConfig
