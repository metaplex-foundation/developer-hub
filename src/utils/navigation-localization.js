/**
 * Navigation Localization Utilities
 *
 * These utilities help manage navigation translations efficiently by:
 * 1. Avoiding duplication - only store actual translations, not the full structure
 * 2. Runtime merging - apply translations to the canonical navigation at runtime
 * 3. Validation - ensure translation completeness at build time
 */

// Check if we're in a Node.js environment (for build-time validation)
const isNode = typeof module !== 'undefined' && module.exports

/**
 * Extract all navigation keys from a product's navigation structure
 *
 * @param {Object} product - The product object with navigation sections
 * @returns {Object} Object with sections and links arrays containing all titles
 */
export function extractNavigationKeys(product) {
  const keys = {
    sections: new Set(),
    links: new Set(),
    hasHeadline: !!product.headline,
    hasDescription: !!product.description
  }

  if (!product.sections) {
    return keys
  }

  product.sections.forEach(section => {
    if (section.navigation) {
      section.navigation.forEach(navGroup => {
        if (navGroup.title) {
          keys.sections.add(navGroup.title)
        }
        if (navGroup.links) {
          navGroup.links.forEach(link => {
            if (link.title) {
              keys.links.add(link.title)
            }
          })
        }
      })
    }
  })

  return {
    sections: Array.from(keys.sections).sort(),
    links: Array.from(keys.links).sort(),
    hasHeadline: keys.hasHeadline,
    hasDescription: keys.hasDescription
  }
}

/**
 * Validate that translation mappings cover all required keys
 *
 * @param {Object} product - The product object
 * @param {Object} translations - Translation mappings for a locale
 * @param {string} locale - The locale being validated
 * @returns {Object} Validation result with missing keys and warnings
 */
export function validateTranslations(product, translations, locale) {
  const keys = extractNavigationKeys(product)
  const missing = {
    headline: false,
    description: false,
    sections: [],
    links: []
  }
  const warnings = []

  // Check headline
  if (keys.hasHeadline && !translations.headline) {
    missing.headline = true
    warnings.push(`Missing translation for headline in locale '${locale}'`)
  }

  // Check description
  if (keys.hasDescription && !translations.description) {
    missing.description = true
    warnings.push(`Missing translation for description in locale '${locale}'`)
  }

  // Check sections
  if (translations.sections) {
    keys.sections.forEach(section => {
      if (!translations.sections[section]) {
        missing.sections.push(section)
        warnings.push(`Missing translation for section '${section}' in locale '${locale}'`)
      }
    })
  } else if (keys.sections.length > 0) {
    missing.sections = keys.sections
    warnings.push(`Missing 'sections' object in locale '${locale}'`)
  }

  // Check links
  if (translations.links) {
    keys.links.forEach(link => {
      if (!translations.links[link]) {
        missing.links.push(link)
        warnings.push(`Missing translation for link '${link}' in locale '${locale}'`)
      }
    })
  } else if (keys.links.length > 0) {
    missing.links = keys.links
    warnings.push(`Missing 'links' object in locale '${locale}'`)
  }

  return {
    isValid: warnings.length === 0,
    missing,
    warnings
  }
}

/**
 * Validate all translations for a product across all locales
 *
 * @param {Object} product - The product object
 * @param {string[]} requiredLocales - Array of locale codes that must have translations
 * @returns {Object} Validation results for all locales
 */
export function validateProductTranslations(product, requiredLocales = ['ja', 'ko']) {
  if (!product.localizedNavigation) {
    return {
      isValid: false,
      errors: [`Product '${product.name}' has no localizedNavigation`]
    }
  }

  const results = {}
  const errors = []

  requiredLocales.forEach(locale => {
    const translations = product.localizedNavigation[locale]
    if (!translations) {
      errors.push(`Missing translations for locale '${locale}' in product '${product.name}'`)
      results[locale] = {
        isValid: false,
        missing: null,
        warnings: [`No translations found for locale '${locale}'`]
      }
    } else {
      results[locale] = validateTranslations(product, translations, locale)
      if (!results[locale].isValid) {
        errors.push(...results[locale].warnings.map(w => `[${product.name}] ${w}`))
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    results
  }
}

/**
 * Localize a product's navigation structure by applying translations
 *
 * This function walks the canonical navigation and replaces titles with
 * translations when available. It maintains the original structure while
 * only modifying translatable text.
 *
 * @param {Object} product - The product object with canonical navigation
 * @param {string} locale - The target locale (e.g., 'ja', 'ko')
 * @returns {Object} Localized product with translated navigation
 */
export function localizeProduct(product, locale) {
  // For English or missing translations, return original product
  if (locale === 'en' || !product.localizedNavigation || !product.localizedNavigation[locale]) {
    return product
  }

  const translations = product.localizedNavigation[locale]
  const localized = { ...product }

  // Localize headline
  if (translations.headline) {
    localized.headline = translations.headline
  }

  // Localize description
  if (translations.description) {
    localized.description = translations.description
  }

  // Localize sections and navigation
  if (localized.sections && translations.sections && translations.links) {
    localized.sections = localized.sections.map(section => {
      const localizedSection = { ...section }

      // Localize navigation groups
      if (section.navigation) {
        localizedSection.navigation = section.navigation.map(navGroup => ({
          ...navGroup,
          // Translate section title
          title: translations.sections[navGroup.title] || navGroup.title,
          // Translate link titles
          links: navGroup.links.map(link => ({
            ...link,
            title: translations.links[link.title] || link.title
          }))
        }))
      }

      return localizedSection
    })
  }

  return localized
}

/**
 * Generate a template for missing translations
 *
 * @param {Object} product - The product object
 * @param {string} locale - The locale to generate template for
 * @returns {Object} Translation template with all required keys
 */
export function generateTranslationTemplate(product, locale = 'xx') {
  const keys = extractNavigationKeys(product)
  const template = {}

  if (keys.hasHeadline) {
    template.headline = product.headline
  }

  if (keys.hasDescription) {
    template.description = product.description
  }

  if (keys.sections.length > 0) {
    template.sections = {}
    keys.sections.forEach(section => {
      template.sections[section] = section
    })
  }

  if (keys.links.length > 0) {
    template.links = {}
    keys.links.forEach(link => {
      template.links[link] = link
    })
  }

  return template
}

// Export for both ES modules and CommonJS
if (isNode) {
  module.exports = {
    extractNavigationKeys,
    validateTranslations,
    validateProductTranslations,
    localizeProduct,
    generateTranslationTemplate
  }
}
