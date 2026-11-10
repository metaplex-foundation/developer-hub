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
    // Add each docs page's last-modified date to its frontmatter before
    // Markdoc parses it (see scripts/generate-last-modified.mjs).
    config.module.rules.push({
      test: /\.md$/,
      include: path.join(__dirname, 'src', 'pages'),
      enforce: 'pre',
      use: [path.join(__dirname, 'scripts', 'last-modified-loader.cjs')],
    })

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
