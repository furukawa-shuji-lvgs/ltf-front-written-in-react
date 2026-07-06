/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lt-prd-ownd-images.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "contents.levtech.jp",
      },
      {
        protocol: "https",
        hostname: "freelance.stg.levtech.org",
      },
      {
        protocol: "https",
        hostname: "freelance.levtech.jp",
      },
    ],
  },
  serverExternalPackages: ["@grpc/grpc-js"],
  sassOptions: {
    additionalData: `
        @use "@shared/styles/volt-tokens.scss" as *;
        @use "@shared/styles/variables.scss" as *;
        @use "sass:math";
        @use "sass:color";
        `,
    includePaths: ["src"],
  },
};

export default nextConfig;
