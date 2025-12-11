# Code Experience Redesign

**Document Date:** October 2025
**Status:** Proposed
**Priority:** Phase 1 (Highest Impact)

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Design Goals](#design-goals)
3. [Proposed Features](#proposed-features)
4. [Component Specifications](#component-specifications)
5. [Implementation Details](#implementation-details)
6. [Content Migration](#content-migration)
7. [Success Metrics](#success-metrics)

---

## Problem Statement

### Current Issues

From [CURRENT_ANALYSIS.md](./CURRENT_ANALYSIS.md#2-code-examples-lack-context):

1. **Limited Multi-Language Support**
   - Each code block shows single language
   - No tabs for JS/Rust/Kotlin alternatives
   - Manual `dialect-switcher` tag exists but rarely used
   - No persistent language preference

2. **Missing Context**
   - Code shown without imports
   - Setup/configuration not included
   - Unclear what code depends on
   - Copy-paste may not work standalone

3. **No Interactivity**
   - All code is static
   - Can't test without local setup
   - No visual representation of code flow
   - High barrier to experimentation

4. **Basic Presentation**
   - No line numbers
   - No line highlighting
   - No code folding
   - Plain syntax highlighting

### User Impact

**From user research:**
- ⭐ PRIMARY GOAL: "Quick copy-paste code snippets"
- Want ALL: Multi-language tabs, copy with context, live playground, visual flow diagrams
- Time to first code copy is critical success metric

**Target:** <2 minutes from landing to copying working code

---

## Design Goals

### 1. Code-First Experience
> "Every page should have actionable code within the first scroll"

**Principles:**
- Code blocks are visually prominent
- Working examples, not fragments
- Multiple formats (tabs, playground, diagrams)
- Progressive enhancement (basic → advanced)

### 2. Language Flexibility
> "Developers should see code in their preferred language"

**Principles:**
- Multi-language tabs by default
- Persistent language preference
- Consistent examples across languages
- Easy to add new languages

### 3. Copy-Ready Code
> "What you copy should just work"

**Principles:**
- Include all necessary imports
- Setup code provided
- Full working examples
- Dependencies listed

### 4. Learn by Doing
> "See it, copy it, run it, understand it"

**Principles:**
- Live playgrounds for experimentation
- Visual representations
- Immediate feedback
- Safe sandbox environment

---

## Proposed Features

### Feature Matrix

| Feature | Priority | Impact | Effort | Phase |
|---------|----------|--------|--------|-------|
| Multi-language tabs | P0 | High | Medium | 1 |
| Copy with context | P0 | High | Low | 1 |
| Visual flow diagrams | P1 | Medium | Medium | 1 |
| Line numbers/highlighting | P1 | Medium | Low | 1 |
| Live playground | P1 | High | High | 4 |
| Code folding | P2 | Low | Medium | 4 |
| Diff view | P2 | Low | Medium | - |

---

## 1. Multi-Language Tabs

### User Experience

````markdown
```js tab:JavaScript
import { create } from '@metaplex-foundation/mpl-core'

const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)
```

```rust tab:Rust
use mpl_core::instructions::CreateV1;

let asset = CreateV1 {
    name: "My NFT".to_string(),
    uri: "https://example.com/metadata.json".to_string()
}.instruction();
```

```kotlin tab:Kotlin
val asset = create(umi) {
    name = "My NFT"
    uri = "https://example.com/metadata.json"
}.sendAndConfirm(umi)
```
````

**Renders as:**

```
┌─────────────────────────────────────────┐
│ [JavaScript] [Rust] [Kotlin]      📋    │ ← Tabs + Copy button
├─────────────────────────────────────────┤
│                                         │
│  import { create } from '@metaplex...'  │
│                                         │
│  const asset = await create(umi, {      │
│    name: 'My NFT',                      │
│    uri: 'https://example.com/...'       │
│  }).sendAndConfirm(umi)                 │
│                                         │
└─────────────────────────────────────────┘
```

### Implementation

**Component:** `CodeTabs.jsx`

```jsx
export function CodeTabs({ children, defaultLanguage }) {
  // Extract code blocks from children
  const codeBlocks = extractCodeBlocks(children)

  // Get preferred language from localStorage
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('preferred-language') || defaultLanguage || 'javascript'
  })

  const handleTabChange = (language) => {
    setActiveTab(language)
    localStorage.setItem('preferred-language', language)

    // Analytics
    analytics.track('code_language_switched', { language })
  }

  return (
    <div className="code-tabs">
      {/* Tab buttons */}
      <div className="tabs-header">
        {codeBlocks.map((block) => (
          <button
            key={block.language}
            onClick={() => handleTabChange(block.language)}
            className={clsx(
              "tab-button",
              activeTab === block.language && "active"
            )}
          >
            <LanguageIcon language={block.language} />
            <span>{block.label}</span>
          </button>
        ))}

        {/* Copy button for active tab */}
        <CopyWithContext
          code={codeBlocks.find(b => b.language === activeTab)?.code}
          context={codeBlocks.find(b => b.language === activeTab)?.context}
        />
      </div>

      {/* Code content */}
      <div className="tabs-content">
        {codeBlocks.map((block) => (
          <div
            key={block.language}
            className={clsx(
              "tab-panel",
              activeTab === block.language ? "block" : "hidden"
            )}
          >
            <Fence language={block.language}>
              {block.code}
            </Fence>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Markdown Syntax:**

Option 1: Markdoc tag (recommended)
```markdown
{% code-tabs defaultLanguage="javascript" %}

{% code-tab language="javascript" label="JavaScript" %}
```javascript
const asset = await create(umi, { ... })
```
{% /code-tab %}

{% code-tab language="rust" label="Rust" %}
```rust
let asset = CreateV1 { ... };
```
{% /code-tab %}

{% /code-tabs %}
```

Option 2: Fence metadata (simpler)
````markdown
```js tab:JavaScript
const asset = await create(umi, { ... })
```

```rust tab:Rust
let asset = CreateV1 { ... };
```
````

**Markdoc Configuration:**

```javascript
// markdoc/tags.js
export const tags = {
  'code-tabs': {
    render: 'CodeTabs',
    attributes: {
      defaultLanguage: {
        type: String,
        default: 'javascript',
      },
    },
  },
  'code-tab': {
    render: 'CodeTab',
    attributes: {
      language: { type: String, required: true },
      label: { type: String, required: true },
    },
  },
}
```

---

## 2. Copy with Context

### Problem

Current copy button only copies visible code:
```javascript
const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://...'
}).sendAndConfirm(umi)
```

**Issue:** Missing imports, `umi` not defined, won't run standalone

### Solution

**Enhanced Copy** includes full working example:

```javascript
// ✅ Full context copied:

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'

// Initialize UMI
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// Your code
const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)

console.log('Asset created:', asset)
```

### Implementation

**Component:** `CopyWithContext.jsx`

```jsx
export function CopyWithContext({ code, context, showToggle = true }) {
  const [copyWithContext, setCopyWithContext] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const textToCopy = copyWithContext && context
      ? `${context.imports}\n\n${context.setup}\n\n${code}\n\n${context.output || ''}`
      : code

    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Analytics
    analytics.track('code_copied', {
      withContext: copyWithContext,
      language: context?.language,
    })
  }

  return (
    <div className="copy-with-context">
      {showToggle && context && (
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={copyWithContext}
            onChange={(e) => setCopyWithContext(e.target.checked)}
          />
          <span>Copy with imports</span>
        </label>
      )}

      <button onClick={handleCopy} className="copy-button">
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <ClipboardIcon className="h-4 w-4" />
            Copy
          </>
        )}
      </button>
    </div>
  )
}
```

**Markdown Syntax:**

```markdown
{% code-with-context
   language="javascript"
   imports="import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { create } from '@metaplex-foundation/mpl-core'"
   setup="const umi = createUmi('https://api.devnet.solana.com').use(mplCore())"
   output="console.log('Asset created:', asset)"
%}
```javascript
const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)
```
{% /code-with-context %}
```

**Alternative: Separate code blocks**

````markdown
```js context:imports hidden
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'
```

```js context:setup hidden
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
```

```js
const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)
```

```js context:output hidden
console.log('Asset created:', asset)
```
````

---

## 3. Visual Flow Diagrams

### Purpose

Show what code does at a high level before diving into implementation.

### Example

**Code:**
```javascript
const umi = createUmi('https://api.devnet.solana.com')
const asset = await create(umi, { name: 'My NFT' }).sendAndConfirm(umi)
```

**Visual Flow:**

```
┌─────────────┐
│ createUmi() │
└──────┬──────┘
       │ Connects to
       ▼
┌─────────────┐
│ Solana RPC  │
│ (Devnet)    │
└──────┬──────┘
       │ Build transaction
       ▼
┌─────────────┐
│  create()   │
│ instruction │
└──────┬──────┘
       │ Sign & send
       ▼
┌─────────────┐
│ Blockchain  │
│   ✓ Asset   │
└─────────────┘
```

### Implementation

**Component:** `CodeFlow.jsx`

```jsx
export function CodeFlow({ steps }) {
  return (
    <div className="code-flow">
      {steps.map((step, index) => (
        <Fragment key={index}>
          <div className="flow-step">
            <div className="step-code">
              <code>{step.code}</code>
            </div>
            <div className="step-description">
              {step.description}
            </div>
            {step.result && (
              <div className="step-result">
                <ArrowRightIcon />
                <span>{step.result}</span>
              </div>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className="flow-arrow">
              <ArrowDownIcon />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  )
}
```

**Markdown Syntax:**

```markdown
{% code-flow %}

{% flow-step code="const umi = createUmi(...)" description="Initialize UMI client" result="Connects to Solana RPC" /%}

{% flow-step code="create(umi, { ... })" description="Build create instruction" result="Transaction prepared" /%}

{% flow-step code=".sendAndConfirm(umi)" description="Sign and submit" result="Asset created on-chain ✓" /%}

{% /code-flow %}
```

**Styling:**

```css
.code-flow {
  @apply my-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg;
}

.flow-step {
  @apply relative p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm;
}

.step-code {
  @apply font-mono text-sm text-accent-600 dark:text-accent-400 mb-2;
}

.step-description {
  @apply text-sm text-slate-600 dark:text-slate-400;
}

.step-result {
  @apply flex items-center gap-2 mt-2 text-sm font-medium text-slate-700 dark:text-slate-300;
}

.flow-arrow {
  @apply flex justify-center my-2 text-accent-500;
}
```

---

## 4. Enhanced Fence Component

### Features to Add

- ✅ Line numbers
- ✅ Line highlighting
- ✅ File name tabs
- ✅ Language icons
- ✅ Terminal output mode
- ✅ Diff mode

### Implementation

**Enhanced Fence.jsx:**

```jsx
export function Fence({
  children,
  language,
  title,              // File name or description
  lineNumbers = true, // Show line numbers
  highlight = [],     // Lines to highlight: [3, 5-7]
  showCopy = true,
  terminal = false,   // Terminal output style
  diff = false,       // Diff view (+/-)
}) {
  const highlightLines = parseHighlight(highlight)

  return (
    <div className="fence-wrapper">
      {/* Header with file name and language */}
      {title && (
        <div className="fence-header">
          <LanguageIcon language={language} />
          <span className="font-mono text-sm">{title}</span>
          {showCopy && <CopyButton text={children} />}
        </div>
      )}

      <Highlight
        code={children.trimEnd()}
        language={language}
        theme={undefined}
      >
        {({ className, style, tokens, getTokenProps }) => (
          <pre
            className={clsx(
              className,
              'scrollbar relative',
              terminal && 'terminal',
              diff && 'diff'
            )}
            style={style}
          >
            {!title && showCopy && <CopyButton text={children} />}

            <code className="block">
              {tokens.map((line, lineIndex) => {
                const lineNumber = lineIndex + 1
                const isHighlighted = highlightLines.includes(lineNumber)

                return (
                  <div
                    key={lineIndex}
                    className={clsx(
                      'code-line',
                      isHighlighted && 'highlighted'
                    )}
                  >
                    {lineNumbers && (
                      <span className="line-number">{lineNumber}</span>
                    )}
                    <span className="line-content">
                      {line
                        .filter((token) => !token.empty)
                        .map((token, tokenIndex) => (
                          <span key={tokenIndex} {...getTokenProps({ token })} />
                        ))}
                    </span>
                  </div>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}

// Helper to parse highlight ranges
function parseHighlight(highlight) {
  if (!Array.isArray(highlight)) return []

  return highlight.flatMap(item => {
    if (typeof item === 'number') return [item]
    if (typeof item === 'string') {
      const [start, end] = item.split('-').map(Number)
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
    return []
  })
}
```

**Markdown Syntax:**

````markdown
```js title:src/create-nft.js lineNumbers:true highlight:3,5-7
import { create } from '@metaplex-foundation/mpl-core'

const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)

console.log('Created:', asset.publicKey)
```
````

**Terminal Output:**

````markdown
```bash terminal
$ pnpm create @metaplex-foundation/core-app
✓ Project created successfully!
✓ Dependencies installed
✓ Ready to code!
```
````

---

## 5. Live Playground

### Overview

Interactive code editor that runs Metaplex code in the browser.

### Technical Approach

**Option A: Embedded Sandbox (Recommended)**
- Use Sandpack (from CodeSandbox)
- Pre-configured with Metaplex dependencies
- Runs in isolated iframe
- Full TypeScript support

**Option B: Custom Playground**
- Monaco Editor (VS Code editor)
- Eval code in Web Worker
- Limited dependencies
- More control, more work

**Option C: External Links**
- Link to CodeSandbox/StackBlitz
- Pre-populated with code
- No maintenance, less integrated

### Recommended: Sandpack Integration

**Component:** `LiveCode.jsx`

```jsx
import { Sandpack } from '@codesandbox/sandpack-react'

export function LiveCode({
  code,
  dependencies = {},
  files = {},
  autorun = false,
  height = 400,
}) {
  const defaultDependencies = {
    '@metaplex-foundation/umi': 'latest',
    '@metaplex-foundation/umi-bundle-defaults': 'latest',
    '@metaplex-foundation/mpl-core': 'latest',
  }

  return (
    <Sandpack
      template="vanilla"
      theme="auto"
      options={{
        showNavigator: false,
        showTabs: true,
        showLineNumbers: true,
        editorHeight: height,
        autorun,
      }}
      files={{
        '/index.js': code,
        '/package.json': {
          code: JSON.stringify({
            dependencies: { ...defaultDependencies, ...dependencies },
          }),
        },
        ...files,
      }}
      customSetup={{
        environment: 'node',
      }}
    />
  )
}
```

**Markdown Syntax:**

````markdown
{% live-code autorun:false %}
```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)

console.log('Asset created:', asset.publicKey)
```
{% /live-code %}
````

### Features

- ✅ Syntax highlighting
- ✅ Auto-completion
- ✅ Error highlighting
- ✅ Console output
- ✅ Dependencies pre-installed
- ✅ Multiple files (if needed)
- ✅ Shareable (URL to playground state)

### Limitations

- ⚠️ Requires wallet connection for real transactions
- ⚠️ Limited to browser-compatible code (no Node.js fs, etc.)
- ⚠️ Large bundle size (~300KB)
- ⚠️ Network requests to Solana RPC

### Phase 4 Enhancement Ideas

- Save playground sessions
- Fork and share
- Connect wallet (Phantom, Solflare)
- Pre-loaded examples library
- Challenge/quiz mode

---

## Component Specifications

### 1. CodeTabs

```typescript
interface CodeTabsProps {
  defaultLanguage?: string
  persist?: boolean              // Save preference to localStorage
  className?: string
  children: React.ReactNode
}

interface CodeTabProps {
  language: string
  label?: string
  icon?: React.ComponentType
  hidden?: boolean               // Hide tab but include in context
  children: React.ReactNode
}
```

### 2. CopyWithContext

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
}
```

### 3. CodeFlow

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

### 4. Enhanced Fence

```typescript
interface FenceProps {
  children: string
  language: string
  title?: string
  lineNumbers?: boolean
  highlight?: Array<number | string> // [3, "5-7", 10]
  showCopy?: boolean
  terminal?: boolean
  diff?: boolean
}
```

### 5. LiveCode

```typescript
interface LiveCodeProps {
  code: string
  language?: string
  dependencies?: Record<string, string>
  files?: Record<string, string>
  autorun?: boolean
  height?: number
  readOnly?: boolean
}
```

---

## Implementation Plan

### Phase 1A: Multi-Language Tabs (Week 1-2)

**Tasks:**
1. Create `CodeTabs` and `CodeTab` components
2. Add Markdoc tag configuration
3. Implement language preference storage
4. Add language icons
5. Update 10 high-traffic pages

**Deliverables:**
- Working component library
- Documentation for content authors
- Sample pages with tabs
- Analytics tracking

### Phase 1B: Copy with Context (Week 2-3)

**Tasks:**
1. Enhance `CopyToClipboardButton` → `CopyWithContext`
2. Add context metadata to Markdoc
3. Create templates for common contexts (UMI setup, etc.)
4. Update 20 high-traffic pages

**Deliverables:**
- Enhanced copy functionality
- Context templates
- Migration guide
- Analytics tracking

### Phase 1C: Visual Enhancements (Week 3-4)

**Tasks:**
1. Add line numbers to Fence
2. Implement line highlighting
3. Add file name headers
4. Create terminal output mode
5. Build CodeFlow component

**Deliverables:**
- Enhanced Fence component
- CodeFlow component
- Usage examples
- Style guide

### Phase 4: Live Playground (Week TBD)

**Tasks:**
1. Evaluate Sandpack vs custom solution
2. Set up dependencies and build config
3. Create LiveCode component
4. Add to high-value tutorial pages
5. Implement wallet connection

**Deliverables:**
- Working playground
- Integration guide
- Example playgrounds
- Performance testing

---

## Content Migration

### Migration Strategy

**Approach:** Gradual, page-by-page enhancement

**Priority Order:**
1. High-traffic pages (top 20 by pageviews)
2. Getting started guides
3. Core feature documentation
4. Advanced guides
5. Reference pages (low priority)

### Migration Helpers

**Script: Identify Multi-Language Opportunities**

```javascript
// scripts/find-multi-language-candidates.js

// Find pages with multiple dialect-switcher blocks
// or repeated code in different languages
// Output: pages ready for CodeTabs migration
```

**Script: Add Context to Code Blocks**

```javascript
// scripts/add-code-context.js

// Analyze code blocks
// Detect missing imports
// Suggest context blocks
// Output: pages needing context
```

### Content Author Guide

**Before:**
````markdown
```javascript
const asset = await create(umi, { ... })
```

```rust
let asset = CreateV1 { ... };
```
````

**After:**
````markdown
{% code-tabs %}

{% code-tab language="javascript" label="JavaScript" %}
```javascript
const asset = await create(umi, { ... })
```
{% /code-tab %}

{% code-tab language="rust" label="Rust" %}
```rust
let asset = CreateV1 { ... };
```
{% /code-tab %}

{% /code-tabs %}
````

**Templates:**

Create reusable context templates:

```markdown
{% import "@/includes/umi-setup.md" %}

```javascript
const asset = await create(umi, {
  name: 'My NFT'
})
```
```

Where `umi-setup.md` contains:
```markdown
```javascript context:imports hidden
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
```

```javascript context:setup hidden
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())
```
```

---

## Success Metrics

### Phase 1 Success Criteria

**Quantitative:**
- [ ] 50%+ code blocks have multi-language tabs
- [ ] Copy rate increases by 20%+ (baseline: TBD)
- [ ] Language preference set by 30%+ of users
- [ ] <3s page load (no performance regression)
- [ ] Zero accessibility issues (WCAG AA)

**Qualitative:**
- [ ] Positive user feedback (>4/5 rating)
- [ ] Reduced "code doesn't work" support tickets
- [ ] Content authors report ease of use
- [ ] Mobile experience rated highly

### Analytics Events

```javascript
// Track these events:

analytics.track('code_language_switched', {
  from: 'javascript',
  to: 'rust',
  page: '/core/create-asset',
})

analytics.track('code_copied', {
  withContext: true,
  language: 'javascript',
  page: '/core/create-asset',
})

analytics.track('code_flow_viewed', {
  flowId: 'create-asset-flow',
  page: '/core/create-asset',
})

analytics.track('live_code_run', {
  language: 'javascript',
  success: true,
  page: '/core/guides/...',
})
```

### A/B Testing

**Test:** Copy with context toggle

**Variants:**
- A: Context always included (no toggle)
- B: Toggle visible (user choice)
- C: Context hidden, "Show full example" link

**Metrics:**
- Copy rate
- User feedback
- Support tickets

---

## Accessibility

### Code Components Must:

- ✅ Support keyboard navigation (Tab, Arrow keys)
- ✅ Provide ARIA labels for screen readers
- ✅ Maintain focus management (tab switching)
- ✅ Support high contrast mode
- ✅ Allow text resizing (no fixed px font sizes)
- ✅ Provide text alternatives for visual elements

### Example ARIA

```jsx
<div role="tablist" aria-label="Code examples">
  <button
    role="tab"
    aria-selected={active}
    aria-controls="code-panel-js"
    id="tab-js"
  >
    JavaScript
  </button>
  {/* ... more tabs */}
</div>

<div
  role="tabpanel"
  id="code-panel-js"
  aria-labelledby="tab-js"
  hidden={!active}
>
  <pre><code>...</code></pre>
</div>
```

---

## Related Documents

- [Redesign Overview](./REDESIGN_OVERVIEW.md)
- [Current Analysis](./CURRENT_ANALYSIS.md)
- [Component Library](./COMPONENT_LIBRARY.md)
- [Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md)

---

**Next Steps:**
1. Review and approve code experience redesign
2. Create proof-of-concept components
3. User test with 5-10 developers
4. Build component library
5. Begin Phase 1A implementation

**Last Updated:** 2025-10-27
