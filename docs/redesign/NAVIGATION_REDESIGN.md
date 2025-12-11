# Navigation Redesign Proposal

**Document Date:** October 2025
**Status:** Proposed
**Priority:** Phase 2 (after Code Experience)

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Design Principles](#design-principles)
3. [Proposed Solution](#proposed-solution)
4. [Component Specifications](#component-specifications)
5. [Visual Mockups](#visual-mockups)
6. [Implementation Plan](#implementation-plan)
7. [Migration Strategy](#migration-strategy)

---

## Problem Statement

### Current Issues

From [CURRENT_ANALYSIS.md](./CURRENT_ANALYSIS.md#1-navigation-hierarchy-unclear):

1. **Split Navigation Context**
   - Section tabs (Docs/Guides/References) in header
   - Navigation tree in sidebar
   - Two separate mental models to understand

2. **Unclear Hierarchy**
   - Maximum 2 levels deep (section → links)
   - No visual indicators of content type
   - All sections always expanded
   - No grouping by concept or difficulty

3. **Scalability Problems**
   - Products like Core have 200+ links
   - Requires extensive scrolling
   - Hard to see "big picture"
   - Mobile experience suffers

4. **Missing Metadata**
   - No difficulty indicators
   - No time estimates
   - No content type badges
   - Limited use of "New"/"Updated" badges

### User Impact

**From user research:**
- Developers say hierarchy is "unclear"
- Uncertainty about Docs vs Guides vs References
- Navigation takes too many clicks
- Mobile users struggle most

**Target:** ≤3 clicks from home to any content

---

## Design Principles

### 1. Single Source of Truth
**Principle:** All navigation in one place
- Unify section tabs and sidebar
- No cognitive split
- Clear at a glance

### 2. Progressive Disclosure
**Principle:** Show just enough, collapse the rest
- Collapsible section groups
- Expand on click or active state
- Preserve scroll position

### 3. Visual Hierarchy
**Principle:** Icons and typography show structure
- Content type icons
- Indentation for nesting
- Clear active states

### 4. Contextual Metadata
**Principle:** Show what matters for discovery
- Difficulty badges
- Time estimates
- Code/concept indicators
- Popularity signals

### 5. Mobile-First
**Principle:** Works beautifully on all screens
- Touch-friendly targets
- Swipe gestures
- Sticky headers
- Fast navigation

---

## Proposed Solution

### Overview

```
┌────────────────────────────────────┐
│ Header (Sticky)                    │
│  - Logo + Product Selector         │
│  - Search                          │
│  - Language, Theme, Social         │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│ Unified Navigation Sidebar         │
│                                    │
│ 🚀 Quick Start                     │
│   → Installation (2 min) [CODE]    │
│   → First Asset (5 min) [CODE]     │
│                                    │
│ 📖 Core Concepts                   │
│   → What is Core?                  │
│   → Core vs Token Metadata         │
│                                    │
│ 🔧 How-To Guides        [12] ▼     │
│   Beginner (3)                     │
│   → Soulbound NFTs [UPDATED]       │
│   → Print Editions [NEW]           │
│   → Immutability                   │
│   Intermediate (6)                 │
│   → Oracle Plugin Example          │
│   → Staking with Anchor            │
│   ...                              │
│                                    │
│ 📚 API Reference →                 │
│   (opens in new tab)               │
│                                    │
│ 📝 Changelog                       │
└────────────────────────────────────┘
```

### Key Changes

1. **Content Type Sections**
   - 🚀 Quick Start (get running in minutes)
   - 📖 Core Concepts (understand how it works)
   - 🔧 How-To Guides (solve specific problems)
   - 💡 Examples (copy-paste recipes)
   - 📚 API Reference (detailed docs)
   - 📝 Changelog (what's new)

2. **Collapsible Groups**
   - Sections can be collapsed/expanded
   - Sub-groups within sections (Beginner/Intermediate/Advanced)
   - Persist collapse state in localStorage

3. **Rich Metadata**
   - Time estimates (2 min, 5 min, 10 min)
   - Content type badges [CODE], [CONCEPT], [TUTORIAL]
   - Difficulty indicators (Beginner/Intermediate/Advanced)
   - Status badges [NEW], [UPDATED], [POPULAR]

4. **Visual Indicators**
   - Icons for each content type
   - Indentation shows nesting
   - Accent colors for active items
   - Hover previews (code snippet tooltip)

---

## Component Specifications

### 1. NavigationGroup Component

**Purpose:** Collapsible navigation section with icon and metadata

```jsx
<NavigationGroup
  title="How-To Guides"
  icon={WrenchIcon}
  count={12}
  defaultCollapsed={false}
  collapsible={true}
>
  <NavigationSubGroup title="Beginner" count={3}>
    <NavigationLink
      href="/core/guides/soulbound-nft"
      title="Soulbound NFTs"
      badge="updated"
      contentType="code"
      timeEstimate="10 min"
    />
    {/* ... more links */}
  </NavigationSubGroup>

  <NavigationSubGroup title="Intermediate" count={6}>
    {/* ... */}
  </NavigationSubGroup>
</NavigationGroup>
```

**Props:**
```typescript
interface NavigationGroupProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  count?: number                 // Number of items in group
  defaultCollapsed?: boolean     // Initial state
  collapsible?: boolean          // Can be collapsed
  accentColor?: string           // Product-specific accent
  children: React.ReactNode
}
```

**Behavior:**
- Click title/icon to toggle collapse
- Show/hide chevron indicating state
- Save state to localStorage (`nav-collapsed-{product}-{section}`)
- Smooth height transition animation

**Styling:**
```jsx
<div className="navigation-group">
  <button
    onClick={toggleCollapse}
    className="flex items-center gap-2 w-full py-2 px-3
               font-medium text-slate-900 dark:text-white
               hover:bg-slate-50 dark:hover:bg-slate-800
               rounded-lg transition-colors"
  >
    <Icon className="h-5 w-5 text-accent-500" />
    <span className="flex-1 text-left">{title}</span>
    {count && (
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {count}
      </span>
    )}
    <ChevronIcon
      className={clsx(
        "h-4 w-4 transition-transform",
        isCollapsed ? "rotate-0" : "rotate-90"
      )}
    />
  </button>

  <div
    className={clsx(
      "overflow-hidden transition-all duration-200",
      isCollapsed ? "h-0" : "h-auto"
    )}
  >
    {children}
  </div>
</div>
```

### 2. NavigationLink Component

**Purpose:** Individual navigation link with metadata

```jsx
<NavigationLink
  href="/core/create-asset"
  title="Creating Assets"
  active={pathname === "/core/create-asset"}
  badge="new"                    // "new" | "updated" | "popular"
  contentType="code"             // "code" | "concept" | "tutorial"
  difficulty="beginner"          // "beginner" | "intermediate" | "advanced"
  timeEstimate="5 min"
  indent={1}                     // 0, 1, 2 for nesting levels
  showPreview={true}             // Show code preview on hover
/>
```

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

**Styling:**
```jsx
<Link
  href={href}
  className={clsx(
    "block w-full py-2 px-3 rounded-lg transition-colors relative",
    "before:absolute before:-left-[2px] before:top-1/2 before:h-4 before:w-[3px]",
    "before:-translate-y-1/2 before:rounded",
    active
      ? "font-semibold text-accent-500 bg-accent-50 dark:bg-accent-900/20 before:bg-accent-500"
      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 before:hidden hover:before:block before:bg-slate-300 dark:before:bg-slate-700",
    indent === 1 && "ml-6",
    indent === 2 && "ml-12"
  )}
>
  <div className="flex items-center gap-2">
    {icon && <Icon className="h-4 w-4" />}
    <span className="flex-1">{title}</span>

    {/* Metadata badges */}
    <div className="flex items-center gap-1">
      {timeEstimate && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {timeEstimate}
        </span>
      )}
      {contentType === 'code' && (
        <span className="text-xs font-mono px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
          CODE
        </span>
      )}
      {badge === 'new' && <Badge type="new" />}
      {badge === 'updated' && <Badge type="updated" />}
      {badge === 'popular' && <Badge type="popular" />}
    </div>
  </div>

  {/* Hover preview for code pages */}
  {showPreview && contentType === 'code' && (
    <HoverPreview href={href} />
  )}
</Link>
```

### 3. NavigationSubGroup Component

**Purpose:** Sub-section within a group (e.g., Beginner guides)

```jsx
<NavigationSubGroup
  title="Beginner"
  count={3}
  collapsible={false}
>
  {children}
</NavigationSubGroup>
```

**Props:**
```typescript
interface NavigationSubGroupProps {
  title: string
  count?: number
  collapsible?: boolean
  children: React.ReactNode
}
```

**Styling:**
```jsx
<div className="navigation-subgroup mt-2">
  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 py-2 flex items-center justify-between">
    <span>{title}</span>
    {count && <span className="text-slate-400">({count})</span>}
  </div>
  <div className="space-y-1">
    {children}
  </div>
</div>
```

### 4. HoverPreview Component

**Purpose:** Show code snippet preview on hover

```jsx
<HoverPreview href="/core/create-asset" />
```

**Implementation:**
```jsx
function HoverPreview({ href }) {
  const [preview, setPreview] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  const fetchPreview = async () => {
    // Fetch first code block from page
    const response = await fetch(`/api/preview?path=${href}`)
    const data = await response.json()
    setPreview(data.code)
  }

  return (
    <div
      className="absolute left-full ml-2 z-50 hidden group-hover:block"
      onMouseEnter={() => {
        setIsVisible(true)
        fetchPreview()
      }}
    >
      <div className="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-xl p-4 max-w-md">
        <pre className="text-xs text-slate-100">
          <code>{preview || 'Loading...'}</code>
        </pre>
      </div>
    </div>
  )
}
```

### 5. Updated Navigation Component

**File:** `src/components/Navigation.jsx` (enhanced)

```jsx
export function Navigation({ product, navigation, className }) {
  const router = useRouter()
  const [collapsedSections, setCollapsedSections] = useState(() => {
    // Load from localStorage
    return loadCollapsedState(product.path)
  })

  const toggleSection = (sectionId) => {
    const newState = {
      ...collapsedSections,
      [sectionId]: !collapsedSections[sectionId],
    }
    setCollapsedSections(newState)
    saveCollapsedState(product.path, newState)
  }

  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      {/* Organize navigation by content type */}
      {organizeByContentType(navigation).map((group) => (
        <NavigationGroup
          key={group.id}
          title={group.title}
          icon={group.icon}
          count={group.links.length}
          defaultCollapsed={collapsedSections[group.id]}
          onToggle={() => toggleSection(group.id)}
        >
          {group.subGroups ? (
            // Nested sub-groups (e.g., Beginner/Intermediate)
            group.subGroups.map((subGroup) => (
              <NavigationSubGroup
                key={subGroup.title}
                title={subGroup.title}
                count={subGroup.links.length}
              >
                {subGroup.links.map((link) => (
                  <NavigationLink
                    key={link.href}
                    {...link}
                    active={router.pathname === link.href}
                  />
                ))}
              </NavigationSubGroup>
            ))
          ) : (
            // Flat list of links
            group.links.map((link) => (
              <NavigationLink
                key={link.href}
                {...link}
                active={router.pathname === link.href}
              />
            ))
          )}
        </NavigationGroup>
      ))}
    </nav>
  )
}
```

### Helper Functions

```javascript
// Organize navigation by content type
function organizeByContentType(navigation) {
  return [
    {
      id: 'quick-start',
      title: 'Quick Start',
      icon: RocketLaunchIcon,
      links: navigation.filter((link) => link.contentType === 'quickstart'),
    },
    {
      id: 'concepts',
      title: 'Core Concepts',
      icon: BookOpenIcon,
      links: navigation.filter((link) => link.contentType === 'concept'),
    },
    {
      id: 'guides',
      title: 'How-To Guides',
      icon: WrenchIcon,
      subGroups: [
        {
          title: 'Beginner',
          links: navigation.filter(
            (link) =>
              link.contentType === 'guide' && link.difficulty === 'beginner'
          ),
        },
        {
          title: 'Intermediate',
          links: navigation.filter(
            (link) =>
              link.contentType === 'guide' && link.difficulty === 'intermediate'
          ),
        },
        {
          title: 'Advanced',
          links: navigation.filter(
            (link) =>
              link.contentType === 'guide' && link.difficulty === 'advanced'
          ),
        },
      ],
    },
    {
      id: 'examples',
      title: 'Code Examples',
      icon: CodeBracketIcon,
      links: navigation.filter((link) => link.contentType === 'example'),
    },
    {
      id: 'reference',
      title: 'API Reference',
      icon: BookmarkSquareIcon,
      links: navigation.filter((link) => link.contentType === 'reference'),
    },
    {
      id: 'changelog',
      title: 'Changelog',
      icon: NewspaperIcon,
      links: navigation.filter((link) => link.contentType === 'changelog'),
    },
  ].filter((group) => group.links?.length > 0 || group.subGroups)
}

// Save/load collapsed state
function saveCollapsedState(productPath, state) {
  localStorage.setItem(`nav-collapsed-${productPath}`, JSON.stringify(state))
}

function loadCollapsedState(productPath) {
  const saved = localStorage.getItem(`nav-collapsed-${productPath}`)
  return saved ? JSON.parse(saved) : {}
}
```

---

## Visual Mockups

### Desktop Navigation (Before)

```
┌─────────────────────────────────┐
│ [Docs] [Guides] [References]    │ ← Section tabs
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ Sidebar                         │
│                                 │
│ Introduction                    │
│   Overview                      │
│   Getting Started               │
│   FAQ                           │
│                                 │
│ Features                        │
│   Creating Assets               │
│   Fetching Assets               │
│   Updating Assets               │
│   Transferring Assets           │
│   Burning Assets                │
│   ... (20+ more links)          │
│                                 │
│ Plugins                         │
│   ... (30+ links)               │
│                                 │
│ External Plugins                │
│   ... (10+ links)               │
└─────────────────────────────────┘
```

**Issues:**
- ❌ Two navigation systems (tabs + sidebar)
- ❌ All sections expanded (long scroll)
- ❌ No visual hierarchy
- ❌ No metadata

### Desktop Navigation (After)

```
┌─────────────────────────────────┐
│ Unified Sidebar                 │
│                                 │
│ 🚀 Quick Start              [2] │ ← Icon + count
│   → Installation (2 min) [CODE] │ ← Time + type
│   → First Asset (5 min) [CODE]  │
│                                 │
│ 📖 Core Concepts            [4] │
│   → What is Core?               │
│   → Core vs Token Metadata      │
│   → Plugin System               │
│   → Asset Structure             │
│                                 │
│ 🔧 How-To Guides       [12] ▼   │ ← Collapsible
│   BEGINNER (3)                  │ ← Sub-groups
│   → Soulbound NFTs [UPDATED]    │
│   → Print Editions [NEW]        │
│   → Basic Transfers             │
│   INTERMEDIATE (6)              │
│   → Oracle Plugin (15min)       │
│   → Custom Authorities          │
│   ...                           │
│   ADVANCED (3)                  │
│   → Staking with Anchor         │
│   ...                           │
│                                 │
│ 💡 Code Examples         [8] ▶  │ ← Collapsed
│                                 │
│ 📚 API Reference              → │ ← External link
│                                 │
│ 📝 Changelog                    │
│   → v1.1 (Oct 2025) [NEW]      │
└─────────────────────────────────┘
```

**Benefits:**
- ✅ Single navigation system
- ✅ Collapsible groups (less scrolling)
- ✅ Clear visual hierarchy (icons, indentation)
- ✅ Rich metadata (time, type, difficulty)
- ✅ Better organization (by content type)

### Mobile Navigation (After)

```
┌─────────────────────┐
│  [≡] Core      [🔍] │ ← Hamburger + Search
└─────────────────────┘

[Tap hamburger to open drawer]

┌─────────────────────┐
│ ← Core             │
│                     │
│ 🚀 Quick Start  [2] │
│ 📖 Concepts     [4] │
│ 🔧 Guides      [12] │
│ 💡 Examples     [8] │
│ 📚 Reference     →  │
│ 📝 Changelog        │
│                     │
│ [Search docs...]    │
└─────────────────────┘

[Tap section to expand]

┌─────────────────────┐
│ ← 🔧 Guides         │
│                     │
│ BEGINNER (3)        │
│ → Soulbound NFTs    │
│ → Print Editions    │
│ → Basic Transfers   │
│                     │
│ INTERMEDIATE (6)    │
│ → Oracle Plugin     │
│ ...                 │
└─────────────────────┘
```

**Benefits:**
- ✅ Touch-friendly
- ✅ Progressive disclosure
- ✅ Search accessible
- ✅ Swipe to close drawer

---

## Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Tasks:**
1. Create new navigation components:
   - `NavigationGroup.jsx`
   - `NavigationLink.jsx`
   - `NavigationSubGroup.jsx`
   - `Badge.jsx` (enhance existing)

2. Add metadata to product configurations:
   ```javascript
   // In src/components/products/core/index.js
   navigation: [
     {
       title: 'Installation',
       href: '/core/installation',
       contentType: 'quickstart',  // NEW
       timeEstimate: '2 min',      // NEW
       difficulty: 'beginner',     // NEW
     },
     // ...
   ]
   ```

3. Update `Navigation.jsx` to use new components

4. Add localStorage persistence for collapse state

**Deliverables:**
- New components in Storybook
- Updated product config schema
- Working prototype on one product (Core)

### Phase 2: Content Classification (Week 3)

**Tasks:**
1. Audit all navigation links across products
2. Classify by content type (quickstart/concept/guide/example/reference)
3. Add difficulty levels to guides
4. Estimate reading times
5. Update product configurations

**Script to help:**
```javascript
// scripts/audit-navigation.js
// Analyze all product configs and suggest classifications
```

**Deliverables:**
- Classification spreadsheet
- Updated product configs for all products
- Documentation on classification system

### Phase 3: Polish & Mobile (Week 4)

**Tasks:**
1. Responsive design refinement
2. Mobile drawer interactions
3. Hover preview implementation (optional)
4. Animation polish
5. Accessibility audit (keyboard navigation, screen readers)
6. Performance testing

**Deliverables:**
- Mobile-optimized navigation
- Accessibility report
- Performance benchmarks

### Phase 4: Rollout (Week 5)

**Tasks:**
1. A/B test with beta users
2. Collect feedback
3. Iterate on designs
4. Full rollout
5. Analytics setup

**Metrics to Track:**
- Navigation clicks to content (target: ≤3)
- Time spent on navigation (should decrease)
- Bounce rate (should decrease)
- Mobile engagement (should increase)

---

## Migration Strategy

### Backwards Compatibility

**Maintain:**
- All existing URLs (no link structure changes)
- Existing product configuration format
- Current navigation for products not yet migrated

**Gradual Migration:**
1. **Week 1-2:** Core product only (beta flag)
2. **Week 3:** Top 5 products (Core, Candy Machine, UMI, Bubblegum, Token Metadata)
3. **Week 4:** Remaining products
4. **Week 5:** Remove old navigation code

### Product Config Migration

**Before:**
```javascript
navigation: [
  {
    title: 'Introduction',
    links: [
      { title: 'Overview', href: '/core' },
      { title: 'Getting Started', href: '/core/getting-started' },
    ],
  },
]
```

**After:**
```javascript
navigation: [
  {
    title: 'Overview',
    href: '/core',
    contentType: 'concept',
    // Optional new fields
  },
  {
    title: 'Getting Started',
    href: '/core/getting-started',
    contentType: 'quickstart',
    timeEstimate: '5 min',
    difficulty: 'beginner',
  },
]
```

**Migration Script:**
```bash
pnpm run migrate:navigation
```

### Fallback Handling

```javascript
// In Navigation.jsx
function Navigation({ product, navigation }) {
  // Detect old vs new format
  const isLegacyFormat = navigation[0]?.links !== undefined

  if (isLegacyFormat) {
    return <LegacyNavigation navigation={navigation} />
  }

  return <NewNavigation navigation={navigation} />
}
```

---

## Testing Strategy

### Unit Tests

```javascript
// Navigation.test.jsx
describe('Navigation', () => {
  it('renders all navigation groups', () => {})
  it('collapses/expands groups on click', () => {})
  it('highlights active link', () => {})
  it('shows correct badges', () => {})
  it('persists collapse state to localStorage', () => {})
})
```

### Integration Tests

```javascript
// navigation.e2e.test.js
describe('Navigation E2E', () => {
  it('user can navigate from home to guide in ≤3 clicks', () => {})
  it('collapse state persists across page reloads', () => {})
  it('mobile navigation drawer opens/closes', () => {})
  it('search results update navigation highlight', () => {})
})
```

### Accessibility Tests

- Keyboard navigation (Tab, Enter, Space, Arrows)
- Screen reader compatibility (ARIA labels)
- Focus management
- Color contrast (WCAG AA)
- Touch target sizes (minimum 44x44px)

### Performance Tests

- Render time with 200+ links
- Collapse/expand animation smoothness
- localStorage read/write performance
- Mobile scroll performance

---

## Accessibility Requirements

### Keyboard Navigation

- `Tab` - Navigate between groups and links
- `Enter` or `Space` - Expand/collapse groups, activate links
- `Arrow Up/Down` - Navigate within lists
- `Arrow Left/Right` - Collapse/expand groups
- `Home/End` - Jump to first/last item

### Screen Reader Support

```jsx
<NavigationGroup
  title="How-To Guides"
  aria-expanded={!isCollapsed}
  aria-controls="guides-section"
>
  <div id="guides-section" role="list">
    <NavigationLink
      href="/core/guides/..."
      role="listitem"
      aria-current={active ? 'page' : undefined}
    >
      Soulbound NFTs
    </NavigationLink>
  </div>
</NavigationGroup>
```

### Focus Management

- Maintain focus when expanding/collapsing
- Return focus to trigger after closing mobile drawer
- Skip to content link for keyboard users
- Focus visible styles (ring)

---

## Analytics & Metrics

### Events to Track

```javascript
// Navigation interactions
analytics.track('navigation_group_toggled', {
  product: 'core',
  section: 'guides',
  action: 'collapsed' | 'expanded',
})

analytics.track('navigation_link_clicked', {
  product: 'core',
  section: 'guides',
  link: '/core/guides/soulbound-nft',
  contentType: 'guide',
  difficulty: 'beginner',
})

analytics.track('navigation_search_used', {
  query: 'create nft',
  resultsCount: 12,
})

analytics.track('navigation_hover_preview', {
  link: '/core/create-asset',
  previewShown: true,
})
```

### Success Metrics

| Metric | Baseline | Target | Notes |
|--------|----------|--------|-------|
| Avg clicks to content | TBD | ≤3 | From home to any doc |
| Navigation time | TBD | -30% | Time spent in nav |
| Mobile engagement | TBD | +40% | Mobile users completing tasks |
| Bounce rate | TBD | -20% | Users finding what they need |
| Search usage | TBD | -15% | Better browsing reduces search dependency |

---

## Open Questions

1. **Hover Previews:**
   - Worth the complexity?
   - Performance impact?
   - Mobile alternative?

2. **Search Integration:**
   - Should search results filter navigation?
   - Highlight matching nav items?

3. **Product Switching:**
   - Current header dropdown OK?
   - Consider side-by-side product comparison?

4. **Changelog Integration:**
   - In navigation or separate?
   - Link to GitHub releases?

5. **Localization:**
   - How to handle metadata (time estimates, difficulty) across languages?
   - Content type labels need translation?

---

## Related Documents

- [Redesign Overview](./REDESIGN_OVERVIEW.md)
- [Current Analysis](./CURRENT_ANALYSIS.md)
- [Code Experience Redesign](./CODE_EXPERIENCE_REDESIGN.md)
- [Component Library](./COMPONENT_LIBRARY.md)

---

**Next Steps:**
1. Review and approve navigation redesign
2. Create Figma mockups (visual design)
3. Build proof-of-concept components
4. User test with 5-10 developers
5. Iterate and refine
6. Begin Phase 1 implementation

**Last Updated:** 2025-10-27
