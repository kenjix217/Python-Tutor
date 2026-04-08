import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    port: 4000,
  },
  // Handle Pyodide which uses Node.js built-in modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle pyodide on server-side, load dynamically on client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        child_process: false,
        stream: false,
        util: false,
        os: false,
        url: false,
        http: false,
        https: false,
        net: false,
        tls: false,
        zlib: false,
        assert: false,
        constants: false,
        module: false,
        process: false,
        timers: false,
        events: false,
        buffer: false,
        string_decoder: false,
        querystring: false,
        punycode: false,
        dgram: false,
        dns: false,
      };
    }
    return config;
  },
  // Transpile pyodide package
  transpilePackages: ["pyodide"],
};

export default nextConfig;
