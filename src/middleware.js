import { NextResponse } from 'next/server'

const redirectRules = {
  "/umi": {
    "/web3js-adapters": "/umi/web3js-differences-and-adapters",
    "/web3js-differences": "/umi/web3js-differences-and-adapters",
    "/connecting-to-umi": "/umi/getting-started",
  },
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  for (const [rootPath, subPaths] of Object.entries(redirectRules)) {
    if (pathname.startsWith(rootPath)) {
      const subPath = pathname.slice(rootPath.length) || "/"
      const destination = subPaths[subPath]
      if (destination) {
        return NextResponse.redirect(new URL(destination, request.url), 308)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/umi/:path*',
  ],
}
