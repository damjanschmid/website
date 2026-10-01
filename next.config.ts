import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the bottom corners are taken by the clock and the version
  devIndicators: { position: "top-right" },
  // let phones on the same wifi open the dev server
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
};

export default nextConfig;
