import pwa from "next-pwa";

const NODE_ENV = process.env.NODE_ENV;
const DOMAIN =
  NODE_ENV === "development"
    ? process.env.DEVELOPMENT_DOMAIN
    : process.env.PRODUCTION_DOMAIN;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: NODE_ENV !== "development",
  },
  env: {
    DOMAIN,
  },
};

const withPWA = pwa({
  dest: "public",
  disable: NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
