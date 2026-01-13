import { NextResponse } from 'next/server';

// Smart contracts path migration redirects
// Redirect old paths to new /smart-contracts/ structure
const smartContractRedirects = [
  'core',
  'token-metadata',
  'candy-machine',
  'core-candy-machine',
  'bubblegum-v2',
  'bubblegum',
  'mpl-hybrid',
  'token-auth-rules',
  'fusion',
  'hydra',
  'inscription',
];

// Dev tools path migration redirects
// Redirect old paths to new /dev-tools/ structure
const devToolsRedirects = [
  'umi',
  'cli',
  'amman',
  'shank',
  'das-api',
];

// Standalone page redirects to new locations
const standaloneRedirects = {
  // Legacy page redirects
  '/community-guides': '/guides',
  '/contact': '/',
  '/developer-tools': '/dev-tools',
  '/programs-and-tools': '/smart-contracts',
  // Genesis priced-sale renamed to presale
  '/smart-contracts/genesis/priced-sale': '/smart-contracts/genesis/presale',
  '/ja/smart-contracts/genesis/priced-sale': '/ja/smart-contracts/genesis/presale',
  '/ko/smart-contracts/genesis/priced-sale': '/ko/smart-contracts/genesis/presale',
  '/zh/smart-contracts/genesis/priced-sale': '/zh/smart-contracts/genesis/presale',
}

const redirectRules = {
  // Legacy UMI redirects - these specific sub-paths redirect to new destinations
  '/umi': {
    '/web3js-adapters': '/dev-tools/umi/web3js-differences-and-adapters',
    '/web3js-differences': '/dev-tools/umi/web3js-differences-and-adapters',
    '/connecting-to-umi': '/dev-tools/umi/getting-started',
  },
  '/toolbox': {
    '/': '/dev-tools/umi/toolbox',
    '/getting-started': '/dev-tools/umi/toolbox',
  },
  // New dev-tools UMI redirects
  '/dev-tools/umi': {
    '/web3js-adapters': '/dev-tools/umi/web3js-differences-and-adapters',
    '/web3js-differences': '/dev-tools/umi/web3js-differences-and-adapters',
    '/connecting-to-umi': '/dev-tools/umi/getting-started',
  },
  '/guides': {
    '/javascript/how-to-create-an-spl-token-on-solana':
      '/guides/javascript/how-to-create-a-solana-token',
  },
  // Japanese guide redirects
  '/ja/guides': {
    '/javascript/how-to-create-an-spl-token-on-solana':
      '/ja/guides/javascript/how-to-create-a-solana-token',
  },
  // Korean guide redirects
  '/ko/guides': {
    '/javascript/how-to-create-an-spl-token-on-solana':
      '/ko/guides/javascript/how-to-create-a-solana-token',
  },
  // Japanese smart-contracts redirects
  '/ja/smart-contracts/bubblegum': {
    '/getting-started': '/ja/smart-contracts/bubblegum/sdk',
    '/getting-started/js': '/ja/smart-contracts/bubblegum/sdk/javascript',
    '/getting-started/rust': '/ja/smart-contracts/bubblegum/sdk/rust',
  },
  '/ja/smart-contracts/core': {
    '/getting-started': '/ja/smart-contracts/core/sdk',
  },
  '/ja/smart-contracts/core-candy-machine': {
    '/getting-started': '/ja/smart-contracts/core-candy-machine/sdk',
    '/getting-started/js': '/ja/smart-contracts/core-candy-machine/sdk/javascript',
    '/getting-started/rust': '/ja/smart-contracts/core-candy-machine/sdk/rust',
  },
  // Korean smart-contracts redirects
  '/ko/smart-contracts/bubblegum': {
    '/getting-started': '/ko/smart-contracts/bubblegum/sdk',
    '/getting-started/js': '/ko/smart-contracts/bubblegum/sdk/javascript',
    '/getting-started/rust': '/ko/smart-contracts/bubblegum/sdk/rust',
  },
  '/ko/smart-contracts/core': {
    '/getting-started': '/ko/smart-contracts/core/sdk',
  },
  '/ko/smart-contracts/core-candy-machine': {
    '/getting-started': '/ko/smart-contracts/core-candy-machine/sdk',
    '/getting-started/js': '/ko/smart-contracts/core-candy-machine/sdk/javascript',
    '/getting-started/rust': '/ko/smart-contracts/core-candy-machine/sdk/rust',
  },
  // Chinese guide redirects
  '/zh/guides': {
    '/javascript/how-to-create-an-spl-token-on-solana':
      '/zh/guides/javascript/how-to-create-a-solana-token',
  },
  // Chinese smart-contracts redirects
  '/zh/smart-contracts/bubblegum': {
    '/getting-started': '/zh/smart-contracts/bubblegum/sdk',
    '/getting-started/js': '/zh/smart-contracts/bubblegum/sdk/javascript',
    '/getting-started/rust': '/zh/smart-contracts/bubblegum/sdk/rust',
  },
  '/zh/smart-contracts/core': {
    '/getting-started': '/zh/smart-contracts/core/sdk',
  },
  '/zh/smart-contracts/core-candy-machine': {
    '/getting-started': '/zh/smart-contracts/core-candy-machine/sdk',
    '/getting-started/js': '/zh/smart-contracts/core-candy-machine/sdk/javascript',
    '/getting-started/rust': '/zh/smart-contracts/core-candy-machine/sdk/rust',
  },
  '/zh/legacy-documentation': {
    '/developer-tools/shank': '/zh/dev-tools/shank',
  },
  // Legacy redirects - old paths (a) redirect to old destinations (b)
  // The smart contract redirects will then redirect (b) to new paths (c)
  '/bubblegum': {
    '/getting-started': '/smart-contracts/bubblegum/sdk',
    '/getting-started/js': '/smart-contracts/bubblegum/sdk/javascript',
    '/getting-started/rust': '/smart-contracts/bubblegum/sdk/rust',
    '/fetch-cnfts': '/smart-contracts/bubblegum-v2/fetch-cnfts',
    '/concurrent-merkle-trees': '/smart-contracts/bubblegum-v2/concurrent-merkle-trees',
    '/stored-nft-data': '/smart-contracts/bubblegum-v2/stored-nft-data',
    '/hashed-nft-data': '/smart-contracts/bubblegum-v2/hashed-nft-data',
    '/merkle-tree-canopy': '/smart-contracts/bubblegum-v2/merkle-tree-canopy',
    '/faq': '/smart-contracts/bubblegum-v2/faq',
  },
  '/core': {
    '/getting-started': '/smart-contracts/core/sdk',
    'guides/javascript/how-to-create-a-core-nft-asset':
      '/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript',
  },
  '/core-candy-machine': {
    '/getting-started': '/smart-contracts/core-candy-machine/sdk',
    '/getting-started/js': '/smart-contracts/core-candy-machine/sdk/javascript',
    '/getting-started/rust': '/smart-contracts/core-candy-machine/sdk/rust',
  },
  '/mpl-hybrid': {
    'guides/mpl-404-hyrbid-ui-template':
      '/smart-contracts/mpl-hybrid/guides/mpl-404-hybrid-ui-template',
  },
  // New path redirects for specific sub-paths
  '/smart-contracts/bubblegum': {
    '/getting-started': '/smart-contracts/bubblegum/sdk',
    '/getting-started/js': '/smart-contracts/bubblegum/sdk/javascript',
    '/getting-started/rust': '/smart-contracts/bubblegum/sdk/rust',
    '/fetch-cnfts': '/smart-contracts/bubblegum-v2/fetch-cnfts',
    '/concurrent-merkle-trees': '/smart-contracts/bubblegum-v2/concurrent-merkle-trees',
    '/stored-nft-data': '/smart-contracts/bubblegum-v2/stored-nft-data',
    '/hashed-nft-data': '/smart-contracts/bubblegum-v2/hashed-nft-data',
    '/merkle-tree-canopy': '/smart-contracts/bubblegum-v2/merkle-tree-canopy',
    '/faq': '/smart-contracts/bubblegum-v2/faq',
  },
  '/smart-contracts/core': {
    '/getting-started': '/smart-contracts/core/sdk',
    'guides/javascript/how-to-create-a-core-nft-asset':
      '/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript',
  },
  '/smart-contracts/core-candy-machine': {
    '/getting-started': '/smart-contracts/core-candy-machine/sdk',
    '/getting-started/js': '/smart-contracts/core-candy-machine/sdk/javascript',
    '/getting-started/rust': '/smart-contracts/core-candy-machine/sdk/rust',
  },
  '/smart-contracts/mpl-hybrid': {
    'guides/mpl-404-hyrbid-ui-template':
      '/smart-contracts/mpl-hybrid/guides/mpl-404-hybrid-ui-template',
  },
  // Legacy Aura redirects - redirect to new dev-tools/das-api paths
  '/aura': {
    '/api/v1/das/get-asset': '/dev-tools/das-api/methods/get-asset',
    '/api/v1/das/get-asset-batch': '/dev-tools/das-api/methods/get-assets',
    '/api/v1/das/get-asset-proof': '/dev-tools/das-api/methods/get-asset-proof',
    '/api/v1/das/get-asset-proof-batch': '/dev-tools/das-api/methods/get-asset-proofs',
    '/api/v1/das/get-assets-by-owner': '/dev-tools/das-api/methods/get-assets-by-owner',
    '/api/v1/das/get-assets-by-authority': '/dev-tools/das-api/methods/get-assets-by-authority',
    '/api/v1/das/get-assets-by-creator': '/dev-tools/das-api/methods/get-assets-by-creator',
    '/api/v1/das/get-assets-by-group': '/dev-tools/das-api/methods/get-assets-by-group',
    '/api/v1/das/get-signatures-for-asset': '/dev-tools/das-api/methods/get-asset-signatures',
    '/api/v1/das/search-assets': '/dev-tools/das-api/methods/search-assets',
  },
  // Legacy documentation redirects
  '/legacy-documentation': {
    '/developer-tools/shank': '/dev-tools/shank',
  },
  '/ja/legacy-documentation': {
    '/developer-tools/shank': '/ja/dev-tools/shank',
  },
  '/ko/legacy-documentation': {
    '/developer-tools/shank': '/ko/dev-tools/shank',
  },
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Redirect /en/* paths to root /* for backwards compatibility
  // This ensures users visiting /en/core are redirected to /core
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const newPath = pathname === '/en' ? '/' : pathname.slice('/en'.length)
    return NextResponse.redirect(new URL(newPath, request.url), 308)
  }

  // Handle standalone page redirects first
  if (standaloneRedirects[pathname]) {
    return NextResponse.redirect(new URL(standaloneRedirects[pathname], request.url), 308)
  }

  // Handle legacy redirects FIRST (specific sub-path redirects)
  // This ensures old bookmarked URLs like /bubblegum/getting-started
  // redirect directly to the final destination /smart-contracts/bubblegum/sdk
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

  // Handle smart contract path migration redirects
  // Redirect /core/* to /smart-contracts/core/*, etc.
  // This catches any paths not handled by the specific redirects above
  for (const product of smartContractRedirects) {
    if (pathname === `/${product}` || pathname.startsWith(`/${product}/`)) {
      const newPath = pathname.replace(`/${product}`, `/smart-contracts/${product}`)
      return NextResponse.redirect(new URL(newPath, request.url), 308)
    }
  }

  // Handle dev tools path migration redirects
  // Redirect /umi/* to /dev-tools/umi/*, etc.
  // This catches any paths not handled by the specific redirects above
  for (const product of devToolsRedirects) {
    if (pathname === `/${product}` || pathname.startsWith(`/${product}/`)) {
      const newPath = pathname.replace(`/${product}`, `/dev-tools/${product}`)
      return NextResponse.redirect(new URL(newPath, request.url), 308)
    }
  }

  // Handle Japanese, Korean, and Chinese path migration redirects
  // Redirect /ja/core/* to /ja/smart-contracts/core/*, /ko/umi/* to /ko/dev-tools/umi/*, etc.
  for (const lang of ['ja', 'ko', 'zh']) {
    if (pathname.startsWith(`/${lang}/`)) {
      // Smart contract redirects for localized paths
      for (const product of smartContractRedirects) {
        if (pathname === `/${lang}/${product}` || pathname.startsWith(`/${lang}/${product}/`)) {
          const newPath = pathname.replace(`/${lang}/${product}`, `/${lang}/smart-contracts/${product}`)
          return NextResponse.redirect(new URL(newPath, request.url), 308)
        }
      }
      // Dev tools redirects for localized paths
      for (const product of devToolsRedirects) {
        if (pathname === `/${lang}/${product}` || pathname.startsWith(`/${lang}/${product}/`)) {
          const newPath = pathname.replace(`/${lang}/${product}`, `/${lang}/dev-tools/${product}`)
          return NextResponse.redirect(new URL(newPath, request.url), 308)
        }
      }
    }
  }

  // Rewrite root paths to /en/* for English content
  // Skip paths that start with /ja, /ko, /zh, /en, /_next, /api, or contain a file extension
  if (!pathname.startsWith('/ja') &&
      !pathname.startsWith('/ko') &&
      !pathname.startsWith('/zh') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api') &&
      !pathname.includes('.')) {
    const url = request.nextUrl.clone()
    url.pathname = `/en${pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files, _next, and api
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
