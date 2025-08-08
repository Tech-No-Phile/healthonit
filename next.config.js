// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true, // This will skip ESLint during deployment
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
