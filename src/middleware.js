import { NextResponse,  } from 'next/server'

const redirectData = {
  "/umi/web3js-adapters": {
    "destination": "/umi/web3js-differences-and-adapters",
    "permanent": true
  },
  "/umi/web3js-differences": {
    "destination": "/umi/web3js-differences-and-adapters",
    "permanent": true
  },
  "/umi/connecting-to-umi": {
    "destination": "/umi/getting-started",
    "permanent": true
  },
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  const redirectEntry = redirectData[pathname]

 
  if (redirectEntry ) {
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(request.nextUrl.origin + redirectEntry.destination, statusCode)
  }
 
  return NextResponse.next()
}