---
title: Enhanced Fence Component - Test Page
description: Testing all new features of the enhanced Fence component
---

# Enhanced Fence Component Test

This page demonstrates all the new features added to the Fence component.

---

## 1. Basic Code Block (Backward Compatible)

Standard code block without any enhancements:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`)
  return `Welcome to the docs!`
}

greet('Developer')
```

---

## 2. Code Block with Line Numbers

Use `showLineNumbers` to display line numbers:

```javascript {% showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'

const umi = createUmi('https://api.devnet.solana.com')

const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)

console.log('Created:', asset.publicKey)
```

---

## 3. Highlight Specific Lines

Use `highlightLines` to highlight important lines:

```javascript {% showLineNumbers=true highlightLines="3,7-9" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'

const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)

console.log('Created:', asset.publicKey)
```

Lines 3 and 7-9 are highlighted!

---

## 4. Show Only Specific Lines (Line Range)

Use `showLines` to display only certain lines:

```javascript {% showLineNumbers=true showLines="1-3,10-11" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'

const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)

console.log('Created:', asset.publicKey)
```

Only showing lines 1-3 and 10-11 (with proper line numbers maintained)!

---

## 5. Code Block with Title

Use `title` to show a filename or description:

```javascript {% title="src/examples/create-nft.js" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'

const umi = createUmi('https://api.devnet.solana.com')

const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)
```

---

## 6. All Features Combined

Title + Line Numbers + Highlighting + Line Range:

```javascript {% title="config/setup.js" showLineNumbers=true highlightLines="15-17" showLines="10-20" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { signerIdentity } from '@metaplex-foundation/umi'
import { generateSigner } from '@metaplex-foundation/umi'

// Setup Umi instance
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// Generate a new keypair for the asset
const assetSigner = generateSigner(umi)

// Create the asset with all metadata
const asset = await create(umi, {
  asset: assetSigner,
  name: 'My Amazing NFT',
  uri: 'https://arweave.net/my-metadata.json',
  collection: collectionAddress,
}).sendAndConfirm(umi)

console.log('Asset created at:', assetSigner.publicKey)
console.log('Transaction signature:', asset.signature)
```

Showing lines 10-20 with lines 15-17 highlighted!

---

## 7. Rust Example with Features

```rust {% title="programs/my-program/src/lib.rs" showLineNumbers=true highlightLines="8-12" %}
use anchor_lang::prelude::*;
use mpl_core::instructions::TransferV1;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod transfer_asset {
    use super::*;

    pub fn transfer(ctx: Context<TransferAsset>) -> Result<()> {
        let asset = &mut ctx.accounts.asset;
        asset.owner = ctx.accounts.new_owner.key();
        Ok(())
    }
}
```

---

## Feature Summary

✅ **Line Numbers** - `showLineNumbers=true`
✅ **Line Highlighting** - `highlightLines="1,3-5,10"`
✅ **Line Range** - `showLines="1-10,15-20"`
✅ **Title/Filename** - `title="path/to/file.js"`
✅ **Copy Button** - Already included by default
✅ **Backward Compatible** - All existing code blocks still work!

---

## Usage in Markdown

````markdown
```javascript {% title="example.js" showLineNumbers=true highlightLines="5-7" %}
// Your code here
```
````

The Fence component now supports professional code documentation! 🎉

---

## Integration with Tabbed Code Examples

The enhanced Fence features also work with **multi-framework code tabs**!

## 8. Basic Tabbed Code (Copy with Context)

Standard tabbed code with Snippet/Full toggle:

{% code-tabs-imported from="core/create-asset" /%}

---

## 9. Tabbed Code with Line Numbers

Add line numbers to all tabs:

{% code-tabs-imported from="core/create-asset" showLineNumbers=true /%}

---

## 10. Tabbed Code with Highlighting

Highlight important lines across all tabs:

{% code-tabs-imported from="core/transfer-asset" showLineNumbers=true highlightLines="6-9" /%}

Lines 6-9 are highlighted in each framework!

---

## 11. All Features Together in Tabs

Line numbers + highlighting + Snippet/Full toggle:

{% code-tabs-imported from="core/create-asset" showLineNumbers=true highlightLines="3,6-9" /%}

---

## Complete Feature Matrix

| Feature | Standalone Code | Tabbed Code | Example |
|---------|----------------|-------------|---------|
| **Line Numbers** | ✅ | ✅ | `showLineNumbers=true` |
| **Line Highlighting** | ✅ | ✅ | `highlightLines="1-5,7"` |
| **Line Range** | ✅ | ✅ | `showLines="1-10,15-20"` |
| **Title/Filename** | ✅ | ⚠️ Per-tab only | `title="file.js"` |
| **Copy Button** | ✅ | ✅ | `showCopy=true` |
| **Snippet/Full Toggle** | ❌ | ✅ | Automatic in tabs |
| **Multi-Framework** | ❌ | ✅ | code-tabs-imported |

---

## Combined Power! 💪

Now you can:

1. **Show multi-framework examples** with tabs (Kit, Umi, Shank, Anchor)
2. **Toggle between Snippet and Full** code with one click
3. **Display line numbers** for easy reference
4. **Highlight important lines** to focus attention
5. **Show only relevant lines** with line ranges
6. **Add titles** to provide context
7. **Sync preferences** across all code blocks on the page!

This makes the documentation professional, beginner-friendly, and developer-focused all at once! 🎉
