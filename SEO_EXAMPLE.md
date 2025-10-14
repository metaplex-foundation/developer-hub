# SEO Implementation Example

## What Gets Generated

When a user visits any page on the Metaplex Developer Hub, the SEOHead component automatically generates comprehensive SEO tags.

### Example Page: Core Documentation

For a Core documentation page at `/core`, here's what gets generated for each language:

---

## English Version (`/core`)

```html
<head>
  <!-- Primary Meta Tags -->
  <title>Core | Metaplex Developer Hub</title>
  <meta name="description" content="Learn about Metaplex Core NFT standard" />

  <!-- Canonical URL - points to itself -->
  <link rel="canonical" href="https://developers.metaplex.com/core" />

  <!-- Language Alternates (hreflang) -->
  <link rel="alternate" hreflang="en" href="https://developers.metaplex.com/core" />
  <link rel="alternate" hreflang="ja" href="https://developers.metaplex.com/ja/core" />
  <link rel="alternate" hreflang="ko" href="https://developers.metaplex.com/ko/core" />
  <link rel="alternate" hreflang="x-default" href="https://developers.metaplex.com/core" />

  <!-- Open Graph -->
  <meta property="og:title" content="Core | Metaplex Developer Hub" />
  <meta property="og:description" content="Learn about Metaplex Core NFT standard" />
  <meta property="og:url" content="https://developers.metaplex.com/core" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://developers.metaplex.com/assets/social/dev-hub-preview.jpg" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="ja_JP" />
  <meta property="og:locale:alternate" content="ko_KR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Core | Metaplex Developer Hub" />
  <meta name="twitter:description" content="Learn about Metaplex Core NFT standard" />
  <meta name="twitter:image" content="https://developers.metaplex.com/assets/social/dev-hub-preview.jpg" />
  <meta property="twitter:domain" content="developers.metaplex.com" />
</head>
```

---

## Japanese Version (`/ja/core`)

```html
<head>
  <!-- Primary Meta Tags -->
  <title>Core | Metaplex 開発者向け</title>
  <meta name="description" content="Metaplex Core NFT標準について学ぶ" />

  <!-- Canonical URL - points to ITSELF (Japanese version) -->
  <link rel="canonical" href="https://developers.metaplex.com/ja/core" />

  <!-- Language Alternates (hreflang) - SAME for all versions -->
  <link rel="alternate" hreflang="en" href="https://developers.metaplex.com/core" />
  <link rel="alternate" hreflang="ja" href="https://developers.metaplex.com/ja/core" />
  <link rel="alternate" hreflang="ko" href="https://developers.metaplex.com/ko/core" />
  <link rel="alternate" hreflang="x-default" href="https://developers.metaplex.com/core" />

  <!-- Open Graph -->
  <meta property="og:title" content="Core | Metaplex 開発者向け" />
  <meta property="og:description" content="Metaplex Core NFT標準について学ぶ" />
  <meta property="og:url" content="https://developers.metaplex.com/ja/core" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://developers.metaplex.com/assets/social/dev-hub-preview.jpg" />
  <meta property="og:locale" content="ja_JP" />
  <meta property="og:locale:alternate" content="en_US" />
  <meta property="og:locale:alternate" content="ko_KR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Core | Metaplex 開発者向け" />
  <meta name="twitter:description" content="Metaplex Core NFT標準について学ぶ" />
  <meta name="twitter:image" content="https://developers.metaplex.com/assets/social/dev-hub-preview.jpg" />
  <meta property="twitter:domain" content="developers.metaplex.com" />
</head>
```

---

## Korean Version (`/ko/core`)

```html
<head>
  <!-- Primary Meta Tags -->
  <title>Core | Metaplex 개발자 허브</title>
  <meta name="description" content="Metaplex Core NFT 표준에 대해 알아보기" />

  <!-- Canonical URL - points to ITSELF (Korean version) -->
  <link rel="canonical" href="https://developers.metaplex.com/ko/core" />

  <!-- Language Alternates (hreflang) - SAME for all versions -->
  <link rel="alternate" hreflang="en" href="https://developers.metaplex.com/core" />
  <link rel="alternate" hreflang="ja" href="https://developers.metaplex.com/ja/core" />
  <link rel="alternate" hreflang="ko" href="https://developers.metaplex.com/ko/core" />
  <link rel="alternate" hreflang="x-default" href="https://developers.metaplex.com/core" />

  <!-- Open Graph -->
  <meta property="og:title" content="Core | Metaplex 개발자 허브" />
  <meta property="og:description" content="Metaplex Core NFT 표준에 대해 알아보기" />
  <meta property="og:url" content="https://developers.metaplex.com/ko/core" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://developers.metaplex.com/assets/social/dev-hub-preview.jpg" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:locale:alternate" content="en_US" />
  <meta property="og:locale:alternate" content="ja_JP" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Core | Metaplex 개발자 허브" />
  <meta name="twitter:description" content="Metaplex Core NFT 표준에 대해 알아보기" />
  <meta name="twitter:image" content="https://developers.metaplex.com/assets/social/dev-hub-preview.jpg" />
  <meta property="twitter:domain" content="developers.metaplex.com" />
</head>
```

---

## Key SEO Principles

### 1. Self-Referential Canonicals ✅
Each language version points to **itself** as canonical:
- English canonical → English URL
- Japanese canonical → Japanese URL
- Korean canonical → Korean URL

**Why?** Tells Google these are all equally important, just in different languages.

### 2. Identical hreflang Tags ✅
**All three versions have the exact same hreflang tags** pointing to all alternates.

**Why?** Creates a complete bidirectional relationship between language versions.

### 3. Proper og:locale ✅
Each version declares its own locale and lists others as alternates:
- English: `og:locale="en_US"` + alternates for ja_JP, ko_KR
- Japanese: `og:locale="ja_JP"` + alternates for en_US, ko_KR
- Korean: `og:locale="ko_KR"` + alternates for en_US, ja_JP

**Why?** Social media platforms serve the right version when shared.

### 4. x-default for Fallback ✅
All versions include `hreflang="x-default"` pointing to English.

**Why?** If user's language isn't available, Google serves the default (English).

---

## How Search Engines Use This

### Google Search
1. **User in Japan searches in Japanese** → Serves `/ja/core`
2. **User in Korea searches in Korean** → Serves `/ko/core`
3. **User in US searches in English** → Serves `/core`
4. **User in France searches** → Serves `/core` (x-default)

### Social Media Sharing
1. **Tweet link to `/core`** → Shows English title/description
2. **Tweet link to `/ja/core`** → Shows Japanese title/description
3. **Tweet link to `/ko/core`** → Shows Korean title/description

### No Duplicate Content Penalty
Google understands these are **translations**, not duplicates, because:
- ✅ Self-referential canonicals (each points to itself)
- ✅ Complete hreflang annotations
- ✅ Proper og:locale declarations
- ✅ Different content language in actual page

---

## Validation Tools

After deployment, test with:

1. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - Check each language version

2. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - Verify og:locale tags work

3. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Confirm Twitter cards appear correctly

4. **Google Search Console**
   - Submit all language versions
   - Monitor for hreflang errors
   - Check international targeting

---

## Component Usage

All of this is handled automatically by the `SEOHead` component:

```jsx
// In _app.jsx
<SEOHead
  title={page.title}           // From markdown frontmatter
  description={page.description}
  metaTitle={page.metaTitle}
  locale={page.locale}          // Auto-detected from URL
/>
```

The component:
1. Detects current language from URL path
2. Generates all alternate URLs automatically
3. Creates proper canonical URL
4. Sets all Open Graph and Twitter tags
5. Handles hreflang bidirectional links

**Zero manual configuration needed per page!** 🎉
