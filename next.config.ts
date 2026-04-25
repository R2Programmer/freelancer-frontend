import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Produces .next/standalone — required for the production Docker image.
  // Has no effect on `next dev`.
  output: 'standalone',
};

export default nextConfig;
