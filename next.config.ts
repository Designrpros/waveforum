import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase the body size limit for API routes
  api: {
    bodyParser: {
      sizeLimit: '25mb', // Set a new limit (e.g., 25MB)
    },
  },
};

export default nextConfig;
