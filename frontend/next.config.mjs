const nextConfig = {
  assetPrefix: "/nextime-static",
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],    
  },
  distDir: 'dist',
}

export default nextConfig
