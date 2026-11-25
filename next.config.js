/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Stop next dev from generating AGENTS.md
  agentRules: false,
  // Images are served as files - no optimizer
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
      {
        source: "/works/:path*",
        destination: "/projects/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Cached for a year - rename an image when replacing it
        source: "/:all*\\.(png|jpg|jpeg|gif|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
