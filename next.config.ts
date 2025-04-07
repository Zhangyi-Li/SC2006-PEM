/** @format */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
// });

const withPWAInit = require("next-pwa");

const isDev = process.env.NODE_ENV !== "production";

const withPWA = withPWAInit({
  // your other config
  exclude: [
    // add buildExcludes here
    ({ asset, compilation }: { asset: { name: string }; compilation: any }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(
          /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
        )
      ) {
        return true;
      }
      if (isDev && !asset.name.startsWith("static/runtime/")) {
        return true;
      }
      return false;
    },
  ],
});

export default withPWA(nextConfig);
