---
title: Withdrawing a Candy Machine
metaTitle: Candy Machine V4 - Withdrawing a Candy Machine
description: How to fetch the data of a Core Candy Machine V4
---

The withdrawing of a Candy Machine returns all the on chain storage rent cost of the Candy Machine while subsequently deleting the data and making the Candy Machine unusable.

{% callout %}
This operation is irreversible so only withdraw your Candy Machine when you are 100% finished with the minting process. Your Candy Machine can not be reinstated or recovered.
{% /callout %}

{% dialect-switcher title="Create a MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { deleteCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'
import { publicKey } from '@metaplex-foundation/umi'

const candyMachineId = '11111111111111111111111111111111'

await deleteCandyMachine(umi, {
  candyMachine: publicKey(candyMachineId),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
