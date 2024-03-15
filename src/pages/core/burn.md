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
| authority     | The owner or delegate of the asset.             |
| payer         | The account paying for the storage fees.        |
| systemProgram | The System Program account.                     |
| logWrapper    | The SPL Noop Program.                           |

Some of the accounts may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/processor/burn.rs).
{% /totem-accordion %}
{% /totem %}

## Code Example

Here is how you can use our SDKs to burn a Core asset. The snippet assumes that you are the owner of the asset.

{% dialect-switcher title="Burning an Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { burn } from '@metaplex-foundation/mpl-core'

await burn(umi, {
  asset: asset.publicKey,
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
import { burn } from '@metaplex-foundation/mpl-core'

await burn(umi, {
  asset: asset.publicKey,
  collection: collectionAdress,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
