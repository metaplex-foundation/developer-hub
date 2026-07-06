const withMarkdoc = require('@markdoc/next.js')
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/docs',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md'],
  experimental: {
    scrollRestoration: true,
  },
  async redirects() {
    return [
      // Local and preview deployments do not have the metaplex.com/docs rewrite,
      // so make the bare domain load the docs app at its configured basePath.
      {
        source: '/',
        destination: '/docs',
        basePath: false,
        permanent: false,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Tell webpack to NOT parse example files as modules
    // This prevents webpack from trying to resolve their imports
    config.module.noParse = [
      /src\/examples\/.*\/(kit|umi|shank|anchor)\.(js|rs)$/,
    ]

    // Don't bundle fs/path modules for the client
    // (they're only used in example index.js files at build time)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }

    return config
  },
}

module.exports = withMarkdoc({
  tokenizerOptions: { allowComments: true },
})(nextConfig)
