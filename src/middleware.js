import { NextResponse } from 'next/server';

const redirectRules = {
  '/umi': {
    '/web3js-adapters': '/umi/web3js-differences-and-adapters',
    '/web3js-differences': '/umi/web3js-differences-and-adapters',
    '/connecting-to-umi': '/umi/getting-started',
  },
  '/toolbox': {
    '/': '/umi/toolbox',
    '/getting-started': '/umi/toolbox',
  },
  '/guides': {
    '/javascript/how-to-create-an-spl-token-on-solana':
      '/guides/javascript/how-to-create-a-solana-token',
  },
  '/bubblegum': {
    '/getting-started': '/bubblegum/sdk',
    '/getting-started/js': '/bubblegum/sdk/javascript',
    '/getting-started/rust': '/bubblegum/sdk/rust',
    '/fetch-cnfts': '/bubblegum-v2/fetch-cnfts',
    '/concurrent-merkle-trees': '/bubblegum-v2/concurrent-merkle-trees',
    '/stored-nft-data': '/bubblegum-v2/stored-nft-data',
    '/hashed-nft-data': '/bubblegum-v2/hashed-nft-data',
    '/merkle-tree-canopy': '/bubblegum-v2/merkle-tree-canopy',
    '/faq': '/bubblegum-v2/faq',
  },
  '/core': {
    '/getting-started': '/core/sdk',
    'guides/javascript/how-to-create-a-core-nft-asset':
      '/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript',
  },
  '/core-candy-machine': {
    '/getting-started': '/core-candy-machine/sdk',
    '/getting-started/js': '/core-candy-machine/sdk/javascript',
    '/getting-started/rust': '/core-candy-machine/sdk/rust',
  },
  '/mpl-hybrid': {
    'guides/mpl-404-hyrbid-ui-template':
      '/mpl-hybrid/guides/mpl-404-hybrid-ui-template',
  },
  '/aura': {
    '/api/v1/das/get-asset': '/das-api/methods/get-asset',
    '/api/v1/das/get-asset-batch': '/das-api/methods/get-assets',
    '/api/v1/das/get-asset-proof': '/das-api/methods/get-asset-proof',
    '/api/v1/das/get-asset-proof-batch': '/das-api/methods/get-asset-proofs',
    '/api/v1/das/get-assets-by-owner': '/das-api/methods/get-assets-by-owner',
    '/api/v1/das/get-assets-by-authority': '/das-api/methods/get-assets-by-authority',
    '/api/v1/das/get-assets-by-creator': '/das-api/methods/get-assets-by-creator',
    '/api/v1/das/get-assets-by-group': '/das-api/methods/get-assets-by-group',
    '/api/v1/das/get-signatures-for-asset': '/das-api/methods/get-asset-signatures',
    '/api/v1/das/search-assets': '/das-api/methods/search-assets',
  },
  '/legacy-documentation': {
    '/developer-tools/shank': '/shank',
  },
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  for (const [rootPath, rule] of Object.entries(redirectRules)) {
    if (pathname.startsWith(rootPath)) {
      if (typeof rule === 'string') {
        // Direct redirect
        return NextResponse.redirect(new URL(rule, request.url), 308)
      } else if (typeof rule === 'object') {
        // Nested redirects
        const subPath = pathname.slice(rootPath.length) || '/'
        const destination = rule[subPath]
        if (destination) {
          return NextResponse.redirect(new URL(destination, request.url), 308)
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/umi/:path*',
    '/toolbox/:path*',
    '/core/:path*',
    '/mpl-hybrid/:path*',
    '/guides/javascript/how-to-create-an-spl-token-on-solana',
    '/core-candy-machine/:path*',
    '/bubblegum/:path*',
    '/aura/:path*',
    '/legacy-documentation/:path*',
  ],
}
