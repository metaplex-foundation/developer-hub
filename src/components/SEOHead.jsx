import Head from 'next/head'
import { useRouter } from 'next/router'
import { LANGUAGES, generateAlternateUrls } from '@/config/languages'
import { products } from '@/components/products'

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
  else if (path.startsWith('/zh/')) path = path.slice(4)
  else if (path.startsWith('/en')) path = path.slice(3)
  else if (path.startsWith('/ja')) path = path.slice(3)
  else if (path.startsWith('/ko')) path = path.slice(3)
  else if (path.startsWith('/zh')) path = path.slice(3)

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
      items.push({ name: 'Solana', url: `${SITE_URL}/guides` })
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
 * Convert date string to ISO 8601 format (YYYY-MM-DD)
 * Handles formats: MM-DD-YYYY, YYYY-MM-DD, or Date objects
 */
function toISO8601Date(dateStr) {
  if (!dateStr) return null

  // Already in ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr
  }

  // MM-DD-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [month, day, year] = dateStr.split('-')
    return `${year}-${month}-${day}`
  }

  // Try parsing as date
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0]
  }

  return dateStr
}

/**
 * Generate TechArticle schema for documentation pages
 * Enhanced with: @id (fragment), mainEntityOfPage, audience, keywords (array),
 * about, proficiencyLevel, programmingLanguage, isPartOf (CreativeWork),
 * discussionUrl, softwareRequirements (text + structured mentions)
 */
function generateTechArticleSchema({
  title,
  description,
  canonicalUrl,
  locale,
  created,
  updated,
  keywords,
  about,
  proficiencyLevel,
  programmingLanguage,
  productName,
  productPath,
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    // Use fragment identifier for the article itself
    '@id': `${canonicalUrl}#article`,
    headline: title,
    url: canonicalUrl,
    // Language is important for indexing and LLM pipelines
    inLanguage: locale,
    // Link to the WebPage that contains this article
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
      url: canonicalUrl,
    },
    // Author and publisher share the same Organization identity
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Metaplex',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Metaplex',
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    // Target audience is developers
    audience: {
      '@type': 'Audience',
      audienceType: 'Developers',
    },
    // Community discussion channel
    discussionUrl: 'https://discord.gg/metaplex',
  }

  // Description is important for TechArticle
  if (description) {
    schema.description = description
  }

  if (created) {
    schema.datePublished = toISO8601Date(created)
  }

  if (updated) {
    schema.dateModified = toISO8601Date(updated)
  } else if (created) {
    schema.dateModified = toISO8601Date(created)
  }

  // Keywords as array (more machine-friendly than comma-separated string)
  if (keywords && keywords.length > 0) {
    schema.keywords = Array.isArray(keywords) ? keywords : [keywords]
  }

  // About - topics/entities as Thing objects
  if (about && about.length > 0) {
    schema.about = about.map(topic => ({
      '@type': 'Thing',
      name: topic,
    }))
  }

  // Proficiency level (Beginner, Intermediate, Advanced)
  if (proficiencyLevel) {
    schema.proficiencyLevel = proficiencyLevel
  }

  // Programming languages used in code examples
  if (programmingLanguage && programmingLanguage.length > 0) {
    schema.programmingLanguage = programmingLanguage.map(lang => ({
      '@type': 'ComputerLanguage',
      name: lang,
    }))
  }

  // isPartOf - use CreativeWork for doc sections (not WebSite which implies whole site)
  if (productName && productPath) {
    schema.isPartOf = {
      '@type': 'CreativeWork',
      '@id': `${SITE_URL}/${productPath}#documentation`,
      name: `${productName} Documentation`,
      url: `${SITE_URL}/${productPath}`,
    }
  }

  // Software requirements - use text string for broad compatibility
  // Plus structured 'mentions' for richer data consumers
  const requirements = []
  const mentionedSoftware = []

  if (programmingLanguage && programmingLanguage.some(lang =>
    ['JavaScript', 'TypeScript'].includes(lang)
  )) {
    requirements.push('@metaplex-foundation/mpl-core', '@metaplex-foundation/umi')
    mentionedSoftware.push(
      {
        '@type': 'SoftwareSourceCode',
        name: '@metaplex-foundation/mpl-core',
        codeRepository: 'https://github.com/metaplex-foundation/mpl-core',
        programmingLanguage: { '@type': 'ComputerLanguage', name: 'TypeScript' },
      },
      {
        '@type': 'SoftwareSourceCode',
        name: '@metaplex-foundation/umi',
        codeRepository: 'https://github.com/metaplex-foundation/umi',
        programmingLanguage: { '@type': 'ComputerLanguage', name: 'TypeScript' },
      }
    )
  }

  if (programmingLanguage && programmingLanguage.includes('Rust')) {
    requirements.push('mpl-core (Rust crate)')
    mentionedSoftware.push({
      '@type': 'SoftwareSourceCode',
      name: 'mpl-core',
      codeRepository: 'https://github.com/metaplex-foundation/mpl-core',
      programmingLanguage: { '@type': 'ComputerLanguage', name: 'Rust' },
    })
  }

  // softwareRequirements as text (broad compatibility)
  if (requirements.length > 0) {
    schema.softwareRequirements = requirements.join(', ')
  }

  // mentions for structured software references (richer data)
  if (mentionedSoftware.length > 0) {
    schema.mentions = mentionedSoftware
  }

  return schema
}

/**
 * Generate HowTo schema for tutorial/guide sections
 */
function generateHowToSchema({ name, description, steps, tools }) {
  if (!steps || steps.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: typeof step === 'string' ? step : step.name,
      text: typeof step === 'string' ? step : step.text || step.name,
    })),
  }

  if (description) {
    schema.description = description
  }

  // Tools/supplies (optional)
  if (tools && tools.length > 0) {
    schema.tool = tools.map(tool => ({
      '@type': 'HowToTool',
      name: tool,
    }))
  }

  return schema
}

/**
 * Resolve {% fee %} Markdoc tags in plain text strings.
 * Frontmatter values are parsed as raw YAML strings, so Markdoc tags
 * like {% fee product="genesis" config="launchPool" fee="withdraw" /%}
 * need to be resolved to their actual values for JSON-LD output.
 */
function resolveMarkdocFeeTags(text) {
  if (!text || typeof text !== 'string') return text

  return text.replace(
    /\{%\s*fee\s+(.*?)\s*\/%\s*\}/g,
    (match, attrString) => {
      const attrs = {}
      const attrRegex = /(\w+)="([^"]+)"/g
      let m
      while ((m = attrRegex.exec(attrString)) !== null) {
        attrs[m[1]] = m[2]
      }

      const { product: productName, config, fee, field = 'solana' } = attrs
      if (!productName || !config || !fee) return match

      const product = products.find(
        (p) =>
          p.path === productName ||
          p.path.endsWith(`/${productName}`) ||
          p.name.toLowerCase() === productName.toLowerCase()
      )

      if (!product?.protocolFees?.[config]?.[fee]) return match

      const feeData = product.protocolFees[config][fee]
      if (typeof feeData === 'string') return feeData
      if (typeof feeData === 'object') return feeData[field] || match

      return match
    }
  )
}

/**
 * Generate FAQPage schema for FAQ sections
 */
function generateFAQPageSchema(faqs) {
  if (!faqs || faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: resolveMarkdocFeeTags(faq.q || faq.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: resolveMarkdocFeeTags(faq.a || faq.answer),
      },
    })),
  }
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
  keywords,
  about,
  proficiencyLevel,
  programmingLanguage,
  faqs,
  howToSteps,
  howToTools,
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
    schemas.push(generateTechArticleSchema({
      title,
      description,
      canonicalUrl,
      locale,
      created,
      updated,
      keywords,
      about,
      proficiencyLevel,
      programmingLanguage,
      productName,
      productPath,
    }))

    // Add HowTo schema if steps are provided
    const howToSchema = generateHowToSchema({
      name: title,
      description,
      steps: howToSteps,
      tools: howToTools,
    })
    if (howToSchema) {
      schemas.push(howToSchema)
    }

    // Add FAQPage schema if FAQs are provided
    const faqSchema = generateFAQPageSchema(faqs)
    if (faqSchema) {
      schemas.push(faqSchema)
    }
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
  // Enhanced TechArticle fields
  keywords,
  about,
  proficiencyLevel,
  programmingLanguage,
  // HowTo schema fields
  howToSteps,
  howToTools,
  // FAQPage schema fields
  faqs,
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
    keywords,
    about,
    proficiencyLevel,
    programmingLanguage,
    faqs,
    howToSteps,
    howToTools,
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
    zh: 'zh_CN',
  }

  return ogLocaleMap[localeCode] || 'en_US'
}
