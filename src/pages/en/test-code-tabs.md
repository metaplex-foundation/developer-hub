---
title: Code Tabs Test Page
description: Testing the new CodeTabs component
---

# Code Tabs Component Test

This page tests the new multi-language code tabs component.

## Basic Example

{% code-tabs defaultLanguage="javascript" %}

{% code-tab language="javascript" label="JavaScript" %}
```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'

const umi = createUmi('https://api.devnet.solana.com')

const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json'
}).sendAndConfirm(umi)

console.log('Asset created:', asset.publicKey)
```
{% /code-tab %}

{% code-tab language="rust" label="Rust" %}
```rust
use mpl_core::instructions::CreateV1;
use solana_sdk::signer::Signer;

let asset = CreateV1 {
    name: "My NFT".to_string(),
    uri: "https://example.com/metadata.json".to_string(),
    ..Default::default()
};

let instruction = asset.instruction();

println!("Asset created: {:?}", asset);
```
{% /code-tab %}

{% code-tab language="kotlin" label="Kotlin" %}
```kotlin
import com.metaplex.lib.Metaplex
import com.metaplex.lib.modules.nfts.models.NFT

val metaplex = Metaplex(connection)

val nft = metaplex.nft().create(
    name = "My NFT",
    uri = "https://example.com/metadata.json"
).getOrThrow()

println("Asset created: ${nft.address}")
```
{% /code-tab %}

{% /code-tabs %}

## TypeScript Example

{% code-tabs defaultLanguage="typescript" %}

{% code-tab language="typescript" label="TypeScript" %}
```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create, CreateArgs } from '@metaplex-foundation/mpl-core'
import { PublicKey } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

const args: CreateArgs = {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json',
}

const asset = await create(umi, args).sendAndConfirm(umi)

console.log('Asset created:', asset.publicKey.toString())
```
{% /code-tab %}

{% code-tab language="javascript" label="JavaScript" %}
```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create } from '@metaplex-foundation/mpl-core'

const umi = createUmi('https://api.devnet.solana.com')

const asset = await create(umi, {
  name: 'My NFT',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi)

console.log('Asset created:', asset.publicKey)
```
{% /code-tab %}

{% /code-tabs %}

## Features to Test

1. **Language Switching** - Click between tabs to switch languages
2. **Persistence** - Refresh the page, your language choice should be remembered
3. **Syntax Highlighting** - Code should be properly highlighted
4. **Copy Button** - Copy button should work in each tab
5. **Keyboard Navigation** - Use Tab/Arrow keys to navigate
6. **Mobile** - Test on mobile viewport

## Expected Behavior

- ✅ Tabs appear above the code block
- ✅ Active tab is highlighted
- ✅ Clicking a tab switches the visible code
- ✅ Language preference persists across page reloads
- ✅ Syntax highlighting works for all languages
- ✅ Copy button is visible and functional
- ✅ Keyboard accessible (tab to focus, arrow keys to switch)
- ✅ Screen reader compatible (ARIA labels present)

## Single Language (No Tabs)

Regular code blocks should still work:

```javascript
// This is a regular code block without tabs
const x = 1
console.log(x)
```

---

## 🎯 PROOF OF CONCEPT: Centralized Code Examples

This section demonstrates loading code from a centralized location!

## Example 1: Create an Asset

Code loaded from `src/examples/core/create-asset/` (native .js and .rs files)

## All Frameworks (Kit, Umi, Shank, Anchor)

{% code-tabs-imported from="core/create-asset" /%}

## Only JavaScript Frameworks (Kit + Umi)

{% code-tabs-imported from="core/create-asset" frameworks="kit,umi" defaultFramework="kit" /%}

## Only Rust Frameworks (Shank + Anchor)

{% code-tabs-imported from="core/create-asset" frameworks="shank,anchor" defaultFramework="shank" /%}

## Just Umi

{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}

---

## Example 2: Transfer an Asset

Code loaded from `src/examples/core/transfer-asset/` (native .js and .rs files)

## All Frameworks - Transfer Asset

{% code-tabs-imported from="core/transfer-asset" /%}

## JavaScript Only - Transfer Asset

{% code-tabs-imported from="core/transfer-asset" frameworks="kit,umi" /%}

## Rust Only - Transfer Asset

{% code-tabs-imported from="core/transfer-asset" frameworks="shank,anchor" defaultFramework="anchor" /%}

---

## Benefits of Centralized Examples

✅ **Single Source of Truth** - Code lives in `src/examples/core/create-asset.js`
✅ **Multi-Language Docs** - Same code across EN/JA/KO pages
✅ **Easy Maintenance** - Edit once, updates everywhere
✅ **Testable** - Can run examples in CI
✅ **Reusable** - Same example on multiple pages
✅ **Framework Filtering** - Show only relevant frameworks

---

## Next Steps

If this test page works correctly:
1. Migrate high-traffic pages to use CodeTabs
2. Add more language examples
3. Create documentation for content editors
4. Set up analytics tracking
