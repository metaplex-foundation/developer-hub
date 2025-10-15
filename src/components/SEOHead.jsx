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
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/social/dev-hub-preview.jpg`

export function SEOHead({ title, description, metaTitle, locale = 'en' }) {
  const router = useRouter()
  const { pathname } = router

  // Use metaTitle if provided, otherwise use title
  const finalMetaTitle = metaTitle || title

  // Get current language config
  const currentLang = LANGUAGES[locale] || LANGUAGES.en

  // Normalize pathname (remove any existing language prefix to avoid duplication)
  let normalizedPath = pathname
  for (const lang of Object.values(LANGUAGES)) {
    if (lang.urlPath && pathname.startsWith(lang.urlPath)) {
      normalizedPath = pathname.slice(lang.urlPath.length) || '/'
      break
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
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
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
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
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
