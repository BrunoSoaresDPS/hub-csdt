const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Disable static optimization for dashboard pages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

export default nextConfig;
