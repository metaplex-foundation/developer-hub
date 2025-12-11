# Centralized Code Examples - Implementation Complete ✅

## Overview

Successfully implemented a system for managing code examples in native files (.js, .rs) that can be imported across multiple documentation pages and languages (EN/JA/KO).

## What Was Built

### 1. Components

**CodeTabs.jsx** (`src/components/code/CodeTabs.jsx`)
- Multi-language code tab component
- Tracks active tab by index (not language) to support multiple tabs with same language
- Persists user's language preference to localStorage
- Hydration-safe: uses two-phase render to prevent server/client mismatch
- Supports keyboard navigation and ARIA labels

**CodeTab.jsx** (`src/components/code/CodeTabs.jsx`)
- Individual tab component (rendered by CodeTabs parent)

**CodeTabsImported.jsx** (`src/components/code/CodeTabsImported.jsx`)
- Loads centralized examples from `src/examples/`
- Supports framework filtering (e.g., show only "kit,umi")
- Default framework selection
- Comprehensive error handling

### 2. Build System

**scripts/build-examples.js**
- Reads native .js and .rs files
- Generates index.js files with code inlined as string constants
- Preserves metadata (title, description, tags)
- Run with: `pnpm run build-examples`

**webpack Configuration** (`next.config.js`)
- `noParse` option prevents webpack from parsing example files
- `fallback: { fs: false, path: false }` prevents client-side bundling errors

### 3. Example Structure

```
src/examples/
└── core/
    ├── create-asset/
    │   ├── kit.js        # Native JS with full syntax highlighting
    │   ├── umi.js        # Native JS with full syntax highlighting
    │   ├── shank.rs      # Native Rust with full syntax highlighting
    │   ├── anchor.rs     # Native Rust with full syntax highlighting
    │   └── index.js      # AUTO-GENERATED (don't edit manually)
    └── transfer-asset/
        ├── kit.js
        ├── umi.js
        ├── shank.rs
        ├── anchor.rs
        └── index.js      # AUTO-GENERATED
```

### 4. Markdoc Configuration

**markdoc/tags.js**
- Registered `code-tabs` tag for inline code tabs
- Registered `code-tab` tag for individual tabs
- Registered `code-tabs-imported` tag (self-closing) for centralized examples

### 5. Styling

**src/styles/prism.css**
- Dark mode: slate-900 background with slate-800 border
- Light mode: slate-50 background with slate-200 border
- Code blocks inside CodeTabs have no border (parent provides unified border)
- Proper contrast and visual hierarchy

## Usage

### In Markdown Files

```markdown
## All Frameworks

{% code-tabs-imported from="core/create-asset" /%}

## JavaScript Only

{% code-tabs-imported from="core/create-asset" frameworks="kit,umi" /%}

## Rust Only

{% code-tabs-imported from="core/transfer-asset" frameworks="shank,anchor" /%}

## Single Framework

{% code-tabs-imported from="core/create-asset" frameworks="umi" defaultFramework="umi" /%}
```

**IMPORTANT**: Note the `/%}` syntax (not just `%}`) - this is Markdoc's self-closing tag syntax.

### Creating New Examples

1. Create directory: `src/examples/[product]/[example-name]/`
2. Add native files: `kit.js`, `umi.js`, `shank.rs`, `anchor.rs`
3. Create basic `index.js` with metadata:
   ```javascript
   export const metadata = {
     title: 'Example Title',
     description: 'Brief description',
     tags: ['core', 'nft', 'beginner'],
   }
   export const examples = {}
   ```
4. Run: `pnpm run build-examples`
5. Use in markdown with `{% code-tabs-imported from="[product]/[example-name]" /%}`

## Key Technical Decisions

### 1. Build-Time Inlining vs Runtime fs.readFileSync

**Decision**: Build-time inlining (via scripts/build-examples.js)

**Why**:
- Eliminates SSR hydration issues (same code on server and client)
- No runtime file I/O operations
- Works identically in development and production
- Simpler mental model

### 2. Tab Tracking by Index vs Language

**Decision**: Track by tab index

**Why**:
- Supports multiple tabs with same language (Kit and Umi both use JavaScript)
- Each tab is independent
- More predictable behavior

### 3. Two-Phase Hydration

**Decision**: Render with default language first, update to localStorage preference after hydration

**Why**:
- Prevents hydration mismatch errors
- Server and client HTML match perfectly
- Brief flash to preferred language is acceptable trade-off

### 4. Native File Extensions (.js, .rs)

**Decision**: Keep native extensions, use webpack noParse

**Why**:
- Full IDE syntax highlighting in editors
- Developers can write real code with imports
- webpack's noParse prevents import resolution errors

## Problems Solved

1. ✅ **Hydration Mismatch**: Build-time inlining + two-phase render
2. ✅ **Tab Selection**: Index-based tracking instead of language-based
3. ✅ **Syntax Highlighting**: Native file extensions + webpack noParse
4. ✅ **Code Block Styling**: Proper dark/light mode contrast
5. ✅ **Markdoc Parsing**: Self-closing tag syntax `/%}`
6. ✅ **Multiple Languages**: Centralized examples work across EN/JA/KO

## Test Pages

- `/test-code-tabs` - Comprehensive test with all features
- `/test-two-examples` - Simple test with 2 examples
- `/test-centralized-examples` - Centralized examples only
- `/test-simple` - Minimal test

## Documentation

- **For Developers**: `src/examples/README.md` - Complete workflow guide
- **For Components**: JSDoc comments in component files
- **For Users**: This document

## Next Steps

1. **Migrate Production Pages**: Start using centralized examples on real docs
2. **Add More Examples**: Create examples for other MPL products
3. **Analytics**: Track which frameworks developers prefer
4. **Performance**: Monitor bundle size impact
5. **Accessibility**: User testing with screen readers

## Files Modified/Created

### Created
- `src/components/code/CodeTabs.jsx`
- `src/components/code/CodeTabsImported.jsx`
- `src/examples/core/create-asset/kit.js`
- `src/examples/core/create-asset/umi.js`
- `src/examples/core/create-asset/shank.rs`
- `src/examples/core/create-asset/anchor.rs`
- `src/examples/core/create-asset/index.js` (auto-generated)
- `src/examples/core/transfer-asset/kit.js`
- `src/examples/core/transfer-asset/umi.js`
- `src/examples/core/transfer-asset/shank.rs`
- `src/examples/core/transfer-asset/anchor.rs`
- `src/examples/core/transfer-asset/index.js` (auto-generated)
- `src/examples/README.md`
- `scripts/build-examples.js`
- `src/pages/test-code-tabs.md`
- `src/pages/test-two-examples.md`
- `src/pages/test-centralized-examples.md`
- `src/pages/test-simple.md`

### Modified
- `markdoc/tags.js` - Added code-tabs, code-tab, code-tabs-imported
- `next.config.js` - Added webpack noParse and fallback config
- `package.json` - Added build-examples script
- `src/styles/prism.css` - Added styling for code blocks and tabs

## Success Metrics

✅ All examples render correctly
✅ Tab switching works for all frameworks
✅ Native files have full syntax highlighting in IDE
✅ No hydration errors
✅ No console errors
✅ Works in both light and dark modes
✅ Multiple examples can be used on same page
✅ Language preference persists across page loads

## Proof of Concept: COMPLETE ✅

The centralized code examples system is now fully functional and ready for production use!
