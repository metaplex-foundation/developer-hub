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
 * - JSON-LD structured data (Organization, WebSite, BreadcrumbList, TechArticle)
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
const LOGO_URL = `${SITE_URL}/metaplex-logo-white.png`

/**
 * Get the base URL for the current environment
 * Uses Vercel's automatic URL for preview deployments
 */
function getBaseUrl() {
  // For local development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  // Requires "Automatically expose System Environment Variables" enabled in Vercel settings
  // For production on Vercel - use the project's production URL
  if (process.env.VERCEL_ENV === 'production') {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  // For preview deployments on Vercel - use preview URL for testing
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // Fallback to hardcoded production URL
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

/**
 * Generate Organization schema (site-wide)
 */
function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Metaplex',
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs: [
      'https://twitter.com/metaplex',
      'https://github.com/metaplex-foundation',
      'https://discord.gg/metaplex',
    ],
  }
}

/**
 * Generate WebSite schema (site-wide, no SearchAction since search is modal-only)
 */
function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Metaplex Developer Hub',
    url: SITE_URL,
  }
}

/**
 * Generate BreadcrumbList schema based on page hierarchy
 */
function generateBreadcrumbSchema(pathname, productName, productPath, sectionTitle, navigationGroup, title) {
  const items = [
    { name: 'Home', url: SITE_URL },
  ]

  // Build breadcrumb path based on URL structure
  const pathSegments = pathname.split('/').filter(Boolean)

  // Handle category paths like smart-contracts/ or dev-tools/
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0]

    // Check for category prefixes
    if (firstSegment === 'smart-contracts') {
      items.push({ name: 'Smart Contracts', url: `${SITE_URL}/smart-contracts` })
    } else if (firstSegment === 'dev-tools') {
      items.push({ name: 'Dev Tools', url: `${SITE_URL}/dev-tools` })
    } else if (firstSegment === 'guides') {
      items.push({ name: 'Guides', url: `${SITE_URL}/guides` })
    } else if (firstSegment === 'legacy-documentation') {
      items.push({ name: 'Legacy Documentation', url: `${SITE_URL}/legacy-documentation` })
    }
  }

  // Add product if available and not already in path
  if (productName && productPath) {
    const productUrl = `${SITE_URL}/${productPath}`
    // Avoid duplicate entries
    if (!items.some(item => item.url === productUrl)) {
      items.push({ name: productName, url: productUrl })
    }
  }

  // Add section (Documentation, Guides, References) if different from product
  if (sectionTitle && sectionTitle !== productName && sectionTitle !== 'Documentation') {
    // Section URLs typically follow product path
    if (productPath && sectionTitle === 'Guides') {
      items.push({ name: sectionTitle, url: `${SITE_URL}/${productPath}/guides` })
    }
  }

  // Add navigation group if available (e.g., "Introduction", "Features", "Plugins")
  if (navigationGroup && navigationGroup !== title && navigationGroup !== sectionTitle) {
    // Navigation groups don't typically have their own URL, so we skip adding a URL
    // But we can still include them in the breadcrumb for context
  }

  // Add current page title (last item, no URL per schema.org spec)
  if (title && title !== productName && items.length > 0) {
    items.push({ name: title })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  }
}

/**
 * Generate TechArticle schema for documentation pages
 */
function generateTechArticleSchema(title, description, canonicalUrl, locale, created, updated) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    url: canonicalUrl,
    inLanguage: locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    author: {
      '@type': 'Organization',
      name: 'Metaplex',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Metaplex',
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
  }

  if (description) {
    schema.description = description
  }

  if (created) {
    schema.datePublished = created
  }

  if (updated) {
    schema.dateModified = updated
  } else if (created) {
    schema.dateModified = created
  }

  return schema
}

/**
 * Generate all JSON-LD schemas for a page
 */
function generateJsonLdSchemas({
  isHomePage,
  title,
  description,
  canonicalUrl,
  locale,
  productName,
  productPath,
  sectionTitle,
  navigationGroup,
  pathname,
  created,
  updated,
}) {
  const schemas = []

  // Site-wide schemas only on homepage
  if (isHomePage) {
    schemas.push(generateOrganizationSchema())
    schemas.push(generateWebSiteSchema())
  }

  // Per-page schemas
  if (!isHomePage && title) {
    schemas.push(generateBreadcrumbSchema(pathname, productName, productPath, sectionTitle, navigationGroup, title))
    schemas.push(generateTechArticleSchema(title, description, canonicalUrl, locale, created, updated))
  }

  return schemas
}

export function SEOHead({
  title,
  description,
  metaTitle,
  locale = 'en',
  product: productProp,
  productName,
  navigationGroup,
  sectionTitle,
  created,
  updated,
  isHomePage = false,
}) {
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

  // Generate JSON-LD structured data
  const jsonLdSchemas = generateJsonLdSchemas({
    isHomePage,
    title,
    description,
    canonicalUrl,
    locale,
    productName,
    productPath: productProp,
    sectionTitle,
    navigationGroup,
    pathname: normalizedPath,
    created,
    updated,
  })

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

      {/* JSON-LD Structured Data */}
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
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
