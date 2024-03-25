---
title: Burning Assets
metaTitle: Core - Burning Assets
description: Learn how to burn Assets on Core
---

Assets can be burnt using the `burn` instruction. This will return the rent-exempt fees to the owner. Only a very small amount of SOL will stay in the account to prevent it from being reopened.

{% totem %}
{% totem-accordion title="Technical Instruction Details" %}
**Instruction Accounts List**

| Account       | Description                                     |
| ------------- | ----------------------------------------------- |
| asset         | The address of the MPL Core Asset.              |
| collection    | The collection to which the Core Asset belongs. |
| payer         | The account paying for the storage fees.        |
| authority     | The owner or delegate of the asset.             |
| systemProgram | The System Program account.                     |
| logWrapper    | The SPL Noop Program.                           |

Some of the accounts may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123).
{% /totem-accordion %}
{% /totem %}

## Code Example

Here is how you can use our SDKs to burn a Core asset. The snippet assumes that you are the owner of the asset.

{% dialect-switcher title="Burning an Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { burnV1 } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await burnV1(umi, {
  asset: asset,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

{% seperator h="6" /%}

## Burning an Asset that is part of a Collection

Here is how you can use our SDKs to burn a Core asset that is part of a collection. The snippet assumes that you are the owner of the asset.

{% dialect-switcher title="Burning an Asset that is part of a collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { burnV1, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAssetV1(umi, assetId)

await burnV1(umi, {
  asset: asset.publicKey,
  collection: collectionAddress(asset),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
