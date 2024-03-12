---
title: Updating Assets
metaTitle: Core - Updating Assets
description: Learn how to update Assets on Core
---

The update authority or delegate of an Asset has the ability to change some of the core Asset data.

## Instruction Account List

| Account       | Description                                     |
| ------------- | ----------------------------------------------- |
| asset         | The address of the MPL Core Asset.              |
| collection    | The collection to which the Core Asset belongs. |
| authority     | The owner or delegate of the asset.             |
| payer         | The account paying for the storage fees.        |
| newOwner      | The new owner to which to transfer the asset.   |
| systemProgram | The System Program account.                     |
| logWrapper    | The SPL Noop Program.                           |

## Instruction Args

| Args    | Description                      |
| ------- | -------------------------------- |
| newName | The new name of your Core Asset. |
| newUri  | The new off-chain metadata URI.  |

Some of the accounts/args may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed here. [Github](https://github.com)

## Updating an Asset

Here is how you can use our SDKs to update an MPL Core Asset.

{% dialect-switcher title="Update an Asset" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { update } from '@metaplex-foundation/core'

await update(umi, {
  asset: asset.publicKey,
  newName: 'New Nft Name',
  newUri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
