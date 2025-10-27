---
title: Copy with Context Test
description: Testing enhanced copy functionality
---

# Copy with Context Feature Test

This page demonstrates the new "Copy with Context" feature that allows users to copy either just the code snippet or the full runnable code with imports and setup.

## How It Works

Look for the copy controls in the top-right of each code block:

1. **Snippet** - Copies just the main code (the part you see)
2. **With imports** - Copies full runnable code including:
   - Import statements
   - Setup/initialization code
   - Main code
   - Output/logging code

Try both modes and paste the result to see the difference!

---

## Example 1: Create an Asset

{% code-tabs-imported from="core/create-asset" /%}

### What you get when copying:

**Snippet mode** (just the main code):
```
// Create a new NFT asset
const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)
```

**With imports mode** (full runnable code):
```
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'

// Initialize UMI
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// Create a new NFT asset
const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)

console.log('Asset created:', asset.publicKey)
```

---

## Example 2: Transfer an Asset

{% code-tabs-imported from="core/transfer-asset" /%}

---

## Only JavaScript Frameworks

{% code-tabs-imported from="core/create-asset" frameworks="kit,umi" /%}

---

## Only Rust Frameworks

{% code-tabs-imported from="core/transfer-asset" frameworks="shank,anchor" defaultFramework="anchor" /%}

---

## Benefits

✅ **Beginner-friendly** - Full context makes copy-paste work immediately
✅ **Flexible** - Advanced users can still copy just the snippet
✅ **Time-saving** - No need to hunt for imports and setup
✅ **Learning aid** - Seeing full context helps understanding

## User Story

**Before**: Copy code snippet → Paste → Error: `umi is not defined` → Hunt through docs for imports → Hunt for setup → Finally works

**After**: Toggle "With imports" → Copy → Paste → Works immediately! ✨
