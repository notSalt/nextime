const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/nextime-static",
  transpilePackages: ["@workspace/ui"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],    
  },
  output: 'export',
  distDir: 'dist'
}

export default nextConfig
