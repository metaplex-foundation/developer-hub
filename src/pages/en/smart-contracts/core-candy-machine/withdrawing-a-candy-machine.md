---
title: Withdrawing a Core Candy Machine
metaTitle: Withdrawing a Core Candy Machine | Core Candy Machine
description: How to withdraw a Core Candy Machine and claim back rent from it.
---

The withdrawing of a Core Candy Machine returns all the on chain storage rent cost of the Candy Machine while subsequently deleting the data and making the Candy Machine unusable.

{% callout %}
This operation is irreversible so only withdraw your Core Candy Machine when you are 100% finished with the minting process. Your Core Candy Machine can not be reinstated or recovered.
{% /callout %}

{% dialect-switcher title="Withdraw a Core Candy Machine" %}
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
