---
title: Withdrawing a Candy Machine
metaTitle: Withdrawing a Core Candy Machine | Core Candy Machine
description: How to withdraw a Core Candy Machine and claim back rent from it.
---

**Note**: This is an **IRREVERSIBLE** action. Since there is no way to reinstate/recover a Candy Machine after this action, you should look at withdrawing from the Candy Machine only if the minting process is 100% done.  

## Withdrawing a Candy Machine

Withdrawing a Candy Machine means deleting all its onchain data and retrieving the rent cost making the account effectively unusable. 

**Note**: Note: This process applies to all types of Candy Machines (with Config Line Settings, Hidden Settings, and Guards). However, if your Candy Machine has an associated Candy Guard, this instruction will not withdraw the rent from that as well. To learn how to withdraw a Candy Guard, refer to this [paragraph]().

Here is an example of how to withdraw a Core Candy Machine:

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
