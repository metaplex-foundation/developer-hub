---
title: MPL Core Asset
metaTitle: What is a Core Asset | Metaplex Core
description: Learn what a Core Asset is on Solana. Understand the single-account NFT model, account structure, collection membership, and off-chain metadata.
---

This page explains **what a Core Asset is** and how it differs from traditional Solana NFTs. Understand the account structure, collection relationships, and metadata storage. {% .lead %}

{% callout title="Key Concepts" %}

- **Single-account model**: Core Assets store ownership within the Asset account itself
- **No token accounts**: Unlike SPL tokens, Core doesn't require Associated Token Accounts
- **Collection membership**: Assets can belong to Collections via the updateAuthority field
- **Off-chain metadata**: A URI points to JSON metadata stored on Arweave/IPFS

{% /callout %}

## Summary

A Core Asset is a single Solana account that represents an NFT. Unlike Token Metadata (which requires 3+ accounts), Core stores all essential data in one account: owner, name, URI, and update authority. This makes Core Assets ~80% cheaper and simpler to work with.

## Overview

Setting itself apart from existing Asset programs, like [Solana’s Token program](https://spl.solana.com/token), Metaplex Core and Core Assets (sometimes referred to as Core NFT Assets) do not rely on multiple accounts, like Associated Token Accounts. Instead, Core Assets store the relationship between a wallet and the "mint" account within the asset itself.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="Someone's wallet." theme="transparent" /%}

{% node x="200" parent="wallet" %}
{% node #asset label="Asset Account" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
Stores information about the \
asset, including the owner
{% /node %}

{% edge from="wallet" to="asset" /%}

{% /diagram %}

## The Core Asset Account

The Core Asset account represents the bare minimum data for a digital asset. This structure provides an unopinionated blockchain primitive for onchain ownership.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="Asset Account" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% node label="Key = Asset" /%}
{% node label="Owner" /%}
{% node label="Update Authority" /%}
{% node label="Name" /%}
{% node label="URI" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
{% /node %}

{% edge from="wallet" to="asset" /%}

{% /diagram %}

{% seperator h="6" /%}

{% totem %}
{% totem-accordion title="On Chain Asset Account Structure" %}

The onchain account structure of an MPL Core Asset. [Link](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| Name             | Type            | Size | Description                                                      |                                                                                                                            |
| ---------------- | --------------- | ---- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| key              | u8              | 1    | Discrimator of Account Type                                      |                                                                                                                            |
| owner            | pubKey          | 32   | The owner of the asset.                                          |                                                                                                                            |
| update_authority | enum<publicKey> | 33   | The authority or CollectionID of the new asset.                  | [Link](https://github.com/metaplex-foundation/mpl-core/blob/main/clients/rust/src/generated/types/update_authority.rs#L14) |
| name             | string          | 36   | The name of the asset.                                           |                                                                                                                            |
| uri              | string          | 204  | The URI of the asset that points to the off-chain data.          |                                                                                                                            |
| seq              | string          |      | The sequence number used for indexing with compression.          |                                                                                                                            |

{% /totem-accordion %}
{% /totem %}

## Is my Asset in a Collection?

MPL Core Assets can belong to collections. The `updateAuthority` field in the MPL Core Asset data provides two duties, either to report the update authority of the Asset, or to provide the publicKey of the MPL Core Collection to which it belongs.

When accessing the `updateAuthority` field either directly via the asset, or via the `collectionAddress` helper of the MPL Core Asset, the returning result will be one of the following outcomes:

**Collection**

The asset belongs to the collection at the given address.
{% dialect-switcher title="Create Asset" %}
{% dialect title="JavaScript" id="js" %}

```javascript
{
  __kind: 'Collection'
  fields: [PublicKey]
}
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// log
collection: '2222222222222222222222222222222'
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'Collection',
      address: '2222222222222222222222222222222'
    },
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
    ...
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
Collection(Pubkey)
```

{% /dialect %}
{% /dialect-switcher %}

**Address**

The asset has an update authority set and does not belong to a collection.
{% dialect-switcher title="Create Asset" %}
{% dialect title="JavaScript" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// log
collectionId: undefined
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'Address',
      address: '2222222222222222222222222222222'
    }
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
    ...
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
Address(Pubkey)
```

{% /dialect %}
{% /dialect-switcher %}

**None**

The asset has no update authority set.

{% dialect-switcher title="Create Asset" %}
{% dialect title="JavaScript" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// log
collectionId: undefined
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'None',
    },
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
None
```

{% /dialect %}
{% /dialect-switcher %}

## Off Chain Metadata

One important attribute of the Asset Account is the `URI` attribute that points to a JSON file off-chain. This is used to safely provide additional data whilst not being constrained by the fees involved in storing onchain data. That JSON file [follows a certain standard](/smart-contracts/token-metadata/token-standard) that anyone can use to find useful information on tokens.

Off Chain Metadata can be stored at any publicly accessible location. Popular places to host your json files include;

- Arweave
- NFT.Storage/IPFS
- Amazon AWS S3/Google Cloud

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="Asset Account" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% node label="Key = Asset" /%}
{% node label="Owner" /%}
{% node label="Update Authority" /%}
{% node label="Name" /%}
{% node #uri label="URI" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
{% /node %}

{% node parent="uri" x="-200" y="-23" %}
{% node #json theme="slate" %}
Off-chain \
JSON Metadata
{% /node %}
{% node label="Name" /%}
{% node label="Description" /%}
{% node label="Image" /%}
{% node label="Animated URL" /%}
{% node label="Attributes" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="asset" /%}
{% edge from="uri" to="json" path="straight" /%}

{% /diagram %}

{% partial file="token-standard-full.md" /%}

{% totem %}
{% totem-accordion title="Example" %}

```json
{
  "name": "SolanaArtProject #1",
  "description": "Generative art on Solana.",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
  "animation_url": "https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://www.arweave.net/abcd5678?ext=png",
        "type": "image/png"
      },
      {
        "uri": "https://watch.videodelivery.net/9876jkl",
        "type": "unknown",
        "cdn": true
      },
      {
        "uri": "https://www.arweave.net/efgh1234?ext=mp4",
        "type": "video/mp4"
      }
    ],
    "category": "video"
  }
}
```

{% /totem-accordion %}
{% /totem %}

Note that, this JSON file can be stored using a permanent storage solution such as Arweave to ensure it cannot be updated. Additionally, one can set the `Update Authority` field to None to make it immutable and, therefore, forbid the `URI` and `Name` attributes to ever be changed. Using this combination, we can guarantee the immutability of the off-chain JSON file.

## FAQ

### How is Core different from Token Metadata NFTs?

Token Metadata requires 3+ accounts (mint, metadata, token account). Core uses a single account that stores owner and metadata together. This makes Core ~80% cheaper and faster to create.

### What data is stored on-chain vs off-chain?

**On-chain**: owner, name, URI, update authority, plugins. **Off-chain** (at the URI): description, image, attributes, animation URL, and other extended metadata.

### Can I convert a Token Metadata NFT to Core?

Not directly. Core and Token Metadata are separate standards. You would need to burn the old NFT and mint a new Core Asset. Some migration tools exist to help with this process.

### Is Core compatible with existing NFT marketplaces?

Most major Solana marketplaces support Core Assets. Check [Ecosystem Support](/smart-contracts/core/ecosystem-support) for the current list of compatible platforms.

### What happens if the off-chain metadata goes offline?

The Asset still exists on-chain with its name and URI, but the image/attributes won't be accessible. Use permanent storage (Arweave, IPFS with pinning) to prevent this.

## Glossary

| Term | Definition |
|------|------------|
| **Asset** | A single Core account representing an NFT |
| **Owner** | The wallet that currently owns the Asset |
| **Update Authority** | The account authorized to modify Asset metadata |
| **URI** | URL pointing to off-chain JSON metadata |
| **Collection** | A Core account that groups related Assets |
| **Key** | Account discriminator identifying the account type |
| **seq** | Sequence number used for compression indexing |

---

*Maintained by Metaplex Foundation · Last verified January 2026 · Applies to @metaplex-foundation/mpl-core*
