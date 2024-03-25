---
title: Updating Assets
metaTitle: Core - Updating Assets
description: Learn how to update Assets on Core
---

The update authority or delegate of an Asset has the ability to change some of the core Asset data.

{% totem %}
{% totem-accordion title="Technical Instruction Details" %}

**Instruction Accounts List**

| Account            | Description                                     |
| ------------------ | ----------------------------------------------- |
| asset              | The address of the MPL Core Asset.              |
| collection         | The collection to which the Core Asset belongs. |
| payer              | The account paying for the storage fees.        |
| authority          | The owner or delegate of the asset.             |
| newUpdateAuthority | The new update authority of the asset.          |
| systemProgram      | The System Program account.                     |
| logWrapper         | The SPL Noop Program.                           |

**Instruction Arguments**

| Args    | Description                      |
| ------- | -------------------------------- |
| newName | The new name of your Core Asset. |
| newUri  | The new off-chain metadata URI.  |

Some of the accounts/args may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed here. [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)

{% /totem-accordion %}
{% /totem %}

## Updating an Asset

Here is how you can use our SDKs to update an MPL Core Asset.

{% dialect-switcher title="Update an Asset" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateV1 } from 'core-preview'

const asset = publicKey('11111111111111111111111111111111')

await updateV1(umi, {
  asset: asset,
  newName: 'New Nft Name',
  newUri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Making Asset Data Immutable

Here is how you can use our SDKs to update an MPL Core Asset.

{% dialect-switcher title="Update an Asset" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateV1 } from 'core-preview'

const asset = publicKey('11111111111111111111111111111111')

await updateV1(umi, {
  asset: asset,
  
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
