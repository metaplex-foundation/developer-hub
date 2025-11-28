# Current System Analysis - Metaplex Developer Hub

**Document Date:** October 2025
**Branch:** q4-redesign
**Codebase Version:** Analyzed from commit 2cfbbd2

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Navigation System](#navigation-system)
3. [Product Organization](#product-organization)
4. [Page Rendering Pipeline](#page-rendering-pipeline)
5. [Code Display System](#code-display-system)
6. [Index Pages](#index-pages)
7. [Localization](#localization)
8. [Developer Flow Analysis](#developer-flow-analysis)
9. [Identified Pain Points](#identified-pain-points)

---

## Architecture Overview

### Core Technology Stack

```
Next.js 13.4.7
├── @markdoc/next.js      # Markdown processing
├── React 18.2.0           # UI framework
├── Tailwind CSS 3.3.2     # Styling
├── prism-react-renderer   # Syntax highlighting
└── pnpm                   # Package manager
```

### Directory Structure

```
src/
├── pages/                 # Next.js pages + markdown docs
│   ├── index.md          # Home page
│   ├── [product]/        # Product-specific docs
│   │   ├── index.md      # Product landing
│   │   ├── guides/       # Product guides
│   │   └── *.md          # Documentation pages
│   ├── ja/               # Japanese translations
│   ├── ko/               # Korean translations
│   ├── _app.jsx          # App wrapper
│   └── _document.jsx     # HTML document
├── components/
│   ├── Header.jsx        # Top navigation
│   ├── Navigation.jsx    # Sidebar navigation
│   ├── Layout.jsx        # Page layout wrapper
│   ├── Fence.jsx         # Code block renderer
│   ├── Prose.jsx         # Typography styles
│   └── products/         # Product configurations
│       ├── index.js      # Product registry
│       ├── [product]/
│       │   ├── index.js  # Product config
│       │   └── Hero.jsx  # Landing hero
│       └── Sections.jsx  # Section tabs
├── shared/
│   ├── usePage.js        # Page context hook
│   └── sections.js       # Section definitions
├── markdoc/
│   ├── nodes.js          # Custom Markdoc nodes
│   └── tags.js           # Custom Markdoc tags
└── middleware.js         # URL redirects
```

### File Statistics

- **~28,000 lines** of markdown documentation
- **20+ products** registered
- **3 languages** supported (EN, JA, KO)
- **200+ navigation links** for major products like Core

---

## Navigation System

### Component Architecture

#### 1. Header Component
**File:** `src/components/Header.jsx`

**Responsibilities:**
- Top sticky navigation bar
- Product branding with logo
- Search integration (Algolia)
- Language switcher (EN/JA/KO)
- Theme selector (light/dark)
- Social links (GitHub, Discord, X)
- Mobile hamburger menu trigger

**Key Features:**
```jsx
// Lines 38-108
<header className="sticky top-0 z-50">
  <div className="flex items-center justify-between">
    {/* Left: Logo + Product Name */}
    <Link href="/">
      <Logo />
      <div>Metaplex Developer Hub</div>
    </Link>

    {/* Center: Navigation list */}
    <NavList />

    {/* Right: Search, Language, Theme, Social */}
    <Search />
    <LanguageSwitcher />
    <ThemeSelector />
    <GitHubIcon />
    <DiscordIcon />
    <XIcon />
  </div>

  {/* Section tabs (Documentation, Guides, References) */}
  {/* Lines 110-124 */}
  <Sections
    sections={page.product.sections}
    activeSectionId={page.activeSection?.id}
  />
</header>
```

**Current Issues:**
- Section tabs are only visible on desktop (hidden on mobile)
- Product name takes up significant space
- Navigation context lost when switching products

#### 2. Navigation Component (Sidebar)
**File:** `src/components/Navigation.jsx`

**Structure:**
```jsx
// Lines 6-58
export function Navigation({ product, navigation, className }) {
  return (
    <nav>
      <ul>
        {navigation.map((section) => (
          <li key={section.title}>
            <h2>{section.title}</h2>  {/* Section header */}
            <ul>
              {section.links.map((link) => (
                <li>
                  <Link href={link.href}>
                    {link.title}
                    {/* Badges for new/updated content */}
                    {link.updated && isRecent(link.updated) && (
                      <Badge type="updated" />
                    )}
                    {link.created && isRecent(link.created) && (
                      <Badge type="new" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

**Features:**
- Flat two-level hierarchy (section → links)
- Active link highlighted with accent color
- "New" badge for content <7 days old
- "Updated" badge for recent changes
- Left border with hover states

**Limitations:**
- No nested hierarchies (max 2 levels)
- No icons or visual indicators
- All sections expanded (no collapse)
- Long lists require extensive scrolling
- No search within navigation

#### 3. MobileNavigation Component
**File:** `src/components/MobileNavigation.jsx`

**Features:**
- Hamburger menu for mobile devices
- Full navigation tree in drawer
- Same structure as desktop sidebar

**Current Issues:**
- Section tabs harder to discover on mobile
- No quick access to search on mobile

#### 4. Sections Component
**File:** `src/components/products/Sections.jsx`

**Purpose:** Tab navigation between Documentation, Guides, References, Changelog

```jsx
// Typical usage
<Sections
  sections={[
    { id: 'documentation', title: 'Documentation', href: '/core' },
    { id: 'guides', title: 'Guides', href: '/core/guides' },
    { id: 'references', title: 'API Reference', href: '/core/references' },
  ]}
  activeSectionId="documentation"
/>
```

**Current Issues:**
- Separate from sidebar navigation (cognitive split)
- Only visible on desktop in header
- Unclear what each section contains until you click

---

## Product Organization

### Product Registry
**File:** `src/components/products/index.js`

**Registered Products (20+):**

```javascript
export const productList = [
  amman,        // Testing framework
  aura,         // RWA standard
  bubblegum,    // Compressed NFTs
  bubblegumV2,  // Compressed NFTs v2
  candyMachine, // NFT minting
  cli,          // Command-line tools
  core,         // Core NFT standard
  coreCandyMachine, // Core + Candy Machine
  dasApi,       // Digital Asset Standard API
  fusion,       // Trifle program
  guides,       // Cross-product guides
  hydra,        // Fanout wallet
  inscription,  // Inscriptions
  legacyDocs,   // Old documentation
  mplHybrid,    // Hybrid assets
  shank,        // Rust macro library
  sugar,        // Candy Machine CLI
  tokenAuthRules, // Auth rules
  tokenMetadata,  // Legacy token standard
  umi,          // Framework
].sort((a, b) => a.name.localeCompare(b.name))
```

**Product Categories:**
- **MPL** (Metaplex Protocol Library): Core, Token Metadata, etc.
- **Dev Tools**: UMI, Sugar CLI, Amman, Shank
- **APIs**: DAS API
- **Legacy**: Old documentation versions

### Product Configuration Pattern

**Example:** `src/components/products/core/index.js`

```javascript
export default {
  name: 'Core',
  headline: 'Next gen NFT standard',
  description: 'Create, manage, and interact with NFTs using Core',
  path: 'core',
  icon: CubeIcon,                    // Heroicon
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',          // Theme color
  navigationMenuCatergory: 'mpl',     // Category

  // Navigation structure (200+ lines for Core)
  navigation: [
    {
      title: 'Introduction',
      links: [
        { title: 'Overview', href: '/core' },
        { title: 'Getting Started', href: '/core/getting-started' },
        // ...
      ],
    },
    {
      title: 'Features',
      links: [
        { title: 'Creating Assets', href: '/core/create-asset' },
        { title: 'Fetching Assets', href: '/core/fetch' },
        // ...
      ],
    },
    // Multiple sections...
  ],

  // Section definitions
  sections: [
    { id: 'documentation', title: 'Documentation', href: '/core' },
    { id: 'guides', title: 'Guides', href: '/core/guides' },
    { id: 'references', title: 'References', href: '/core/references' },
  ],

  // Hero component for landing page
  heroes: {
    documentation: CoreHero,
  },

  // Localization
  localizedNavigation: {
    EN: { /* English strings */ },
    JA: { /* Japanese strings */ },
    KO: { /* Korean strings */ },
  },
}
```

**Strengths:**
- Centralized product configuration
- Easy to add new products
- Consistent structure across products
- Built-in localization support

**Weaknesses:**
- Large configuration files (200+ lines)
- Manual navigation maintenance
- No automatic TOC generation
- Duplication across languages

---

## Page Rendering Pipeline

### 1. Request Flow

```
User visits /core/create-asset
    ↓
middleware.js (redirects if needed)
    ↓
Next.js routing (pages/core/create-asset.md)
    ↓
Markdoc processing (markdoc/nodes.js, tags.js)
    ↓
_app.jsx (LocaleProvider, DialectProvider)
    ↓
Layout component (usePage hook)
    ↓
Rendered page with navigation, content, TOC
```

### 2. usePage Hook
**File:** `src/shared/usePage.js`

**Key Functions:**

```javascript
// Determine active product from URL
function getActiveProduct(pathname, productList) {
  // Matches /core/* to core product
  // Returns product config object
}

// Determine active section (docs/guides/references)
function getActiveSection(pathname, product) {
  // Matches /core/guides/* to guides section
  // Returns section config object
}

// Get appropriate hero component
function getActiveHero(activeSection, product) {
  // Returns hero component for landing pages
}

// Parse markdown headings into TOC
function parseTableOfContents(markdocContent) {
  // Extracts h2, h3 for table of contents
}

// Apply localizations
function localizeProduct(product, locale) {
  // Translates product config to EN/JA/KO
}
```

**Data Flow:**
```javascript
const page = {
  product: getActiveProduct(pathname, productList),
  activeSection: getActiveSection(pathname, product),
  hero: getActiveHero(activeSection, product),
  navigation: localizeProduct(product.navigation, locale),
  tableOfContents: parseTableOfContents(content),
  title: frontmatter.title,
  description: frontmatter.description,
}
```

### 3. Layout Component
**File:** `src/components/Layout.jsx`

**Renders:**
```jsx
<Layout>
  <Header page={page} />

  <div className="flex">
    <aside>
      <Navigation product={page.product} navigation={page.navigation} />
    </aside>

    <main>
      {page.hero && <Hero />}
      <Prose>{children}</Prose>
      <PrevNextLinks />
    </main>

    <aside>
      <TableOfContents toc={page.tableOfContents} />
    </aside>
  </div>
</Layout>
```

---

## Code Display System

### 1. Fence Component
**File:** `src/components/Fence.jsx`

**Current Implementation:**

```jsx
export function Fence({ children, language }) {
  return (
    <Highlight
      code={children.trimEnd()}
      language={language}
      theme={undefined}  // Uses CSS theme
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre className={className + ' scrollbar relative'} style={style}>
          {/* Copy button in top-right */}
          <CopyToClipboardButton text={children} />

          <code>
            {/* Render syntax highlighted tokens */}
            {tokens.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line.filter((token) => !token.empty).map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
                {'\n'}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  )
}
```

**Supported Languages:**
- JavaScript
- Rust
- TypeScript
- Kotlin (`prismjs/components/prism-kotlin`)
- C# (`prismjs/components/prism-csharp`)
- Java (`prismjs/components/prism-java`)
- PHP (`prismjs/components/prism-php`)
- Ruby (`prismjs/components/prism-ruby`)

**Features:**
✅ Syntax highlighting via Prism
✅ Copy-to-clipboard button
✅ Dark/light theme support
✅ Custom scrollbar styling

**Missing:**
❌ Multi-language tabs
❌ Line numbers
❌ Line highlighting
❌ Code folding
❌ Run/execute functionality
❌ Context (imports, setup)

### 2. CopyToClipboardButton Component
**File:** `src/components/products/CopyToClipboard.jsx`

**Functionality:**
- Copies code to clipboard
- Shows "Copied!" feedback
- Positioned in top-right of code block

### 3. Markdoc Configuration

**File:** `markdoc/nodes.js`

```javascript
export const nodes = {
  fence: {
    render: 'Fence',
    attributes: {
      language: {
        type: String,
        default: 'javascript',
      },
    },
  },
  // ... other nodes
}
```

**File:** `markdoc/tags.js`

**Custom Tags:**
- `{% callout %}` - Note/warning boxes
- `{% code-block %}` - Enhanced code blocks
- `{% dialect-switcher %}` - Language toggle (JS/Rust)
- `{% quick-links %}` / `{% quick-link %}` - Navigation cards
- `{% figure %}` / `{% image %}` - Images
- `{% video %}` - Video embeds
- `{% totem %}` / `{% totem-accordion %}` - Expandable sections

**dialect-switcher Usage:**
```markdown
{% dialect-switcher %}
{% dialect title="JavaScript" id="js" %}
```javascript
const result = await create(umi, { ... })
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
let result = create_v1(ctx.accounts, args)?;
```
{% /dialect %}
{% /dialect-switcher %}
```

---

## Index Pages

### 1. Home Page
**File:** `src/pages/index.md`

**Current Content:**
```markdown
---
title: Introduction
metaTitle: Metaplex Developer Hub
description: One place for all Metaplex developer resources.
---

The Metaplex Protocol is a decentralized platform... [description]

Known for powering digital assets including NFTs, fungible tokens, RWAs,
gaming assets, DePIN assets and more, Metaplex is one of the most widely
used blockchain protocols and developer platforms, with over 881 million
assets minted across 10.2 million unique signers and a transaction volume
of over $9.7B.

On the following page you can find Metaplex's programs and tools...
```

**Rendering:**
- Uses base Layout component
- No custom hero
- Renders as standard markdown content
- Product grid component shows all products

**Issues:**
❌ No clear entry point for beginners
❌ No quick start paths
❌ Stats buried in paragraph
❌ No visual hierarchy
❌ Generic call-to-action

### 2. Product Index Pages
**Example:** `src/pages/core/index.md`

**Pattern:**
```markdown
---
title: Core
description: Next generation NFT standard
---

# Metaplex Core

[Introduction paragraph]

## Quick Links

{% quick-links %}
{% quick-link title="Getting Started" href="/core/getting-started" %}
{% quick-link title="Creating Assets" href="/core/create-asset" %}
{% quick-link title="API Reference" href="/core/references" %}
{% /quick-links %}
```

**Hero Component:** `src/components/products/core/Hero.jsx`

```jsx
const codeProps = {
  tabs: [
    { name: 'metadata.rs', isActive: true },
    { name: 'off-chain-metadata.json', isActive: false },
  ],
  language: 'rust',
  code: `pub struct Asset {
    pub key: Key,
    pub owner: Pubkey,
    // ...
  }`,
}

export function Hero({ page }) {
  return (
    <BaseHero page={page}>
      <HeroCode {...codeProps}></HeroCode>
    </BaseHero>
  )
}
```

**Strengths:**
✅ Clean hero with code preview
✅ Quick links for navigation
✅ Product-specific branding

**Weaknesses:**
❌ Hero code is static (fake tabs)
❌ No "what you'll learn" preview
❌ No use case examples
❌ No difficulty indicators

### 3. Guide Index Pages
**Example:** `src/pages/core/guides/index.md`

**Current Pattern:**
```markdown
---
title: Guides
metaTitle: Guides | Core
description: A list of guides for MPL Core
---

The following Guides for MPL Core are currently available:

{% quick-links %}
{% quick-link
  title="Soulbound NFT"
  icon="CodeBracketSquare"
  href="/core/guides/create-soulbound-nft-asset"
  description="Different options for Soulbound NFT including code examples"
/%}
{% quick-link
  title="Print Editions"
  icon="CodeBracketSquare"
  href="/core/guides/print-editions"
  description="Learn how to combine plugins to create Editions"
/%}
<!-- ... more quick-links -->
{% /quick-links %}
```

**Strengths:**
✅ Clean card-based layout
✅ Icons for visual interest
✅ Brief descriptions

**Weaknesses:**
❌ No categorization (all flat list)
❌ No difficulty indicators
❌ No time estimates
❌ No language/tech stack tags
❌ No search/filter functionality

---

## Localization

### Multi-Language Support

**Supported Languages:**
- English (EN) - Default
- Japanese (JA) - `/ja/*` paths
- Korean (KO) - `/ko/*` paths

### Implementation

**1. URL-Based Locale Detection**
`src/pages/_document.jsx`

```jsx
const locale = ctx.pathname.startsWith('/ja')
  ? 'ja'
  : ctx.pathname.startsWith('/ko')
  ? 'ko'
  : 'en'
```

**2. Product Localization**
Each product configuration includes:

```javascript
localizedNavigation: {
  EN: {
    'Creating Assets': 'Creating Assets',
    'Fetching Assets': 'Fetching Assets',
    // ...
  },
  JA: {
    'Creating Assets': 'アセットの作成',
    'Fetching Assets': 'アセットの取得',
    // ...
  },
  KO: {
    'Creating Assets': '에셋 생성',
    'Fetching Assets': '에셋 가져오기',
    // ...
  },
}
```

**3. Localized Pages**
- English: `src/pages/core/index.md`
- Japanese: `src/pages/ja/core/index.md`
- Korean: `src/pages/ko/core/index.md`

### Current State

**Coverage:**
- ✅ Japanese: Root index page (`/ja/index.md`)
- ✅ Korean: Root index page (`/ko/index.md`)
- ⚠️ Partial product translations (not all products have JA/KO versions)
- ⚠️ Navigation strings translated
- ⚠️ Content pages vary by product

---

## Developer Flow Analysis

### Path 1: Product-Specific Learning

```
1. Visit metaplex.com/core
   └─ Lands on: /core (index page)

2. See hero with code snippet
   └─ Static Rust struct preview

3. Quick links section
   └─ Click "Getting Started"

4. Navigate to /core/getting-started
   └─ Sidebar shows all navigation
   └─ Can see 20+ links in "Features" section

5. Read documentation
   └─ Copy code snippets
   └─ Click "Next" at bottom

6. Iterate through pages
```

**Friction Points:**
- No clear "start here" for beginners
- Overwhelming sidebar for large products
- Must know what they're looking for
- Code examples lack full context

### Path 2: Guide-Based Learning

```
1. Visit /guides (aggregate guides)
   └─ See guideIndexComponent with all guides

2. Browse categories
   └─ "Solana Basics", "JavaScript", "Rust", "Templates"

3. Click guide (e.g., "Create Core Asset with JavaScript")
   └─ Navigate to /core/guides/javascript/how-to-create-...

4. Follow step-by-step tutorial
   └─ Copy code snippets
   └─ Work through example

5. Return to guides index or product docs
```

**Friction Points:**
- Guide index shows ALL guides (cluttered)
- No filtering by difficulty/tech stack
- Hard to find related guides
- No indication of guide length

### Path 3: Search-Driven

```
1. Arrive at any page

2. Use search (Algolia)
   └─ Type query (e.g., "create nft")

3. See search results
   └─ Click result

4. Land on documentation page
   └─ May be mid-product docs
   └─ Sidebar shows context

5. Navigate via sidebar or breadcrumbs
```

**Friction Points:**
- Search results may land deep in docs
- No context about where you are in structure
- May miss related content

---

## Identified Pain Points

### 1. Navigation Hierarchy Unclear

**Problem:**
- Section tabs (Docs/Guides/References) separate from sidebar
- Flat navigation structure (only 2 levels)
- No visual indicators of content type
- All sections always expanded

**Impact:**
- Developers unsure where to find what they need
- Cognitive overhead switching between tabs and sidebar
- Long scrolling on products with many docs

**Evidence:**
- Navigation.jsx:22-54 shows flat structure
- Header.jsx:110-124 shows separate section tabs
- No collapsible groups or nested hierarchies

### 2. Code Examples Lack Context

**Problem:**
- Single language per code block
- No imports or setup shown
- Copy button only copies visible code
- No indication of full working example

**Impact:**
- Developers must piece together multiple snippets
- Unclear dependencies and imports
- Copy-paste may not work without context
- Increased support questions

**Evidence:**
- Fence.jsx:12-39 only renders provided code
- CopyToClipboardButton copies exactly what's shown
- No automatic context injection

### 3. Index Pages Lack Structure

**Problem:**
- Home page is generic text
- Product index pages use simple quick-links
- Guide index pages show flat list
- No role-based entry points

**Impact:**
- New developers don't know where to start
- No "quick wins" to get code running fast
- Can't discover related content easily

**Evidence:**
- index.md:1-10 shows minimal home page
- core/guides/index.md:1-27 shows flat guide list
- No quick start paths or difficulty indicators

### 4. No Interactive Learning

**Problem:**
- All code is static
- No way to test code without local setup
- No visual representation of code flow
- No interactive tutorials

**Impact:**
- Higher barrier to entry
- Can't experiment before committing
- Unclear what code actually does
- Steeper learning curve

**Evidence:**
- Fence.jsx has no execution capability
- No playground or sandbox integration
- No visual diagrams in codebase

### 5. Limited Multi-Language Support for Code

**Problem:**
- Each code block is single language
- dialect-switcher exists but not widely used
- No persistent language preference
- Manual tagging required

**Impact:**
- Rust developers must scroll past JS examples
- JavaScript developers see Rust they don't need
- Repetitive documentation
- Poor DX for multi-language users

**Evidence:**
- Fence.jsx:12 accepts single language parameter
- dialect-switcher tag exists but usage is limited
- No localStorage for language preference

### 6. Mobile Experience Gaps

**Problem:**
- Section tabs hidden on mobile
- Search less prominent
- TOC sidebar not accessible
- Long navigation requires extensive scrolling

**Impact:**
- Developers on mobile (especially in regions with mobile-first internet) have degraded experience
- Can't easily reference docs on smaller screens

**Evidence:**
- Header.jsx:110 shows sections hidden on mobile (`hidden md:flex`)
- No mobile-optimized TOC

### 7. Discovery Challenges

**Problem:**
- No visual product relationships
- Hard to see "what's possible"
- Can't filter by use case
- No trending/popular content indicators

**Impact:**
- Developers may miss relevant products
- Don't know what Metaplex can do
- Duplicate work (reinventing existing solutions)

**Evidence:**
- No product relationship visualization
- No analytics-driven content surfacing
- Badge system exists but underutilized (Navigation.jsx:43-48)

---

## Strengths to Preserve

### 1. Product Configuration System
- Centralized, maintainable
- Easy to add new products
- Consistent structure
- Keep this pattern

### 2. Markdoc Integration
- Powerful custom tags
- Good developer experience for content authors
- Separation of content and presentation
- Preserve and extend

### 3. Localization Architecture
- URL-based locale detection
- Product-level translation configs
- Clean separation of languages
- Build on this foundation

### 4. Design System Consistency
- Accent colors per product
- Dark mode support
- Typography plugin
- Maintain and enhance

### 5. Badge System
- "New" and "Updated" badges work well
- Could be expanded to other indicators
- Good foundation for content discovery

---

## Technical Debt

### 1. Next.js Version
- Currently on 13.4.7
- App Router exists but not used
- Consider upgrade path for future

### 2. Prism Integration
- Multiple Prism imports scattered
- Could be centralized
- Consider alternatives (Shiki, Highlight.js)

### 3. Component Organization
- Some components in `/products` that aren't product-specific
- Could benefit from reorganization
- Maintain backwards compatibility

### 4. Middleware Usage
- Currently only used for redirects
- Could handle more (auth, analytics, etc.)
- Opportunity for enhancement

---

## Metrics & Analytics

### Current Implementation

**Hotjar:**
- User session recording
- Heatmaps
- Feedback polls

**Google Analytics:**
- Page views
- User flow
- Traffic sources

**Algolia DocSearch:**
- Search queries
- Search results clicked
- Popular searches

### Missing Metrics

- Code snippet copy rate
- Navigation patterns
- Time to first copy
- Language preference distribution
- Mobile vs desktop usage per section
- Guide completion rate
- Most popular guides

**Recommendation:** Implement custom event tracking for redesign metrics

---

## Summary

The current Metaplex Developer Hub is a solid foundation with:
- ✅ Good product organization system
- ✅ Powerful Markdoc integration
- ✅ Strong localization support
- ✅ Consistent design system

However, it has key opportunities for improvement:
- ❌ Navigation hierarchy unclear
- ❌ Code examples lack context
- ❌ Index pages lack structure
- ❌ No interactive learning
- ❌ Limited multi-language code support

The redesign will build on the strengths while addressing these pain points, with a focus on **code-first experience**, **clear navigation**, and **developer empathy**.

---

## Related Documents

- [Redesign Overview](./REDESIGN_OVERVIEW.md)
- [Navigation Redesign Proposal](./NAVIGATION_REDESIGN.md)
- [Code Experience Redesign](./CODE_EXPERIENCE_REDESIGN.md)
- [Index Pages Redesign](./INDEX_PAGES_REDESIGN.md)

---

**Last Updated:** 2025-10-27
**Analyzed By:** Claude
**Next Review:** Before Phase 1 implementation
