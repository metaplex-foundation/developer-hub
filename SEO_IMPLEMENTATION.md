# SEO Implementation for Multilingual Documentation

**Date:** 2025-10-12
**Status:** ✅ Complete

## Overview

This document outlines the SEO implementation for the Metaplex Developer Hub's multilingual documentation, following international best practices for language-specific content.

## Changes Made

### 1. Language Code Standardization

Updated from custom codes to ISO 639-1 standard:

| Old Code | New Code | Language | Reason |
|----------|----------|----------|--------|
| `/jp/` | `/ja/` | Japanese | ISO 639-1 standard for Japanese |
| `/kr/` | `/ko/` | Korean | ISO 639-1 standard for Korean |

**Why This Matters:**
- hreflang tags require ISO 639-1 language codes
- Improves international SEO
- Aligns with web standards
- Prevents confusion with search engines

### 2. New SEO Components

#### Language Configuration (`src/config/languages.js`)
Central configuration for all language settings:
- ISO 639-1 language codes
- URL path mappings
- Native language names
- Helper functions for path generation

#### SEOHead Component (`src/components/SEOHead.jsx`)
Comprehensive SEO meta tags including:
- **Title and Description**: Translated for each language
- **Canonical URLs**: Self-referential (each language version points to itself)
- **hreflang Tags**: Proper alternate language links
- **Open Graph**: Language-aware OG tags with locale alternates
- **Twitter Card**: Complete social media meta tags

### 3. File Migrations

#### Directories Renamed
- `/src/pages/jp/` → `/src/pages/ja/` (437 files)
- `/src/pages/kr/` → `/src/pages/ko/` (437 files)

#### Locale Files Renamed
- `/src/locales/jp.json` → `/src/locales/ja.json`
- `/src/locales/kr.json` → `/src/locales/ko.json`

### 4. Configuration Updates

#### Updated Files
1. **`src/contexts/LocaleContext.js`**
   - Changed locale detection from `jp`/`kr` to `ja`/`ko`
   - Updated import paths for locale JSON files

2. **`src/components/LanguageSwitcher.jsx`**
   - Updated language codes to `ja` and `ko`
   - Updated path detection logic

3. **`src/shared/localizedSections.js`**
   - Changed translation keys from `jp`/`kr` to `ja`/`ko`

4. **`src/shared/productTranslations.js`**
   - Added Korean (`ko`) translations
   - Changed Japanese key from `jp` to `ja`

5. **`src/i18n.js`**
   - Updated locale array: `['en', 'ja', 'ko']`

6. **`src/pages/_app.jsx`**
   - Replaced custom Head implementation with new SEOHead component
   - Now automatically generates all SEO tags

## SEO Features Implemented

### ✅ Canonical URLs
Each language version has a self-referential canonical URL:
- English: `https://developers.metaplex.com/page`
- Japanese: `https://developers.metaplex.com/ja/page`
- Korean: `https://developers.metaplex.com/ko/page`

### ✅ hreflang Tags
Every page includes alternate language links:
```html
<link rel="alternate" hreflang="en" href="https://developers.metaplex.com/page" />
<link rel="alternate" hreflang="ja" href="https://developers.metaplex.com/ja/page" />
<link rel="alternate" hreflang="ko" href="https://developers.metaplex.com/ko/page" />
<link rel="alternate" hreflang="x-default" href="https://developers.metaplex.com/page" />
```

### ✅ Open Graph Localization
- `og:locale` set to proper format (e.g., `ja_JP`, `ko_KR`)
- `og:locale:alternate` tags for other languages
- Prevents duplicate content issues

### ✅ Translated Meta Tags
- Page titles translated in frontmatter
- Meta descriptions translated
- All social media cards properly localized

## URL Structure

### Final URL Pattern
- **English (default):** `developers.metaplex.com/[page]`
- **Japanese:** `developers.metaplex.com/ja/[page]`
- **Korean:** `developers.metaplex.com/ko/[page]`

### Example Pages
| English | Japanese | Korean |
|---------|----------|--------|
| `/core` | `/ja/core` | `/ko/core` |
| `/candy-machine` | `/ja/candy-machine` | `/ko/candy-machine` |
| `/umi` | `/ja/umi` | `/ko/umi` |

## Adding New Languages

To add a new language in the future:

1. **Update Language Config** (`src/config/languages.js`):
   ```js
   es: {
     code: 'es',           // ISO 639-1 code
     urlPath: '/es',       // URL prefix
     name: 'Spanish',
     nativeName: 'Español',
     isDefault: false,
   }
   ```

2. **Create Locale File**: `/src/locales/es.json`

3. **Update i18n Config** (`src/i18n.js`):
   ```js
   const locales = ['en', 'ja', 'ko', 'es'];
   ```

4. **Add Translations** to:
   - `src/shared/localizedSections.js`
   - `src/shared/productTranslations.js`

5. **Create Pages Directory**: `/src/pages/es/`

The SEO system will automatically:
- Generate hreflang tags
- Create canonical URLs
- Add Open Graph locale tags
- Handle language switching

## Testing SEO

### Verify Implementation
1. **Check hreflang tags**: View page source and look for `<link rel="alternate" hreflang="..."`
2. **Test canonical URLs**: Ensure each language version has correct self-referential canonical
3. **Validate Open Graph**: Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
4. **Check Twitter Cards**: Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Google Search Console
After deployment:
1. Submit all language versions to Search Console
2. Monitor for any hreflang errors
3. Verify language targeting is working correctly

## Benefits

✅ **No Duplicate Content Penalties**: Each language version properly identified
✅ **Improved International SEO**: Search engines serve correct language to users
✅ **Better User Experience**: Users see content in their preferred language
✅ **Future-Proof**: Easy to add more languages
✅ **Standards Compliant**: Follows W3C and Google best practices

## References

- [Google Search Central - Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [hreflang Best Practices](https://developers.google.com/search/docs/specialty/international/localized-versions#html)
- [Open Graph Protocol](https://ogp.me/)
