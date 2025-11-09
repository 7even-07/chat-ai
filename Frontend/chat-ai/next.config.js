// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",  // allows everything under /uploads
      },
      {
        protocol: "https",
        hostname: "**",  // any https domain for production
      },
    ],
  },
};

module.exports = nextConfig;
