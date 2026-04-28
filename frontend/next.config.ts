import type { NextConfig } from "next"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: { root },
}

export default nextConfig
