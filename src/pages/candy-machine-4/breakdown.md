---
title: Breakdown of A CMV4
metaTitle: Candy Machine V4 - Account Overview
description: Candy Machine V4 on Chain Account Overview
---

## Candy Machine Account Structure

Explain what data is stored and what role that data has for the user.

{% totem %}
{% totem-accordion title="On Chain Candy Machine V4 Data Structure" %}

The onchain account structure of an MPL Core Asset. [Link](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| Name           | Type    | Size | Description                                              |     |
| -------------- | ------- | ---- | -------------------------------------------------------- | --- |
| version        | u8      | 1    | version of the candymachine                              |     |
| features       | [u8; 6] | 6    | What feature flags are enabled for the candy machine     |     |
| authority      | Pubkey  | 32   | The Authority of the Candy Machine                       |     |
| mint_authority | Pubkey  | 32   | The Mint Authority of the Candy Machine                  |     |
| collection     | Pubkey  | 32   | The collection address assigned to the Candy Machine     |     |
| items_redeemed | u64     |      | How many items have been redeemed from the Candy Machine |     |

{% /totem-accordion %}
{% /totem %}
