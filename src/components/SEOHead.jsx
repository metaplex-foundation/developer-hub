import Head from 'next/head'
import { useRouter } from 'next/router'
import { LANGUAGES, generateAlternateUrls } from '@/config/languages'

/**
 * SEOHead Component
 *
 * Handles all SEO-related meta tags including:
 * - Title and description
 * - Open Graph tags
 * - Twitter Card tags
 * - Canonical URLs
 * - hreflang tags for internationalization
 *
 * Usage:
 * <SEOHead
 *   title="Page Title"
 *   description="Page description"
 *   metaTitle="Custom Meta Title (optional)"
 *   locale="en"
 * />
 */

const SITE_URL = 'https://developers.metaplex.com'

/**
 * Get the base URL for the current environment
 * Uses Vercel's automatic URL for preview deployments
 */
function getBaseUrl() {
  // For local development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  // For preview deployments on Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  // For production
  return SITE_URL
}

/**
 * Generate dynamic OG image URL
 * Uses the /api/og endpoint to create dynamic social preview images
 */
function generateOGImageUrl(title, description, product) {
  const params = new URLSearchParams()
  if (title) params.set('title', title)
  if (description) params.set('description', description)
  if (product) params.set('product', product)
  return `${getBaseUrl()}/api/og?${params.toString()}`
}

/**
 * Extract product from pathname
 * e.g., /core/getting-started -> core
 *       /ja/candy-machine/overview -> candy-machine
 */
function extractProductFromPath(pathname) {
  // Remove language prefix if present
  let path = pathname
  if (path.startsWith('/en/')) path = path.slice(4)
  else if (path.startsWith('/ja/')) path = path.slice(4)
  else if (path.startsWith('/ko/')) path = path.slice(4)
  else if (path.startsWith('/en')) path = path.slice(3)
  else if (path.startsWith('/ja')) path = path.slice(3)
  else if (path.startsWith('/ko')) path = path.slice(3)

  // Handle smart-contracts paths
  if (path.startsWith('/smart-contracts/')) {
    const subPath = path.slice('/smart-contracts/'.length)
    const product = subPath.split('/')[0]
    return product || null
  }

  // Handle dev-tools paths
  if (path.startsWith('/dev-tools/')) {
    const subPath = path.slice('/dev-tools/'.length)
    const product = subPath.split('/')[0]
    return product || null
  }

  // Handle guides paths
  if (path.startsWith('/guides')) {
    return 'guides'
  }

  // Get first path segment as product
  const segments = path.split('/').filter(Boolean)
  return segments[0] || null
}

export function SEOHead({ title, description, metaTitle, locale = 'en', product: productProp }) {
  const router = useRouter()
  const { pathname } = router

  // Use metaTitle if provided, otherwise use title
  const finalMetaTitle = metaTitle || title

  // Determine product from prop or pathname
  // productProp comes as 'smart-contracts/core' or 'dev-tools/cli', extract the last segment
  const rawProduct = productProp || extractProductFromPath(pathname)
  const product = rawProduct?.includes('/') ? rawProduct.split('/').pop() : rawProduct

  // Generate dynamic OG image URL
  const ogImageUrl = generateOGImageUrl(title, description, product)

  // Get current language config
  const currentLang = LANGUAGES[locale] || LANGUAGES.en

  // Normalize pathname (remove any existing language prefix to avoid duplication)
  let normalizedPath = pathname

  // Handle /en prefix specially since English urlPath is empty but pages are stored at /en/*
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    normalizedPath = pathname === '/en' ? '/' : pathname.slice('/en'.length)
  } else {
    // Handle other language prefixes (/ja, /ko)
    for (const lang of Object.values(LANGUAGES)) {
      if (lang.urlPath && pathname.startsWith(lang.urlPath)) {
        normalizedPath = pathname.slice(lang.urlPath.length) || '/'
        break
      }
    }
  }

  // Generate canonical URL (always points to the current language version)
  const canonicalUrl = `${SITE_URL}${currentLang.urlPath}${normalizedPath === '/' ? '' : normalizedPath}`

  // Generate alternate URLs for hreflang
  const alternateUrls = generateAlternateUrls(pathname)

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{finalMetaTitle}</title>
      {description && <meta name="description" content={description} />}

      {/* Canonical URL - points to current language version */}
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang tags for language alternates */}
      {alternateUrls.map(({ hreflang, url }) => (
        <link
          key={hreflang}
          rel="alternate"
          hrefLang={hreflang}
          href={`${SITE_URL}${url}`}
        />
      ))}

      {/* x-default hreflang (points to English version) */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${SITE_URL}${alternateUrls.find(alt => alt.hreflang === 'en')?.url || '/'}`}
      />

      {/* Open Graph */}
      <meta property="og:title" content={finalMetaTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={getOGLocale(locale)} />

      {/* Add og:locale:alternate for other languages */}
      {Object.keys(LANGUAGES)
        .filter(lang => lang !== locale)
        .map(lang => (
          <meta
            key={`og-locale-${lang}`}
            property="og:locale:alternate"
            content={getOGLocale(lang)}
          />
        ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalMetaTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImageUrl} />
      <meta property="twitter:domain" content="developers.metaplex.com" />
    </Head>
  )
}

/**
 * Convert locale code to Open Graph locale format
 * en -> en_US
 * ja -> ja_JP
 * ko -> ko_KR
 */
function getOGLocale(localeCode) {
  const ogLocaleMap = {
    en: 'en_US',
    ja: 'ja_JP',
    ko: 'ko_KR',
  }

  return ogLocaleMap[localeCode] || 'en_US'
}
