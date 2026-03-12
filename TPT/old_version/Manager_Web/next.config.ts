import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 빌드 시 ESLint 오류를 무시 (프로덕션 빌드용)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
