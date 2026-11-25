import { useRouter } from 'next/router'

/**
 * Returns a function that points hash-only hrefs at the current page's public
 * path and leaves other hrefs unchanged.
 *
 * next/link resolves a hash-only href against router.asPath, which is the
 * internal /en/* route during prerendering. English pages would otherwise ship
 * /docs/en/...#id links that middleware answers with a 308. Keep these on
 * next/link rather than a plain <a>: Back stops scrolling if the router does
 * not see the hash change.
 */
export function useInPageHref() {
  const { asPath } = useRouter()
  const pagePath = asPath.split('#')[0].replace(/^\/en(?=\/|$)/, '') || '/'

  return (href) => (href.startsWith('#') ? `${pagePath}${href}` : href)
}
