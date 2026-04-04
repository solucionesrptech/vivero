import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

function buildSecurityHeaders() {
  return process.env.NODE_ENV === "production"
    ? [
        ...SECURITY_HEADERS,
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : SECURITY_HEADERS;
}

/**
 * Monorepo: `npm run build` puede ejecutarse con cwd en la raíz del repo o en `labplantalia`.
 * Turbopack necesita la raíz explícita del app para no confundirse con otro `package-lock.json`.
 */
function resolveLabplantaliaRoot(): string {
  const cwd = process.cwd();
  const pkgAtCwd = path.join(cwd, "package.json");
  if (existsSync(pkgAtCwd)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgAtCwd, "utf8")) as {
        name?: string;
      };
      if (pkg.name === "labplantalia") {
        return cwd;
      }
    } catch {
      /* ignore */
    }
  }
  const nested = path.join(cwd, "labplantalia");
  if (existsSync(path.join(nested, "package.json"))) {
    return nested;
  }
  return cwd;
}

const nextConfig: NextConfig = {
  turbopack: {
    root: resolveLabplantaliaRoot(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: buildSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
