---
title: Withdrawing a Core Candy Machine
metaTitle: Withdrawing a Core Candy Machine | Core Candy Machine
description: How to withdraw and permanently delete a Core Candy Machine to reclaim on-chain storage rent on Solana.
keywords:
  - core candy machine
  - withdraw candy machine
  - delete candy machine
  - deleteCandyMachine
  - reclaim rent
  - Solana rent
  - candy machine cleanup
  - mpl-core-candy-machine
  - on-chain storage
about:
  - Withdrawing and deleting a Core Candy Machine
  - Reclaiming Solana rent from Candy Machine accounts
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

## Summary

The `deleteCandyMachine` instruction permanently removes a [Core Candy Machine](/smart-contracts/core-candy-machine) from the Solana blockchain and returns all stored rent-exempt SOL to the authority wallet. {% .lead %}

- Deletes the Candy Machine account data and reclaims the full rent deposit back to the authority
- This operation is irreversible -- the Candy Machine cannot be reinstated or recovered after withdrawal
- Only the Candy Machine authority can execute this instruction

## Withdrawing a Core Candy Machine Account

The `deleteCandyMachine` function closes the on-chain Candy Machine account, erases all stored data (config lines, settings, item entries), and transfers the rent-exempt SOL balance back to the authority wallet.

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

## Notes

- This operation is irreversible. Once withdrawn, the Candy Machine account and all its data are permanently deleted from the blockchain.
- Withdrawal reclaims the full rent-exempt SOL deposit that was allocated when the Candy Machine was created. Larger collections with more config lines will return more SOL.
- Only withdraw after all minting activity is complete and you no longer need the Candy Machine for any purpose.
- The caller must be the Candy Machine authority; no other wallet can execute the delete instruction.
- If a Candy Guard is associated with the Candy Machine, it must be handled separately -- deleting the Candy Machine does not automatically close the Candy Guard account.

