import pwa from "next-pwa";

const NODE_ENV = process.env.NODE_ENV;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: NODE_ENV !== "development",
  },
};

const withPWA = pwa({
  dest: "public",
  disable: NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
