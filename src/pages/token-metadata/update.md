---
title: Updating Assets
metaTitle: Updating Assets | Token Metadata
description: Learn how to update Assets on Token Metadata
---

The update authority of an asset can update its **Metadata** account using the **Update** instruction as long as the **Is Mutable** attribute is set to `true`. The **Update** instruction requires the **Update Authority** to sign the transaction and can update the following attributes of the **Metadata** account:

## Updatable Fields

Note that certain delegated authorities can also update the **Metadata** account of assets as discussed in the "[Delegated Authorities](/token-metadata/delegates)" page.

### The Data Object

The object that defines the Name, Symbol, URI, Seller Fee Basis Points and the array of Creators of the asset. Note that the update authority can only add and/or remove unverified creators from the Creators array. The only exception is if the creator is the update authority, in which case the added or removed creators can be verified.

```ts
const data = {
  name: 'New Name',
  symbol: 'New Symbol',
  uri: 'https://newuri.com',
  sellerFeeBasisPoints: 500,
  creators: [],
}
```

### Primary Sale Happened

Primary Sale Happened: A boolean that indicates whether the asset has been sold before.

```ts
primarySaleHappened: true
```

### Is Mutable

A boolean that indicates whether the asset can be updated again. When changing this to false, any future updates will fail.

```ts
isMutable: true
```

### Collection

Collection: This attribute enables us to set or clear the collection of the asset. Note that when setting a new collection, the verified boolean must be set to false and [verified using another instruction](/token-metadata/collections).

#### Setting A Collection

```ts
collection: collectionToggle('Set', [
  {
    key: publicKey('11111111111111111111111111111111'),
    verified: false,
  },
])
```

#### Clearing a Collection

```ts
collection: collectionToggle("Clear"),
```

### New Update Authority

A new update authority can be assigned to an Asset by passing in the `newUpdateAuthority` field.

```ts
newUpdateAuthority: publicKey('1111111111111111111111111111111')
```

### Programable RuleSets

This attribute enables us to set or clear the rule set of the asset. This is only relevant for [Programmable Non-Fungibles](/token-metadata/pnfts).

```ts
newUpdateAuthority: publicKey('1111111111111111111111111111111')
```

Here is how you can use our SDKs to update an asset on Token Metadata.

## Update As Update Authority

### NFT Asset

This example shows you how to update an NFT Asset as the update Authority of the Asset.

{% dialect-switcher title="Update Assets" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  updateV1,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateV1(umi, {
  mint,
  authority: updateAuthority,
  data: { ...initialMetadata, name: 'Updated Asset' },
}).sendAndConfirm(umi)
```

If you want to update more than just the **Data** attribute of the **Metadata** account, simply provide these attributes to the `updateV1` method.

```ts
import {
  updateV1,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateV1(umi, {
  mint,
  authority: updateAuthority,
  data: { ...initialMetadata, name: 'Updated Asset' },
  primarySaleHappened: true,
  isMutable: true,
  // ...
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### pNFT Asset

This example shows you how to update a Programable NFT (pNFT) Asset as the update Authority of the Asset.

{% dialect-switcher title="pNFT Asset Update" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getMplTokenAuthRulesProgramId } from '@metaplex-foundation/mpl-candy-machine'
import {
  collectionToggle,
  fetchMetadataFromSeeds,
  TokenStandard,
  updateAsUpdateAuthorityV2,
} from '@metaplex-foundation/mpl-token-metadata'
import { publicKey, unwrapOptionRecursively } from '@metaplex-foundation/umi'

// The Mint ID of the pNFT Asset
const mintId = publicKey('HckzL4iRK3j6DsznzedwNFzmFj4z7xCBoRkMMrd8THd5')

// Fetch the Metadata of the pNFT Asset
const metadata = await fetchMetadataFromSeeds(umi, { mint: mintId })

// Set the new Data of the pNFT Asset
const data = {
  name: 'New Name',
  symbol: 'New Symbol',
  uri: 'https://newuri.com',
  sellerFeeBasisPoints: 500,
  creators: [],
}

// Update the pNFT as the Update Authority
const txRes = await updateAsUpdateAuthorityV2(umi, {
  mint: mintId,
  data: data,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  collection: collectionToggle('Clear'),
  // Check to see if the pNFT asset as auth rules.
  authorizationRules:
    unwrapOptionRecursively(metadata.programmableConfig)?.ruleSet || undefined,
  // Auth rules program ID
  authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi),
  // You may have to set authorizationData if required by the authorization rules
  authorizationData: undefined,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
