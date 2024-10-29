import { NextResponse } from 'next/server'

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
  '/core/guides/javascript/how-to-create-a-core-nft-asset':
    '/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript',
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
    '/core/guides/javascript/how-to-create-a-core-nft-asset',
    '/guides/javascript/how-to-create-an-spl-token-on-solana',
  ],
}
