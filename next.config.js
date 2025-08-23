/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Year-long caching for images since they're versioned by filename
        source: "/:all*(png|jpg|jpeg|gif|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
