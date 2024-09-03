---
title: Initializing NFT Data
metaTitle: Initializing Escrow | MPL-Hybrid
description: Initializing MPL-Hybrid NFT Data
---

## MPL-Hybrid NFT Data Account Structure

Explain what data is stored and what role that data has for the user.

{% totem %}
{% totem-accordion title="On Chain MPL-Hybrid NFT Data Structure" %}

The onchain account structure of an MPL-Hybrid NFT Data [Link](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/nft_data.rs)

| Name           | Type   | Size | Description                                      |     |
| -------------- | ------ | ---- | ------------------------------------------------ | --- |
| authority      | Pubkey | 32   | The Authority of the Escrow                      |     |
| token          | Pubkey | 32   | The token to be dispensed                        |     |
| fee_location   | Pubkey | 32   | The account to send token fees to                |     |
| name           | String | 4    | The NFT name                                     |     |
| uri            | String | 8    | The base uri for the NFT metadata                |     |
| max            | u64    | 8    | The max index of NFTs that append to the uri     |     |
| min            | u64    | 8    | The minimum index of NFTs that append to the uri |     |
| amount         | u64    | 8    | The token cost to swap                           |     |
| fee_amount     | u64    | 8    | The token fee for capturing the NFT              |     |
| sol_fee_amount | u64    | 8    | The sol fee for capturing the NFT                |     |
| count          | u64    | 8    | The total number of swaps                        |     |
| path           | u16    | 1    | The onchain/off-chain metadata update path       |     |
| bump           | u8     | 1    | The escrow bump                                  |     |

{% /totem-accordion %}
{% /totem %}
