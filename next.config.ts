import { execSync } from "node:child_process";
import type { NextConfig } from "next";

function git(args: string) {
  try {
    return execSync(`git ${args}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  // the bottom corners are taken by the clock and the version
  devIndicators: { position: "top-right" },
  // let phones on the same wifi open the dev server
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
  // what the bottom-right corner points at. Vercel hands these over, locally we ask git
  env: {
    BUILD_COMMIT_MESSAGE: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? git("log -1 --format=%B"),
    BUILD_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? git("rev-parse HEAD"),
    BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
