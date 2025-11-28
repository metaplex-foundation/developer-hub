# Component Library Specification

**Document Date:** October 2025
**Status:** Proposed
**Purpose:** Unified design system for Metaplex Developer Hub

---

## Table of Contents

1. [Overview](#overview)
2. [Code Components](#code-components)
3. [Navigation Components](#navigation-components)
4. [Index Page Components](#index-page-components)
5. [Utility Components](#utility-components)
6. [Design Tokens](#design-tokens)
7. [Component Patterns](#component-patterns)
8. [Testing Standards](#testing-standards)

---

## Overview

### Goals

- **Consistency:** Same components used across all products
- **Reusability:** DRY principle, build once, use everywhere
- **Maintainability:** Centralized updates, easy to modify
- **Accessibility:** WCAG AA compliance by default
- **Performance:** Optimized, lazy-loaded where appropriate

### Organization

```
src/components/
├── code/                    # Code-related components
│   ├── CodeTabs.jsx
│   ├── CodeTab.jsx
│   ├── CopyWithContext.jsx
│   ├── Fence.jsx
│   ├── CodeFlow.jsx
│   └── LiveCode.jsx
├── navigation/              # Navigation components
│   ├── NavigationGroup.jsx
│   ├── NavigationLink.jsx
│   ├── NavigationSubGroup.jsx
│   └── HoverPreview.jsx
├── index-pages/             # Index page components
│   ├── QuickStartPaths.jsx
│   ├── QuickStartCard.jsx
│   ├── ProductShowcase.jsx
│   ├── ProductCard.jsx
│   ├── GuideCard.jsx
│   ├── GuideFilters.jsx
│   └── UseCaseCards.jsx
├── shared/                  # Shared utilities
│   ├── Badge.jsx
│   ├── Button.jsx
│   ├── Icon.jsx
│   ├── Tag.jsx
│   └── MetaItem.jsx
└── [existing components]
```

### Component Naming

**Pattern:** `{Domain}{Noun}.jsx`

**Examples:**
- ✅ `CodeTabs.jsx` (domain: code, noun: tabs)
- ✅ `NavigationGroup.jsx` (domain: navigation, noun: group)
- ✅ `QuickStartCard.jsx` (domain: quick start, noun: card)

**Avoid:**
- ❌ `Tabs.jsx` (too generic)
- ❌ `Group.jsx` (unclear domain)

---

## Code Components

### 1. CodeTabs

**Purpose:** Multi-language code block with tabs

**Location:** `src/components/code/CodeTabs.jsx`

**Props:**
```typescript
interface CodeTabsProps {
  children: React.ReactNode
  defaultLanguage?: string
  persist?: boolean              // Save to localStorage
  className?: string
  onLanguageChange?: (lang: string) => void
}
```

**Usage:**
```jsx
<CodeTabs defaultLanguage="javascript" persist={true}>
  <CodeTab language="javascript" label="JavaScript">
    {jsCode}
  </CodeTab>
  <CodeTab language="rust" label="Rust">
    {rustCode}
  </CodeTab>
</CodeTabs>
```

**Markdoc:**
```markdown
{% code-tabs defaultLanguage="javascript" %}
{% code-tab language="javascript" label="JavaScript" %}
```javascript
const code = 'here'
```
{% /code-tab %}
{% /code-tabs %}
```

**Accessibility:**
- `role="tablist"` on tab container
- `role="tab"` on each button
- `aria-selected` on active tab
- `role="tabpanel"` on content
- Keyboard navigation (Arrow keys, Home, End)

**Tests:**
- [ ] Renders all tabs
- [ ] Switches language on click
- [ ] Persists preference to localStorage
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

### 2. CodeTab

**Purpose:** Individual tab within CodeTabs

**Location:** `src/components/code/CodeTab.jsx`

**Props:**
```typescript
interface CodeTabProps {
  language: string
  label?: string
  icon?: React.ComponentType
  hidden?: boolean               // Include in context but don't show tab
  children: React.ReactNode
}
```

**Usage:**
```jsx
<CodeTab language="rust" label="Rust" icon={RustIcon}>
  {code}
</CodeTab>
```

---

### 3. CopyWithContext

**Purpose:** Enhanced copy button with full context

**Location:** `src/components/code/CopyWithContext.jsx`

**Props:**
```typescript
interface CopyWithContextProps {
  code: string
  context?: {
    imports?: string
    setup?: string
    output?: string
    language?: string
  }
  showToggle?: boolean
  defaultWithContext?: boolean
  onCopy?: (withContext: boolean) => void
}
```

**Usage:**
```jsx
<CopyWithContext
  code={mainCode}
  context={{
    imports: 'import { create } from "@metaplex..."',
    setup: 'const umi = createUmi(...)',
    output: 'console.log(asset)',
  }}
  showToggle={true}
/>
```

**Tests:**
- [ ] Copies code without context
- [ ] Copies code with context when toggled
- [ ] Shows "Copied!" feedback
- [ ] Calls onCopy callback
- [ ] Keyboard accessible (Enter/Space)

---

### 4. Enhanced Fence

**Purpose:** Syntax-highlighted code block with features

**Location:** `src/components/code/Fence.jsx` (enhanced)

**Props:**
```typescript
interface FenceProps {
  children: string
  language: string
  title?: string
  lineNumbers?: boolean
  highlight?: Array<number | string>
  showCopy?: boolean
  terminal?: boolean
  diff?: boolean
  className?: string
}
```

**Usage:**
```jsx
<Fence
  language="javascript"
  title="src/create-nft.js"
  lineNumbers={true}
  highlight={[3, "5-7", 10]}
  showCopy={true}
>
  {code}
</Fence>
```

**Tests:**
- [ ] Renders syntax highlighted code
- [ ] Shows line numbers
- [ ] Highlights specified lines
- [ ] Copy button works
- [ ] Terminal mode styles correctly
- [ ] Diff mode shows +/- indicators

---

### 5. CodeFlow

**Purpose:** Visual flow diagram for code execution

**Location:** `src/components/code/CodeFlow.jsx`

**Props:**
```typescript
interface CodeFlowProps {
  steps: CodeFlowStep[]
  direction?: 'vertical' | 'horizontal'
  className?: string
}

interface CodeFlowStep {
  code: string
  description: string
  result?: string
  icon?: React.ComponentType
}
```

**Usage:**
```jsx
<CodeFlow
  direction="vertical"
  steps={[
    {
      code: 'const umi = createUmi(...)',
      description: 'Initialize UMI client',
      result: 'Connected to Solana RPC',
    },
    {
      code: 'create(umi, { ... })',
      description: 'Build create instruction',
      result: 'Transaction prepared',
    },
  ]}
/>
```

**Markdoc:**
```markdown
{% code-flow %}
{% flow-step code="..." description="..." result="..." /%}
{% flow-step code="..." description="..." result="..." /%}
{% /code-flow %}
```

**Tests:**
- [ ] Renders all steps
- [ ] Shows arrows between steps
- [ ] Vertical and horizontal layouts
- [ ] Responsive on mobile

---

### 6. LiveCode

**Purpose:** Interactive code playground

**Location:** `src/components/code/LiveCode.jsx`

**Props:**
```typescript
interface LiveCodeProps {
  code: string
  language?: string
  dependencies?: Record<string, string>
  files?: Record<string, string>
  autorun?: boolean
  height?: number
  readOnly?: boolean
  onRun?: (result: any) => void
}
```

**Usage:**
```jsx
<LiveCode
  code={code}
  language="javascript"
  dependencies={{
    '@metaplex-foundation/mpl-core': 'latest',
  }}
  autorun={false}
  height={400}
/>
```

**Tests:**
- [ ] Code editor renders
- [ ] Run button executes code
- [ ] Console shows output
- [ ] Errors displayed properly
- [ ] Dependencies loaded

---

## Navigation Components

### 1. NavigationGroup

**Purpose:** Collapsible navigation section

**Location:** `src/components/navigation/NavigationGroup.jsx`

**Props:**
```typescript
interface NavigationGroupProps {
  title: string
  icon: React.ComponentType
  count?: number
  defaultCollapsed?: boolean
  collapsible?: boolean
  accentColor?: string
  onToggle?: (collapsed: boolean) => void
  children: React.ReactNode
}
```

**Usage:**
```jsx
<NavigationGroup
  title="How-To Guides"
  icon={WrenchIcon}
  count={12}
  defaultCollapsed={false}
  collapsible={true}
>
  {children}
</NavigationGroup>
```

**Tests:**
- [ ] Renders with icon and title
- [ ] Toggles collapse on click
- [ ] Persists state to localStorage
- [ ] Keyboard accessible
- [ ] Smooth animation

---

### 2. NavigationLink

**Purpose:** Individual navigation link with metadata

**Location:** `src/components/navigation/NavigationLink.jsx`

**Props:**
```typescript
interface NavigationLinkProps {
  href: string
  title: string
  active?: boolean
  badge?: 'new' | 'updated' | 'popular'
  contentType?: 'code' | 'concept' | 'tutorial' | 'reference'
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  timeEstimate?: string
  indent?: number
  showPreview?: boolean
  icon?: React.ComponentType
}
```

**Usage:**
```jsx
<NavigationLink
  href="/core/create-asset"
  title="Creating Assets"
  active={true}
  badge="updated"
  contentType="code"
  timeEstimate="5 min"
  indent={1}
/>
```

**Tests:**
- [ ] Renders link correctly
- [ ] Shows active state
- [ ] Displays badges
- [ ] Indent levels work
- [ ] Hover preview appears (if enabled)

---

### 3. NavigationSubGroup

**Purpose:** Sub-section within navigation group

**Location:** `src/components/navigation/NavigationSubGroup.jsx`

**Props:**
```typescript
interface NavigationSubGroupProps {
  title: string
  count?: number
  collapsible?: boolean
  defaultCollapsed?: boolean
  children: React.ReactNode
}
```

**Usage:**
```jsx
<NavigationSubGroup title="Beginner" count={3}>
  <NavigationLink ... />
  <NavigationLink ... />
</NavigationSubGroup>
```

---

### 4. HoverPreview

**Purpose:** Show code preview on navigation hover

**Location:** `src/components/navigation/HoverPreview.jsx`

**Props:**
```typescript
interface HoverPreviewProps {
  href: string
  delay?: number
  maxLines?: number
}
```

**Usage:**
```jsx
<HoverPreview href="/core/create-asset" delay={500} maxLines={10} />
```

**Note:** Fetches first code block from page via API

---

## Index Page Components

### 1. QuickStartPaths

**Purpose:** Home page quick start section

**Location:** `src/components/index-pages/QuickStartPaths.jsx`

**Props:**
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

**Usage:**
```jsx
<QuickStartPaths
  paths={[
    {
      title: 'Launch NFT Collection',
      description: '...',
      time: '5 min',
      difficulty: 'beginner',
      products: ['Core', 'Candy Machine'],
      href: '/guides/quick-start/nft-collection',
      code: 'const asset = ...',
      languages: ['JavaScript', 'Rust'],
    },
  ]}
/>
```

---

### 2. QuickStartCard

**Purpose:** Individual quick start card

**Location:** `src/components/index-pages/QuickStartCard.jsx`

**Props:**
```typescript
interface QuickStartCardProps extends QuickStartPath {
  className?: string
}
```

**Tests:**
- [ ] Renders all metadata
- [ ] Code preview visible
- [ ] Hover state works
- [ ] Click navigates to guide
- [ ] Accessible

---

### 3. ProductShowcase

**Purpose:** Product grid by category

**Location:** `src/components/index-pages/ProductShowcase.jsx`

**Props:**
```typescript
interface ProductShowcaseProps {
  productList: Product[]
  categories?: ProductCategory[]
}

interface ProductCategory {
  name: string
  description: string
  products: string[]
}
```

**Usage:**
```jsx
<ProductShowcase
  productList={allProducts}
  categories={[
    {
      name: 'Digital Assets',
      description: 'NFTs and collectibles',
      products: ['core', 'candyMachine', 'bubblegum'],
    },
  ]}
/>
```

---

### 4. ProductCard

**Purpose:** Individual product card

**Location:** `src/components/index-pages/ProductCard.jsx`

**Props:**
```typescript
interface ProductCardProps {
  product: Product
  size?: 'small' | 'medium' | 'large'
  showDescription?: boolean
}
```

---

### 5. GuideCard

**Purpose:** Enhanced guide card with metadata

**Location:** `src/components/index-pages/GuideCard.jsx`

**Props:**
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

**Tests:**
- [ ] Renders all metadata
- [ ] Difficulty badge correct
- [ ] Language icons display
- [ ] Preview code shows (if present)
- [ ] Tags render
- [ ] Click navigates

---

### 6. GuideFilters

**Purpose:** Filter and search guides

**Location:** `src/components/index-pages/GuideFilters.jsx`

**Props:**
```typescript
interface GuideFiltersProps {
  onFilterChange: (filters: Filters) => void
  initialFilters?: Filters
}

interface Filters {
  difficulty?: 'all' | 'beginner' | 'intermediate' | 'advanced'
  language?: string
  searchQuery?: string
  tags?: string[]
}
```

**Tests:**
- [ ] Search input works
- [ ] Difficulty buttons filter
- [ ] Language dropdown filters
- [ ] Calls onFilterChange callback
- [ ] Clear filters button works

---

### 7. UseCaseCards

**Purpose:** Popular use case cards for products

**Location:** `src/components/index-pages/UseCaseCards.jsx`

**Props:**
```typescript
interface UseCaseCardsProps {
  useCases: UseCase[]
}

interface UseCase {
  title: string
  icon: string | React.ComponentType
  description: string
  href: string
  difficulty: string
  time: string
}
```

---

## Utility Components

### 1. Badge

**Purpose:** Status/metadata badge

**Location:** `src/components/shared/Badge.jsx` (enhanced)

**Props:**
```typescript
interface BadgeProps {
  type?: 'new' | 'updated' | 'popular' | 'beta'
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}
```

**Usage:**
```jsx
<Badge type="new">New</Badge>
<Badge variant="success">Live</Badge>
<Badge type="popular">Popular</Badge>
```

**Styles:**
```css
.badge-new { @apply bg-green-100 text-green-800; }
.badge-updated { @apply bg-blue-100 text-blue-800; }
.badge-popular { @apply bg-purple-100 text-purple-800; }
.badge-beta { @apply bg-yellow-100 text-yellow-800; }
```

---

### 2. Button

**Purpose:** Consistent button styles

**Location:** `src/components/shared/Button.jsx`

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ComponentType
  children: React.ReactNode
}
```

**Usage:**
```jsx
<Button variant="primary" size="lg" href="/get-started">
  Get Started →
</Button>
```

---

### 3. Icon

**Purpose:** Consistent icon wrapper

**Location:** `src/components/shared/Icon.jsx`

**Props:**
```typescript
interface IconProps {
  name: string
  size?: number
  className?: string
}
```

**Usage:**
```jsx
<Icon name="code" size={24} className="text-accent-500" />
```

**Icon Library:** Heroicons v2

---

### 4. Tag

**Purpose:** Content tags (topics, tech stack)

**Location:** `src/components/shared/Tag.jsx`

**Props:**
```typescript
interface TagProps {
  children: React.ReactNode
  variant?: 'default' | 'accent'
  removable?: boolean
  onRemove?: () => void
}
```

**Usage:**
```jsx
<Tag variant="accent">nfts</Tag>
<Tag removable onRemove={() => {}}>plugins</Tag>
```

---

### 5. MetaItem

**Purpose:** Small metadata display

**Location:** `src/components/shared/MetaItem.jsx`

**Props:**
```typescript
interface MetaItemProps {
  icon?: React.ComponentType
  children: React.ReactNode
  className?: string
}
```

**Usage:**
```jsx
<MetaItem icon={ClockIcon}>5 min</MetaItem>
<MetaItem icon={StarIcon}>4.8/5</MetaItem>
```

---

## Design Tokens

### Colors

```css
:root {
  /* Accent colors (per product) */
  --accent-50: ...;
  --accent-500: ...;
  --accent-900: ...;

  /* Semantic colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Difficulty colors */
  --difficulty-beginner: #10b981;
  --difficulty-intermediate: #f59e0b;
  --difficulty-advanced: #ef4444;
}
```

### Spacing

```css
:root {
  --space-xs: 0.25rem;  /* 4px */
  --space-sm: 0.5rem;   /* 8px */
  --space-md: 1rem;     /* 16px */
  --space-lg: 1.5rem;   /* 24px */
  --space-xl: 2rem;     /* 32px */
  --space-2xl: 3rem;    /* 48px */
}
```

### Typography

```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;

  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.125rem;  /* 18px */
  --text-xl: 1.25rem;   /* 20px */
  --text-2xl: 1.5rem;   /* 24px */
  --text-3xl: 1.875rem; /* 30px */
}
```

### Border Radius

```css
:root {
  --radius-sm: 0.25rem;  /* 4px */
  --radius-md: 0.5rem;   /* 8px */
  --radius-lg: 0.75rem;  /* 12px */
  --radius-xl: 1rem;     /* 16px */
}
```

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

---

## Component Patterns

### 1. Compound Components

**Use for:** Components with related sub-components

**Example:**
```jsx
<CodeTabs>
  <CodeTab language="javascript">...</CodeTab>
  <CodeTab language="rust">...</CodeTab>
</CodeTabs>
```

**Benefits:**
- Clear API
- Flexible composition
- Type-safe

### 2. Render Props

**Use for:** Flexible rendering logic

**Example:**
```jsx
<GuideList>
  {(guides) => guides.map((guide) => (
    <GuideCard key={guide.id} {...guide} />
  ))}
</GuideList>
```

### 3. Higher-Order Components

**Use for:** Shared behavior

**Example:**
```jsx
const WithAnalytics = (Component) => {
  return (props) => {
    const trackClick = () => {
      analytics.track('component_clicked', { component: Component.name })
    }
    return <Component {...props} onClick={trackClick} />
  }
}
```

### 4. Custom Hooks

**Use for:** Reusable logic

**Examples:**
```javascript
// Language preference
function useLanguagePreference(defaultLang = 'javascript') {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('preferred-language') || defaultLang
  })

  const updateLanguage = (newLang) => {
    setLanguage(newLang)
    localStorage.setItem('preferred-language', newLang)
  }

  return [language, updateLanguage]
}

// Collapse state
function useCollapseState(id, defaultCollapsed = false) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem(`collapsed-${id}`)
    return saved ? JSON.parse(saved) : defaultCollapsed
  })

  const toggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem(`collapsed-${id}`, JSON.stringify(newState))
  }

  return [isCollapsed, toggle]
}

// Code copy
function useCodeCopy(code, context) {
  const [copied, setCopied] = useState(false)
  const [withContext, setWithContext] = useState(true)

  const copy = async () => {
    const textToCopy = withContext && context
      ? `${context.imports}\n\n${context.setup}\n\n${code}`
      : code

    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return { copied, withContext, setWithContext, copy }
}
```

---

## Testing Standards

### Unit Tests

**Framework:** Jest + React Testing Library

**Coverage Target:** 80%+

**Example:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import { CodeTabs, CodeTab } from '../CodeTabs'

describe('CodeTabs', () => {
  it('renders all tabs', () => {
    render(
      <CodeTabs>
        <CodeTab language="javascript" label="JavaScript">
          const x = 1
        </CodeTab>
        <CodeTab language="rust" label="Rust">
          let x = 1;
        </CodeTab>
      </CodeTabs>
    )

    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Rust')).toBeInTheDocument()
  })

  it('switches language on click', () => {
    render(
      <CodeTabs defaultLanguage="javascript">
        <CodeTab language="javascript" label="JavaScript">
          const x = 1
        </CodeTab>
        <CodeTab language="rust" label="Rust">
          let x = 1;
        </CodeTab>
      </CodeTabs>
    )

    const rustTab = screen.getByText('Rust')
    fireEvent.click(rustTab)

    expect(screen.getByText('let x = 1;')).toBeVisible()
  })
})
```

### Integration Tests

**Framework:** Playwright or Cypress

**Example:**
```javascript
test('user can switch code languages and copy', async ({ page }) => {
  await page.goto('/core/create-asset')

  // Switch to Rust tab
  await page.click('[data-testid="tab-rust"]')
  await expect(page.locator('code')).toContainText('let asset')

  // Copy code
  await page.click('[data-testid="copy-button"]')
  await expect(page.locator('[data-testid="copy-button"]')).toContainText('Copied!')
})
```

### Accessibility Tests

**Framework:** jest-axe + eslint-plugin-jsx-a11y

**Example:**
```javascript
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

test('component has no accessibility violations', async () => {
  const { container } = render(<NavigationGroup {...props} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Visual Regression Tests

**Framework:** Chromatic or Percy

**Purpose:** Catch unintended visual changes

---

## Storybook Stories

### Setup

```javascript
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
}
```

### Story Example

```javascript
// CodeTabs.stories.jsx
import { CodeTabs, CodeTab } from './CodeTabs'

export default {
  title: 'Code/CodeTabs',
  component: CodeTabs,
}

export const Default = () => (
  <CodeTabs>
    <CodeTab language="javascript" label="JavaScript">
      {`const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/nft.json'
})`}
    </CodeTab>
    <CodeTab language="rust" label="Rust">
      {`let asset = CreateV1 {
    name: "My NFT".to_string(),
    uri: "https://example.com/nft.json".to_string()
};`}
    </CodeTab>
  </CodeTabs>
)

export const WithPersistence = () => (
  <CodeTabs persist={true}>
    {/* ... */}
  </CodeTabs>
)
```

---

## Documentation Standards

### Component README

Each component should have:

```markdown
# ComponentName

## Purpose
Brief description of what this component does.

## Usage
```jsx
<ComponentName prop="value">
  children
</ComponentName>
```

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | string | 'default' | Does X |

## Examples
[Link to Storybook]

## Accessibility
- Feature 1
- Feature 2

## Tests
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Accessibility tests pass
```

---

## Related Documents

- [Redesign Overview](./REDESIGN_OVERVIEW.md)
- [Code Experience Redesign](./CODE_EXPERIENCE_REDESIGN.md)
- [Navigation Redesign](./NAVIGATION_REDESIGN.md)
- [Index Pages Redesign](./INDEX_PAGES_REDESIGN.md)
- [Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md)

---

**Next Steps:**
1. Set up Storybook
2. Create base components
3. Write component tests
4. Document in Storybook
5. Get design review
6. Begin integration

**Last Updated:** 2025-10-27
