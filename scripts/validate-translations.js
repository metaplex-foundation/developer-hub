#!/usr/bin/env node

/**
 * Build-time validation script for navigation translations
 *
 * This script validates that all products have complete translations
 * for all required locales. It helps prevent maintenance drift by
 * ensuring that when navigation structure changes, translations are
 * kept in sync.
 *
 * Usage:
 *   node scripts/validate-translations.js
 *   node scripts/validate-translations.js --fail-on-warning
 */

const { products } = require('../src/components/products/index.js')
const {
  validateProductTranslations,
  extractNavigationKeys,
  generateTranslationTemplate
} = require('../src/utils/navigation-localization.js')

const REQUIRED_LOCALES = ['ja', 'ko']
const FAIL_ON_WARNING = process.argv.includes('--fail-on-warning')
const GENERATE_TEMPLATE = process.argv.includes('--generate-template')

console.log('Validating navigation translations...\n')

let hasErrors = false
let hasWarnings = false
const allResults = []

products.forEach(product => {
  // Skip products without navigation
  if (!product.sections || product.sections.length === 0) {
    return
  }

  const keys = extractNavigationKeys(product)

  // Skip products with no navigable content
  if (keys.sections.length === 0 && keys.links.length === 0) {
    return
  }

  console.log(`Checking ${product.name}...`)

  // Generate template if requested
  if (GENERATE_TEMPLATE && (!product.localizedNavigation || Object.keys(product.localizedNavigation).length === 0)) {
    console.log(`  Template for ${product.name}:`)
    REQUIRED_LOCALES.forEach(locale => {
      const template = generateTranslationTemplate(product, locale)
      console.log(`  ${locale}:`, JSON.stringify(template, null, 2))
    })
    console.log()
    return
  }

  const validation = validateProductTranslations(product, REQUIRED_LOCALES)
  allResults.push({ product: product.name, validation })

  if (!validation.isValid) {
    hasErrors = true
    console.log(`  ❌ Validation failed`)
    validation.errors.forEach(error => {
      console.log(`     - ${error}`)
    })
  } else {
    console.log(`  ✅ All translations complete`)
  }

  // Show detailed results for each locale
  Object.entries(validation.results).forEach(([locale, result]) => {
    if (!result.isValid) {
      hasWarnings = true
      console.log(`  Locale ${locale}:`)
      if (result.missing.sections.length > 0) {
        console.log(`    Missing sections: ${result.missing.sections.join(', ')}`)
      }
      if (result.missing.links.length > 0) {
        console.log(`    Missing links: ${result.missing.links.join(', ')}`)
      }
      if (result.missing.headline) {
        console.log(`    Missing headline`)
      }
      if (result.missing.description) {
        console.log(`    Missing description`)
      }
    }
  })

  console.log()
})

// Summary
console.log('Summary:')
console.log(`  Total products validated: ${allResults.length}`)
console.log(`  Products with errors: ${allResults.filter(r => !r.validation.isValid).length}`)
console.log(`  Products with warnings: ${allResults.filter(r => Object.values(r.validation.results).some(v => !v.isValid)).length}`)

if (hasErrors || (FAIL_ON_WARNING && hasWarnings)) {
  console.log('\n❌ Translation validation failed!')
  console.log('Please ensure all navigation items have translations for all required locales.')
  process.exit(1)
} else if (hasWarnings) {
  console.log('\n⚠️  Some warnings found, but validation passed.')
  console.log('Consider adding missing translations for better localization coverage.')
  process.exit(0)
} else {
  console.log('\n✅ All translations validated successfully!')
  process.exit(0)
}
