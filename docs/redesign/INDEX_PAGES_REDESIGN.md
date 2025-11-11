# Index Pages Redesign

**Document Date:** October 2025
**Status:** Proposed
**Priority:** Phase 3

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Design Principles](#design-principles)
3. [Home Page Redesign](#home-page-redesign)
4. [Product Index Pages](#product-index-pages)
5. [Guide Index Pages](#guide-index-pages)
6. [Component Specifications](#component-specifications)
7. [Implementation Plan](#implementation-plan)

---

## Problem Statement

### Current Issues

From [CURRENT_ANALYSIS.md](./CURRENT_ANALYSIS.md#3-index-pages-lack-structure):

**Home Page (`/index.md`):**
- ❌ Generic text introduction
- ❌ No clear entry points for different user types
- ❌ Stats buried in paragraph
- ❌ No visual product showcase
- ❌ No "getting started" paths

**Product Index Pages (`/core/index.md`):**
- ⚠️ Simple quick-links for navigation
- ⚠️ Static hero code (fake tabs)
- ❌ No use case examples
- ❌ No difficulty indicators
- ❌ No "what you'll learn" preview

**Guide Index Pages (`/core/guides/index.md`):**
- ❌ Flat list of all guides
- ❌ No categorization by use case or difficulty
- ❌ No time estimates
- ❌ No tech stack tags (JS/Rust/Anchor)
- ❌ No search/filter functionality

### User Impact

**From user research:**
- ⭐ **PRIMARY GOAL:** "Quick start paths"
- Developers want role-based entry points ("Launch NFTs", "Build Games")
- Need to see code examples immediately
- Want to know time investment upfront

**Target:** Guide developers from landing to writing code in <5 minutes

---

## Design Principles

### 1. Role-Based Entry Points
> "Show me what I can build, not what tools exist"

Instead of:
> "Here are our 20 products"

Show:
> "Launch an NFT collection" → Uses Core + Candy Machine
> "Build a game" → Uses Core + Inscription + Fusion

### 2. Progressive Disclosure
> "Quick start now, deep dive later"

- Hero section: 5-minute quick starts
- Below fold: Product showcase
- Further down: Latest updates, community

### 3. Visual Hierarchy
> "Code first, explanations second"

- Show working code in hero
- Visual product cards
- Screenshot/video previews

### 4. Set Expectations
> "Tell me how long this will take"

- Time estimates on all paths
- Difficulty indicators
- Prerequisites listed
- Tech stack badges

---

## Home Page Redesign

### Current State

```markdown
# Introduction

The Metaplex Protocol is a decentralized platform...
[paragraph of text]

On the following page you can find Metaplex's programs and tools...
```

### Proposed Structure

```
┌─────────────────────────────────────────────────┐
│ HERO SECTION                                    │
│                                                 │
│ What do you want to build?                      │
│                                                 │
│ ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│ │ Launch NFTs │  │ Build Games │  │ Create   │ │
│ │ (5 min)     │  │ (10 min)    │  │ Tokens   │ │
│ │             │  │             │  │ (3 min)  │ │
│ │ ```js       │  │ ```js       │  │ ```js    │ │
│ │ create(...) │  │ mint(...)   │  │ create() │ │
│ │ ```         │  │ ```         │  │ ```      │ │
│ └─────────────┘  └─────────────┘  └──────────┘ │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EXPLORE PRODUCTS                                │
│                                                 │
│ Digital Assets      DeFi Tools      Dev Tools  │
│ • Core             • Hybrid         • UMI       │
│ • Candy Machine    • Fusion         • Sugar CLI │
│ • Bubblegum        • Token Metadata • Amman     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ WHAT'S NEW                                      │
│                                                 │
│ • [NEW] Core 1.1 Released - Performance...      │
│ • [GUIDE] Build a Staking Platform with...     │
│ • [UPDATE] Candy Machine Guards Enhancement    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ BY THE NUMBERS                                  │
│                                                 │
│ 881M+ Assets   10.2M+ Signers   $9.7B+ Volume  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ COMMUNITY                                       │
│                                                 │
│ • Join Discord                                  │
│ • Contribute on GitHub                          │
│ • Follow on X                                   │
└─────────────────────────────────────────────────┘
```

### Hero Section: Quick Start Paths

**Component:** `QuickStartPaths.jsx`

```jsx
const quickStarts = [
  {
    title: 'Launch NFT Collection',
    description: 'Create and mint your first NFT collection',
    time: '5 min',
    difficulty: 'beginner',
    products: ['Core', 'Candy Machine'],
    href: '/guides/quick-start/launch-nft-collection',
    code: `import { create } from '@metaplex-foundation/mpl-core'

const asset = await create(umi, {
  name: 'My First NFT',
  uri: 'https://example.com/nft.json'
}).sendAndConfirm(umi)`,
    languages: ['JavaScript', 'Rust', 'Kotlin'],
  },
  {
    title: 'Build Gaming Assets',
    description: 'Create dynamic in-game items with plugins',
    time: '10 min',
    difficulty: 'intermediate',
    products: ['Core', 'Inscription'],
    href: '/guides/quick-start/gaming-assets',
    code: `const gameItem = await create(umi, {
  name: 'Legendary Sword',
  plugins: [attributesPlugin]
}).sendAndConfirm(umi)`,
    languages: ['JavaScript', 'Rust'],
  },
  {
    title: 'Issue Tokens',
    description: 'Create fungible tokens on Solana',
    time: '3 min',
    difficulty: 'beginner',
    products: ['Token Metadata'],
    href: '/guides/quick-start/create-tokens',
    code: `const token = await createFungible(umi, {
  name: 'My Token',
  symbol: 'MTK'
}).sendAndConfirm(umi)`,
    languages: ['JavaScript'],
  },
]

export function QuickStartPaths() {
  return (
    <section className="quick-start-paths">
      <h2>What do you want to build?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStarts.map((qs) => (
          <QuickStartCard key={qs.title} {...qs} />
        ))}
      </div>
    </section>
  )
}
```

**QuickStartCard Component:**

```jsx
function QuickStartCard({
  title,
  description,
  time,
  difficulty,
  products,
  href,
  code,
  languages,
}) {
  return (
    <Link href={href} className="quick-start-card">
      <div className="card-header">
        <h3>{title}</h3>
        <div className="metadata">
          <Badge>{time}</Badge>
          <Badge variant={difficulty}>{difficulty}</Badge>
        </div>
      </div>

      <p className="description">{description}</p>

      <div className="products">
        {products.map((product) => (
          <ProductBadge key={product} product={product} />
        ))}
      </div>

      <div className="code-preview">
        <pre><code className="language-javascript">{code}</code></pre>
      </div>

      <div className="languages">
        {languages.map((lang) => (
          <LanguageIcon key={lang} language={lang} />
        ))}
      </div>

      <div className="cta">
        <span>Get Started</span>
        <ArrowRightIcon />
      </div>
    </Link>
  )
}
```

**Styling:**

```css
.quick-start-card {
  @apply block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg;
  @apply hover:shadow-xl hover:-translate-y-1 transition-all;
  @apply border-2 border-transparent hover:border-accent-500;
}

.card-header {
  @apply flex items-start justify-between mb-3;
}

.card-header h3 {
  @apply text-xl font-semibold text-slate-900 dark:text-white;
}

.metadata {
  @apply flex gap-2;
}

.description {
  @apply text-sm text-slate-600 dark:text-slate-400 mb-4;
}

.code-preview {
  @apply bg-slate-900 dark:bg-slate-950 rounded-lg p-4 mb-4;
  @apply overflow-hidden max-h-32;
}

.code-preview pre {
  @apply text-xs font-mono text-slate-100;
}

.cta {
  @apply flex items-center gap-2 text-accent-600 dark:text-accent-400 font-medium;
}
```

### Product Showcase

**Component:** `ProductShowcase.jsx`

```jsx
const productCategories = [
  {
    name: 'Digital Assets',
    description: 'NFTs and digital collectibles',
    products: ['core', 'candyMachine', 'bubblegum', 'tokenMetadata'],
  },
  {
    name: 'DeFi & Advanced',
    description: 'Financial primitives and composability',
    products: ['fusion', 'mplHybrid', 'tokenAuthRules'],
  },
  {
    name: 'Developer Tools',
    description: 'Build faster with our tooling',
    products: ['umi', 'sugar', 'amman', 'cli'],
  },
]

export function ProductShowcase({ productList }) {
  return (
    <section className="product-showcase">
      <h2>Explore Metaplex Products</h2>

      <div className="categories">
        {productCategories.map((category) => (
          <div key={category.name} className="category">
            <h3>{category.name}</h3>
            <p>{category.description}</p>

            <div className="products-grid">
              {category.products.map((productPath) => {
                const product = productList.find((p) => p.path === productPath)
                return <ProductCard key={productPath} product={product} />
              })}
            </div>
          </div>
        ))}
      </div>

      <Link href="/products" className="view-all">
        View All Products →
      </Link>
    </section>
  )
}

function ProductCard({ product }) {
  return (
    <Link href={`/${product.path}`} className="product-card">
      {React.cloneElement(product.icon, {
        className: 'h-8 w-8 text-accent-500',
      })}
      <h4>{product.name}</h4>
      <p>{product.headline}</p>
    </Link>
  )
}
```

### What's New Feed

**Component:** `WhatsNew.jsx`

```jsx
export function WhatsNew({ items }) {
  return (
    <section className="whats-new">
      <h2>What's New</h2>

      <div className="feed">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="feed-item">
            <Badge type={item.type}>{item.type}</Badge>
            <div className="content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <time>{item.date}</time>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/changelog" className="view-all">
        View Full Changelog →
      </Link>
    </section>
  )
}
```

**Data Source:**

```javascript
// Fetch from GitHub releases, blog, or static JSON
const whatsNewItems = [
  {
    type: 'new',
    title: 'Core 1.1 Released',
    description: 'Performance improvements and new lifecycle hooks',
    date: 'Oct 20, 2025',
    href: '/core/changelog#v1.1',
  },
  {
    type: 'guide',
    title: 'Build a Staking Platform with Core',
    description: 'Step-by-step tutorial for creating a staking dApp',
    date: 'Oct 18, 2025',
    href: '/core/guides/staking-platform',
  },
  // ...
]
```

### By the Numbers

**Component:** `MetaplexStats.jsx`

```jsx
export function MetaplexStats() {
  return (
    <section className="stats">
      <h2>By the Numbers</h2>
      <div className="grid grid-cols-3 gap-8">
        <Stat
          value="881M+"
          label="Assets Minted"
          icon={CubeIcon}
        />
        <Stat
          value="10.2M+"
          label="Unique Signers"
          icon={UsersIcon}
        />
        <Stat
          value="$9.7B+"
          label="Transaction Volume"
          icon={CurrencyDollarIcon}
        />
      </div>
    </section>
  )
}

function Stat({ value, label, icon: Icon }) {
  return (
    <div className="stat">
      <Icon className="h-12 w-12 text-accent-500 mb-2" />
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  )
}
```

---

## Product Index Pages

### Current State

**Example: `/core/index.md`**

```markdown
# Metaplex Core

[Intro paragraph]

{% quick-links %}
{% quick-link title="Getting Started" href="/core/getting-started" /%}
{% quick-link title="Creating Assets" href="/core/create-asset" /%}
{% quick-link title="API Reference" href="/core/references" /%}
{% /quick-links %}
```

### Proposed Structure

```
┌─────────────────────────────────────────────────┐
│ HERO (Interactive)                              │
│                                                 │
│ Core - Next Generation NFT Standard             │
│                                                 │
│ [JavaScript] [Rust] [Kotlin]           Run ▶    │
│ ┌─────────────────────────────────────────────┐ │
│ │ const asset = await create(umi, {           │ │
│ │   name: 'My NFT',                           │ │
│ │   uri: 'https://...'                        │ │
│ │ })                                          │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [Get Started in 5 Min →]  [View Docs →]        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ QUICK START                                     │
│                                                 │
│ ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│ │ Installation│  │ First Asset │  │ Plugins  │ │
│ │ 2 min       │  │ 5 min       │  │ 10 min   │ │
│ └─────────────┘  └─────────────┘  └──────────┘ │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ POPULAR USE CASES                               │
│                                                 │
│ 🎨 NFT Collections    → Launch a collection     │
│ 🔒 Soulbound Tokens   → Non-transferable NFTs   │
│ 📦 Print Editions     → Limited edition prints  │
│ 🎮 Gaming Assets      → Dynamic game items      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EXPLORE FEATURES                                │
│                                                 │
│ [Grid of feature cards with icons]              │
│ • Creating Assets  • Collections  • Plugins     │
│ • Updating         • Transfers    • Burning     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ API REFERENCE                                   │
│                                                 │
│ [Searchable function list]                      │
│ • create()    • update()    • transfer()        │
└─────────────────────────────────────────────────┘
```

### Interactive Hero

**Enhanced Hero Component:**

```jsx
export function ProductHero({ product, codeExamples }) {
  const [activeLanguage, setActiveLanguage] = useState('javascript')
  const [showPlayground, setShowPlayground] = useState(false)

  return (
    <div className="product-hero">
      <div className="hero-content">
        <h1>{product.name}</h1>
        <p className="headline">{product.headline}</p>
        <p className="description">{product.description}</p>

        <div className="cta-buttons">
          <Button href={`/${product.path}/getting-started`} variant="primary">
            Get Started in 5 Min →
          </Button>
          <Button href={`/${product.path}`} variant="secondary">
            View Documentation
          </Button>
        </div>
      </div>

      <div className="hero-code">
        {showPlayground ? (
          <LiveCode
            code={codeExamples[activeLanguage]}
            language={activeLanguage}
          />
        ) : (
          <CodeTabs
            defaultLanguage={activeLanguage}
            onChange={setActiveLanguage}
          >
            {Object.entries(codeExamples).map(([lang, code]) => (
              <CodeTab key={lang} language={lang} label={lang}>
                {code}
              </CodeTab>
            ))}
          </CodeTabs>
        )}

        <button
          onClick={() => setShowPlayground(!showPlayground)}
          className="playground-toggle"
        >
          {showPlayground ? 'View Code' : 'Try Live ▶'}
        </button>
      </div>
    </div>
  )
}
```

### Use Case Cards

**Component:** `UseCaseCards.jsx`

```jsx
const useCases = [
  {
    title: 'NFT Collections',
    icon: '🎨',
    description: 'Launch a complete NFT collection',
    href: '/core/guides/nft-collection',
    difficulty: 'beginner',
    time: '15 min',
  },
  {
    title: 'Soulbound Tokens',
    icon: '🔒',
    description: 'Create non-transferable NFTs',
    href: '/core/guides/soulbound-nft',
    difficulty: 'intermediate',
    time: '10 min',
  },
  // ...
]

export function UseCaseCards({ useCases }) {
  return (
    <section className="use-cases">
      <h2>Popular Use Cases</h2>
      <div className="cards-grid">
        {useCases.map((useCase) => (
          <UseCaseCard key={useCase.title} {...useCase} />
        ))}
      </div>
    </section>
  )
}
```

---

## Guide Index Pages

### Current State

**Example: `/core/guides/index.md`**

```markdown
# Guides

The following Guides for MPL Core are currently available:

{% quick-links %}
{% quick-link title="Soulbound NFT" href="..." /%}
{% quick-link title="Print Editions" href="..." /%}
<!-- ... more links -->
{% /quick-links %}
```

### Proposed Structure

```
┌─────────────────────────────────────────────────┐
│ HEADER                                          │
│                                                 │
│ Core Guides                                     │
│ Learn how to build with Metaplex Core           │
│                                                 │
│ [Filter: All ▼] [Search guides...]              │
│ [🔰 Beginner] [📈 Intermediate] [🚀 Advanced]   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ BEGINNER GUIDES (3)                             │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🔰 Create Your First NFT          [POPULAR] │ │
│ │ Learn the basics of creating NFTs with Core │ │
│ │ ⏱ 5 min  💻 JavaScript  ⭐ 4.8/5           │ │
│ │                                             │ │
│ │ ```js                                       │ │
│ │ const asset = await create(...)             │ │
│ │ ```                                         │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [More beginner guides...]                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ INTERMEDIATE GUIDES (6)                         │
│                                                 │
│ [Guide cards...]                                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ADVANCED GUIDES (3)                             │
│                                                 │
│ [Guide cards...]                                │
└─────────────────────────────────────────────────┘
```

### Enhanced Guide Cards

**Component:** `GuideCard.jsx`

```jsx
function GuideCard({
  title,
  description,
  href,
  difficulty,
  time,
  languages,
  rating,
  views,
  badge,
  preview,
  tags,
}) {
  return (
    <Link href={href} className="guide-card">
      <div className="card-header">
        <DifficultyBadge level={difficulty} />
        <h3>{title}</h3>
        {badge && <Badge type={badge}>{badge}</Badge>}
      </div>

      <p className="description">{description}</p>

      {preview && (
        <div className="code-preview">
          <pre><code>{preview}</code></pre>
        </div>
      )}

      <div className="metadata">
        <MetaItem icon={ClockIcon}>{time}</MetaItem>
        {languages.map((lang) => (
          <LanguageIcon key={lang} language={lang} />
        ))}
        {rating && (
          <MetaItem icon={StarIcon}>
            {rating}/5
          </MetaItem>
        )}
        {views && (
          <MetaItem icon={EyeIcon}>
            {formatViews(views)}
          </MetaItem>
        )}
      </div>

      {tags && (
        <div className="tags">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
    </Link>
  )
}
```

### Filter & Search

**Component:** `GuideFilters.jsx`

```jsx
export function GuideFilters({ onFilterChange }) {
  const [difficulty, setDifficulty] = useState('all')
  const [language, setLanguage] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleFilterChange = () => {
    onFilterChange({ difficulty, language, searchQuery })
  }

  return (
    <div className="guide-filters">
      <div className="search-bar">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search guides..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            handleFilterChange()
          }}
        />
      </div>

      <div className="filter-buttons">
        <FilterButton
          active={difficulty === 'all'}
          onClick={() => {
            setDifficulty('all')
            handleFilterChange()
          }}
        >
          All
        </FilterButton>
        <FilterButton
          active={difficulty === 'beginner'}
          onClick={() => {
            setDifficulty('beginner')
            handleFilterChange()
          }}
        >
          🔰 Beginner
        </FilterButton>
        <FilterButton
          active={difficulty === 'intermediate'}
          onClick={() => {
            setDifficulty('intermediate')
            handleFilterChange()
          }}
        >
          📈 Intermediate
        </FilterButton>
        <FilterButton
          active={difficulty === 'advanced'}
          onClick={() => {
            setDifficulty('advanced')
            handleFilterChange()
          }}
        >
          🚀 Advanced
        </FilterButton>
      </div>

      <select
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value)
          handleFilterChange()
        }}
        className="language-filter"
      >
        <option value="all">All Languages</option>
        <option value="javascript">JavaScript</option>
        <option value="rust">Rust</option>
        <option value="kotlin">Kotlin</option>
      </select>
    </div>
  )
}
```

---

## Component Specifications

### 1. QuickStartPaths

```typescript
interface QuickStartPathsProps {
  paths: QuickStartPath[]
}

interface QuickStartPath {
  title: string
  description: string
  time: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  products: string[]
  href: string
  code: string
  languages: string[]
  icon?: React.ComponentType
}
```

### 2. ProductShowcase

```typescript
interface ProductShowcaseProps {
  productList: Product[]
  categories?: ProductCategory[]
}

interface ProductCategory {
  name: string
  description: string
  products: string[] // product paths
}
```

### 3. GuideCard

```typescript
interface GuideCardProps {
  title: string
  description: string
  href: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  time: string
  languages: string[]
  rating?: number
  views?: number
  badge?: 'new' | 'updated' | 'popular'
  preview?: string
  tags?: string[]
}
```

### 4. ProductHero

```typescript
interface ProductHeroProps {
  product: Product
  codeExamples: Record<string, string>
  quickStartHref?: string
  docsHref?: string
}
```

---

## Implementation Plan

### Phase 3A: Home Page (Week 1-2)

**Tasks:**
1. Create `QuickStartPaths` component
2. Create `ProductShowcase` component
3. Create `WhatsNew` component
4. Create `MetaplexStats` component
5. Build responsive layout
6. Update `/pages/index.md` to use new components

**Deliverables:**
- New home page components
- Updated index.md
- Mobile-responsive design
- Analytics tracking

### Phase 3B: Product Index Pages (Week 2-3)

**Tasks:**
1. Enhance `ProductHero` component
2. Create `UseCaseCards` component
3. Create `FeatureGrid` component
4. Update hero components for top 5 products
5. Migrate product index pages

**Deliverables:**
- Enhanced hero components
- Updated product index pages (Core, Candy Machine, UMI, etc.)
- Interactive code examples in hero

### Phase 3C: Guide Index Pages (Week 3-4)

**Tasks:**
1. Create `GuideCard` component
2. Create `GuideFilters` component
3. Add metadata to guide pages (difficulty, time, etc.)
4. Build search/filter functionality
5. Migrate guide index pages

**Deliverables:**
- Enhanced guide cards
- Filter/search functionality
- Updated guide index pages
- Metadata added to all guides

---

## Content Requirements

### Quick Start Paths (Home Page)

Create 3-5 quick start guides:
- ✅ Launch NFT Collection (Core + Candy Machine)
- ✅ Build Gaming Assets (Core + Inscription)
- ✅ Issue Tokens (Token Metadata)
- ⚠️ Create Marketplace (DAS API + Auction House)
- ⚠️ Compressed NFTs (Bubblegum)

Each quick start needs:
- 5-10 minute tutorial
- Working code example
- Multi-language support
- Clear prerequisites

### Guide Metadata

Add to all guide frontmatter:

```markdown
---
title: Create Soulbound NFT
difficulty: intermediate
time: 10 min
languages: [javascript, rust]
tags: [nfts, plugins, freezing]
created: 2025-10-15
updated: 2025-10-20
---
```

---

## Success Metrics

### Home Page

- [ ] <5 min from landing to writing code
- [ ] >40% click-through on quick start paths
- [ ] >30% explore product showcase
- [ ] <3s page load time
- [ ] >90 Lighthouse score

### Product Index Pages

- [ ] >50% click-through on "Get Started" CTA
- [ ] >20% try live playground (if implemented)
- [ ] Positive user feedback (>4/5)
- [ ] Reduced bounce rate (-15%)

### Guide Index Pages

- [ ] >60% use filters/search
- [ ] Find guide in <30 seconds
- [ ] >40% complete guide
- [ ] Reduced "can't find guide" support tickets

---

## Related Documents

- [Redesign Overview](./REDESIGN_OVERVIEW.md)
- [Current Analysis](./CURRENT_ANALYSIS.md)
- [Code Experience Redesign](./CODE_EXPERIENCE_REDESIGN.md)
- [Component Library](./COMPONENT_LIBRARY.md)

---

**Next Steps:**
1. Review and approve index page redesigns
2. Create quick start content
3. Add metadata to guides
4. Build components
5. User test designs
6. Begin Phase 3 implementation

**Last Updated:** 2025-10-27
