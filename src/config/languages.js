/**
 * Language configuration for i18n and SEO
 *
 * This configuration is used for:
 * - hreflang tags
 * - Language detection
 * - URL path generation
 * - Locale imports
 */

export const LANGUAGES = {
  en: {
    code: 'en',           // ISO 639-1 language code (used in hreflang)
    urlPath: '',          // URL path prefix (empty for default language)
    name: 'English',
    nativeName: 'English',
    isDefault: true,
  },
  ja: {
    code: 'ja',           // ISO 639-1 language code
    urlPath: '/ja',       // URL path prefix
    name: 'Japanese',
    nativeName: '日本語',
    isDefault: false,
  },
  ko: {
    code: 'ko',           // ISO 639-1 language code
    urlPath: '/ko',       // URL path prefix
    name: 'Korean',
    nativeName: '한국어',
    isDefault: false,
  },
}

// Helper to get language config by URL path
export function getLanguageByPath(pathname) {
  // Check if pathname starts with any language prefix
  for (const [key, lang] of Object.entries(LANGUAGES)) {
    if (lang.urlPath && pathname.startsWith(lang.urlPath)) {
      return lang
    }
  }

  // Default to English
  return LANGUAGES.en
}

// Helper to get language config by locale code
export function getLanguageByCode(code) {
  return LANGUAGES[code] || LANGUAGES.en
}

// Helper to generate alternate URLs for hreflang
export function generateAlternateUrls(pathname) {
  const alternates = []

  // Normalize pathname (remove any existing language prefix)
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

  // Generate alternate URLs for each language
  for (const lang of Object.values(LANGUAGES)) {
    const url = lang.urlPath ? `${lang.urlPath}${normalizedPath}` : normalizedPath
    alternates.push({
      hreflang: lang.code,
      url: url,
    })
  }

  return alternates
}

// Get all supported language codes
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES)

// Get default language
export const DEFAULT_LANGUAGE = Object.values(LANGUAGES).find(lang => lang.isDefault)

/**
 * Get localized href for a given path and locale
 *
 * @param {string} path - The path to localize (can be internal or external URL)
 * @param {string} locale - The locale code (e.g., 'en', 'ja', 'ko')
 * @returns {string} The localized path
 *
 * @example
 * getLocalizedHref('/docs', 'en') // '/docs'
 * getLocalizedHref('/docs', 'ja') // '/ja/docs'
 * getLocalizedHref('docs', 'ko') // '/ko/docs' (normalized with leading slash)
 * getLocalizedHref('https://example.com', 'ja') // 'https://example.com' (external URLs unchanged)
 */
export function getLocalizedHref(path, locale) {
  // Handle external URLs - don't add locale prefix
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path
  }

  // Normalize internal paths to ensure leading slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  // For English (default locale), return normalized path without locale prefix
  if (locale === 'en') {
    return normalizedPath
  }

  // For other locales, prefix with /{locale}
  return `/${locale}${normalizedPath}`
}
