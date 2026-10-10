/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./lib/img.ts",
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [256, 384],
  },
};
export default nextConfig;
