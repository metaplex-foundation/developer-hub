# Navigation Translation System

## Overview

The Metaplex Developer Hub uses a **hybrid translation system** that balances:
- ✅ **Consistency** - Common terms translated once, used everywhere
- ✅ **Discoverability** - Product-specific translations visible in product files
- ✅ **Maintainability** - Single source of truth for shared translations
- ✅ **Flexibility** - Easy to add/edit translations

## System Components

### 1. Centralized Translations
**File**: `src/config/navigation-translations.js`

Contains common navigation terms used across multiple products:
- Section titles: Introduction, SDK, Features, Guides, etc.
- Common links: Overview, Getting Started, FAQ, etc.
- Product headlines and descriptions

### 2. Product Translation Builder
**Function**: `buildProductTranslations(config)`

Generates localized navigation from:
- **Centralized keys** (e.g., `'links.overview'`)
- **Inline translations** (e.g., `{ ja: '...', ko: '...' }`)
- **Mixed approach** (recommended)

## How to Use

### For Common Terms (Recommended)

Use centralized keys for terms that appear in multiple products:

```javascript
localizedNavigation: buildProductTranslations({
  linkKeys: {
    'Overview': 'links.overview',         // ✅ Centralized
    'Getting Started': 'links.gettingStarted', // ✅ Centralized
    'FAQ': 'links.faq'                    // ✅ Centralized
  }
})
```

**Benefits**:
- Change once, updates everywhere
- Guaranteed consistency
- Translations vetted by native speakers

### For Product-Specific Terms (Recommended)

Use inline translations for terms unique to your product:

```javascript
localizedNavigation: buildProductTranslations({
  linkKeys: {
    'Creating Bubblegum Trees': {         // ✅ Inline, product-specific
      ja: 'Bubblegumツリーの作成',
      ko: 'Bubblegum 트리 생성'
    },
    'Minting cNFTs': {                    // ✅ Inline, product-specific
      ja: 'cNFTのミント',
      ko: 'cNFT 민팅'
    }
  }
})
```

**Benefits**:
- Easy to find (in product file)
- Easy to edit (no central file search)
- Context visible (with product code)

### Hybrid Approach (Best Practice)

Combine both approaches for optimal results:

```javascript
localizedNavigation: buildProductTranslations({
  productKey: 'bubblegumV2',  // For headline/description

  sectionKeys: {
    'Introduction': 'sections.introduction',  // Common - centralized
    'SDK': 'sections.sdk',                     // Common - centralized
    'Features': 'sections.features'            // Common - centralized
  },

  linkKeys: {
    // Common terms - use centralized
    'Overview': 'links.overview',
    'FAQ': 'links.faq',

    // Product-specific - inline
    'Creating Bubblegum Trees': {
      ja: 'Bubblegumツリーの作成',
      ko: 'Bubblegum 트리 생성'
    }
  }
})
```

## How to Edit Translations

### Editing Centralized Translations

1. Open `src/config/navigation-translations.js`
2. Find the term in `NAVIGATION_TRANSLATIONS.sections` or `.links`
3. Edit the `ja` or `ko` value
4. Save - updates all products using that term

**Example**:
```javascript
overview: {
  en: 'Overview',
  ja: '概要',      // ← Edit here
  ko: '개요'       // ← Or here
}
```

### Editing Inline Translations

1. Open the product file (e.g., `src/components/products/bubblegum-v2/index.js`)
2. Find the term in `linkKeys` with inline translations
3. Edit the `ja` or `ko` value directly
4. Save - only affects this product

**Example**:
```javascript
'Creating Bubblegum Trees': {
  ja: 'Bubblegumツリーの作成',  // ← Edit here
  ko: 'Bubblegum 트리 생성'     // ← Or here
}
```

## Decision Guide: Centralized vs Inline

Use this flowchart to decide:

```
Is the term used in 2+ products?
├─ YES → Use centralized key
└─ NO → Is it product-specific?
   ├─ YES → Use inline translation
   └─ NO → Consider adding to centralized (future reuse)
```

## Adding New Translations

### Adding a New Centralized Term

1. Open `src/config/navigation-translations.js`
2. Add to appropriate section (`sections`, `links`, or `products`)
3. Provide `en`, `ja`, and `ko` translations
4. Use camelCase key name

**Example**:
```javascript
links: {
  // ... existing links
  myNewFeature: {
    en: 'My New Feature',
    ja: '新機能',
    ko: '새로운 기능'
  }
}
```

### Adding a New Product Translation

1. Open your product file
2. Add to `buildProductTranslations` config
3. Choose centralized key or inline translation

**Example**:
```javascript
linkKeys: {
  'My Unique Feature': {
    ja: 'ユニーク機能',
    ko: '고유 기능'
  }
}
```

## Migration Guide

### Migrating Existing Products

To migrate a product from old format to new system:

1. **Identify common terms** in your `localizedNavigation`
2. **Replace with keys** for terms in `navigation-translations.js`
3. **Keep inline** for product-specific terms
4. **Test** with `pnpm run build`

**Before**:
```javascript
localizedNavigation: {
  ja: {
    sections: {
      'Introduction': '紹介',
      'Custom Section': 'カスタムセクション'
    }
  }
}
```

**After**:
```javascript
localizedNavigation: buildProductTranslations({
  sectionKeys: {
    'Introduction': 'sections.introduction',  // Centralized
    'Custom Section': {                        // Inline
      ja: 'カスタムセクション',
      ko: '커스텀 섹션'
    }
  }
})
```

## Validation

### Build-Time Validation

Run validation to check translation completeness:

```bash
pnpm run validate-translations
```

This checks:
- All navigation keys have translations
- No missing `ja` or `ko` translations
- Consistency across products

### Manual Testing

Test translations in browser:
- English: `http://localhost:3000/product`
- Japanese: `http://localhost:3000/ja/product`
- Korean: `http://localhost:3000/ko/product`

## Best Practices

### ✅ DO

- Use centralized keys for common terms (Overview, FAQ, etc.)
- Use inline translations for product-specific terms
- Add helpful comments in product files
- Test translations in browser
- Document unique translation choices

### ❌ DON'T

- Duplicate centralized translations as inline
- Mix language codes (use `ja`, not `jp`)
- Leave untranslated (always provide `ja` and `ko`)
- Change centralized translations without considering impact
- Use machine translation without native speaker review

## Examples

### DAS API (Fully Centralized)

All terms are common and centralized:

```javascript
// src/components/products/das-api/index.js
localizedNavigation: buildProductTranslations({
  productKey: 'dasApi',
  linkKeys: {
    'Get Asset': 'links.getAsset',
    'Search Assets': 'links.searchAssets'
    // All use centralized keys
  }
})
```

### Bubblegum v2 (Hybrid)

Mix of centralized and inline:

```javascript
// src/components/products/bubblegum-v2/index.js
localizedNavigation: buildProductTranslations({
  productKey: 'bubblegumV2',
  linkKeys: {
    // Centralized
    'Overview': 'links.overview',
    'FAQ': 'links.faq',

    // Inline (product-specific)
    'Creating Bubblegum Trees': {
      ja: 'Bubblegumツリーの作成',
      ko: 'Bubblegum 트리 생성'
    }
  }
})
```

## Troubleshooting

### Missing Translation Key Error

**Problem**: Build fails with "translation key not found"

**Solution**:
1. Check key name spelling in product file
2. Verify key exists in `navigation-translations.js`
3. Add key if missing

### Translation Not Showing

**Problem**: Translation shows English instead of Japanese/Korean

**Solution**:
1. Check locale is passed correctly (`ja` or `ko`)
2. Verify translation exists in centralized file or inline object
3. Clear browser cache
4. Rebuild: `pnpm run build`

### Inconsistent Translations

**Problem**: Same term translated differently across products

**Solution**:
1. Identify all occurrences
2. Add to centralized translations
3. Update all products to use centralized key
4. Run validation

## Getting Help

- **Documentation**: `src/config/TRANSLATIONS_REVIEW.md`
- **Examples**: See `das-api` and `bubblegum-v2` products
- **Issues**: File bug report with `i18n` label

---

**Last Updated**: 2025-01-22
**System Version**: 2.0 (Hybrid Approach)
