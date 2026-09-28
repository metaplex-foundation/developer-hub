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
      {
        source: '/',
        destination: '/docs',
        basePath: false,
        permanent: false,
      },
      {
        // MPL-3643 docs exist in English only; send localized nav links to
        // the English pages instead of a 404. Remove when translations land.
        source: '/:locale(ja|ko|zh)/smart-contracts/mpl-3643/:path*',
        destination: '/smart-contracts/mpl-3643/:path*',
        permanent: false,
      },
      {
        source: '/:path((?!docs(?:/|$)|_next/|api/|.*\\..*).*)',
        destination: '/docs/:path',
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
