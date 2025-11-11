# GitHub Code Import vs Centralized Examples

## Overview

There are two approaches for managing code examples in the documentation:

1. **Centralized Examples** (what we just built) - Local native files
2. **GitHub Code Import** (PR #333) - Fetch from GitHub repos

Both have valid use cases and can coexist!

## When to Use Each

### Centralized Examples (`code-tabs-imported`)

**Use when**:
- Writing tutorial/guide code specifically for docs
- Need multi-framework examples (Kit, Umi, Shank, Anchor)
- Want fast page loads (no network dependency)
- Need offline support
- Code changes rarely or you control the updates

**Example**:
```markdown
{% code-tabs-imported from="core/create-asset" frameworks="kit,umi" /%}
```

### GitHub Code Import (`github-code`)

**Use when**:
- Showing actual implementation from production repos
- Want code to auto-update when repo changes
- Referencing test files or real examples
- Need to show specific line ranges from large files

**Example**:
```markdown
{% github-code
   repo="metaplex-foundation/mpl-core"
   filePath="clients/js/test/transfer.test.ts"
   startLine="14"
   endLine="28"
   language="typescript" /%}
```

## Issues with Current PR Implementation

### 1. SSR Hydration Mismatch

**Problem**:
```javascript
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchCode() // Client-side only
}, [])

if (loading) return <div>Loading...</div>
```

- Server renders "Loading..."
- Client fetches and shows code
- React throws hydration error

**Solution**: Fetch at build time, not runtime

### 2. No Caching

**Problem**: Every page load fetches from GitHub
- Slow page loads
- GitHub API rate limits (60 requests/hour unauthenticated)
- Fails if GitHub is down

**Solution**: Cache with SWR or fetch at build time

### 3. Hardcoded Branch

**Problem**: `const branch = 'main'` always fetches from main
- Can't pin to specific version
- Breaking changes in main break docs

**Solution**: Make branch/tag configurable

## Recommended Implementation

### Option A: Build-Time Fetch (Recommended)

Create a similar build script to our `build-examples.js`:

```javascript
// scripts/fetch-github-code.js
const fs = require('fs')
const path = require('path')

async function fetchGitHubCode(repo, filePath, branch = 'main') {
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)
  return await response.text()
}

// Run during build:
// pnpm run fetch-github-code
```

Then render the pre-fetched code without useEffect.

### Option B: Server-Side Fetch with Caching

Use Next.js `getStaticProps` or SWR with long cache:

```javascript
export function GitHubCode({ repo, filePath, startLine, endLine, language }) {
  const { data: code, error } = useSWR(
    `github:${repo}:${filePath}`,
    () => fetchGitHubCode(repo, filePath),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0, // Never auto-refresh
      dedupingInterval: 3600000, // 1 hour
    }
  )

  // No loading state on initial render (SSR provides data)
  if (!code) return null

  return <Fence language={language}>{extractLines(code, startLine, endLine)}</Fence>
}
```

### Option C: Hybrid Approach

Use centralized examples for most docs, GitHub imports for:
- Showing test files from actual repos
- Referencing production implementations
- One-off examples where you want to ensure freshness

## Recommended Architecture

```
Documentation Code Examples
├── Centralized Examples (Tutorial Code)
│   ├── src/examples/core/create-asset/
│   │   ├── kit.js ✏️ (write in IDE)
│   │   ├── umi.js ✏️
│   │   └── index.js (auto-generated)
│   └── pnpm run build-examples
│
└── GitHub Imports (Production Code)
    ├── scripts/fetch-github-code.js
    ├── .github-code-cache/ (cached at build time)
    └── pnpm run fetch-github-code
```

## Usage Together

```markdown
## Tutorial Example (Centralized)

Learn how to create an asset:

{% code-tabs-imported from="core/create-asset" frameworks="kit,umi" /%}

## Real Implementation (GitHub)

See how we test this in our actual codebase:

{% github-code
   repo="metaplex-foundation/mpl-core"
   filePath="clients/js/test/create.test.ts"
   startLine="10"
   endLine="25"
   language="typescript" /%}
```

## Recommendation

1. **Keep both systems** - they serve different purposes
2. **Fix GitHub Code implementation** to use build-time fetch or proper SSR
3. **Use Centralized Examples** for 90% of docs (tutorials, guides)
4. **Use GitHub Code** for 10% (showing real implementations, tests)

## Implementation Priority

1. ✅ **Centralized Examples** - Already complete and working
2. 🔄 **GitHub Code** - Needs fixes before merging:
   - [ ] Build-time fetch instead of useEffect
   - [ ] Proper caching strategy
   - [ ] Configurable branch/tag
   - [ ] Handle rate limits gracefully
   - [ ] Add to build process

Would you like me to help implement a build-time version of the GitHub Code component?
