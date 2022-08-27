/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config, options) => {
    config.experiments.topLevelAwait = true

    return config
  },
}

module.exports = nextConfig
