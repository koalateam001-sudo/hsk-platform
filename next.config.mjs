/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-pdf", "pdfjs-dist"],
  turbopack: {
    resolveAlias: {
      canvas: "./canvas-stub.js",
    },
  },
};

export default nextConfig;
