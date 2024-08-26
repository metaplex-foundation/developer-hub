import { NextResponse } from 'next/server'

const redirectRules = {
  "/umi": {
    "/web3js-adapters": {
      destination: "/umi/web3js-differences-and-adapters",
      permanent: true,
    },
    "/web3js-differences": {
      destination: "/umi/web3js-differences-and-adapters",
      permanent: true,
    },
    "/connecting-to-umi": {
      destination: "/umi/getting-started",
      permanent: true,
    },
  },
  "/toolbox": {
    "/": {
      destination: "/umi/toolbox",
      permanent: true,
    },
    "/getting-started": {
      destination: "/umi/toolbox",
      permanent: true,
    },
  },
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  const rootPath = Object.keys(redirectRules).find(root => pathname.startsWith(root))

  if (rootPath) {
    const subPath = pathname.slice(rootPath.length) || "/"

    const redirectEntry = redirectRules[rootPath][subPath]

    if (redirectEntry) {
      const statusCode = redirectEntry.permanent ? 308 : 307
      return NextResponse.redirect(request.nextUrl.origin + redirectEntry.destination, statusCode)
    }
  }

  return NextResponse.next()
}
