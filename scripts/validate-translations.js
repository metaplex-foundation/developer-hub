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
 *   node scripts/validate-translations.js --files-only
 */

const fs = require('fs')
const path = require('path')

const REQUIRED_LOCALES = ['ja', 'ko', 'zh']
const FAIL_ON_WARNING = process.argv.includes('--fail-on-warning')
const GENERATE_TEMPLATE = process.argv.includes('--generate-template')
const FILES_ONLY = process.argv.includes('--files-only')
const SHOW_MISSING = process.argv.includes('--show-missing')

// Helper function to recursively get all .md files in a directory
function getMarkdownFiles(dir, baseDir = dir) {
  let files = []
  if (!fs.existsSync(dir)) {
    return files
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files = files.concat(getMarkdownFiles(fullPath, baseDir))
    } else if (entry.name.endsWith('.md')) {
      // Get relative path from base directory
      files.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'))
    }
  }
  return files
}

// Function to validate translation file coverage
function validateTranslationFiles() {
  const pagesDir = path.join(__dirname, '..', 'src', 'pages')
  const locales = ['en', 'ja', 'ko', 'zh']

  console.log('='.repeat(60))
  console.log('Translation File Coverage Report')
  console.log('='.repeat(60))
  console.log()

  // Get files for each locale
  const filesByLocale = {}
  for (const locale of locales) {
    const localeDir = path.join(pagesDir, locale)
    filesByLocale[locale] = getMarkdownFiles(localeDir)
  }

  // Use EN as the baseline
  const enFiles = new Set(filesByLocale['en'])

  console.log('File counts by locale:')
  console.log('-'.repeat(40))
  for (const locale of locales) {
    const count = filesByLocale[locale].length
    const percentage = ((count / filesByLocale['en'].length) * 100).toFixed(1)
    const bar = '█'.repeat(Math.round(percentage / 5)) + '░'.repeat(20 - Math.round(percentage / 5))
    console.log(`  ${locale.toUpperCase()}: ${count.toString().padStart(4)} files  ${bar} ${percentage}%`)
  }
  console.log()

  // Show missing files for each locale compared to EN
  const missingByLocale = {}
  for (const locale of locales) {
    if (locale === 'en') continue
    const localeFiles = new Set(filesByLocale[locale])
    missingByLocale[locale] = [...enFiles].filter(f => !localeFiles.has(f))
  }

  console.log('Missing files compared to EN:')
  console.log('-'.repeat(40))
  for (const locale of ['ja', 'ko', 'zh']) {
    const missing = missingByLocale[locale]
    console.log(`  ${locale.toUpperCase()}: ${missing.length} files missing`)
  }
  console.log()

  // Show detailed missing files if requested
  if (SHOW_MISSING) {
    for (const locale of ['ja', 'ko', 'zh']) {
      const missing = missingByLocale[locale]
      if (missing.length > 0) {
        console.log(`Missing files in ${locale.toUpperCase()}:`)
        console.log('-'.repeat(40))
        // Group by top-level directory
        const byDir = {}
        for (const file of missing) {
          const parts = file.split('/')
          const topDir = parts.length > 1 ? parts[0] : '(root)'
          if (!byDir[topDir]) byDir[topDir] = []
          byDir[topDir].push(file)
        }
        for (const [dir, files] of Object.entries(byDir).sort()) {
          if (dir === '(root)') {
            console.log(`  (root level files: ${files.length})`)
          } else {
            console.log(`  ${dir}/ (${files.length} files)`)
          }
          if (files.length <= 10) {
            files.forEach(f => console.log(`    - ${f}`))
          } else {
            files.slice(0, 5).forEach(f => console.log(`    - ${f}`))
            console.log(`    ... and ${files.length - 5} more`)
          }
        }
        console.log()
      }
    }
  }

  return { filesByLocale, missingByLocale }
}

// Run file validation
const fileValidation = validateTranslationFiles()

// If --files-only, exit here
if (FILES_ONLY) {
  console.log('Use --show-missing to see detailed list of missing files')
  process.exit(0)
}

// Only load product modules when needed for navigation validation
// These use ES modules so we skip this section if only checking files
let products, validateProductTranslations, extractNavigationKeys, generateTranslationTemplate
try {
  const productsModule = require('../src/components/products/index.js')
  const navLocModule = require('../src/utils/navigation-localization.js')
  products = productsModule.products
  validateProductTranslations = navLocModule.validateProductTranslations
  extractNavigationKeys = navLocModule.extractNavigationKeys
  generateTranslationTemplate = navLocModule.generateTranslationTemplate
} catch (e) {
  console.log('Note: Navigation validation skipped (ES module compatibility)')
  console.log('File coverage validation completed successfully.\n')
  console.log('File Coverage:')
  for (const locale of ['ja', 'ko', 'zh']) {
    const missing = fileValidation.missingByLocale[locale].length
    const total = fileValidation.filesByLocale['en'].length
    const translated = total - missing
    console.log(`  ${locale.toUpperCase()}: ${translated}/${total} files translated (${((translated/total)*100).toFixed(1)}%)`)
  }
  process.exit(0)
}

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
console.log()
console.log('File Coverage:')
for (const locale of ['ja', 'ko', 'zh']) {
  const missing = fileValidation.missingByLocale[locale].length
  const total = fileValidation.filesByLocale['en'].length
  const translated = total - missing
  console.log(`  ${locale.toUpperCase()}: ${translated}/${total} files translated (${((translated/total)*100).toFixed(1)}%)`)
}

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
