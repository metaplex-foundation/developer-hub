---
title: Offer
metaTitle: Offer | Bakstag
description: Learn what an offer is composed of.
---

An offer is the core component of the OTC Market. Each offer is composed of a unique identifier (ID) and a set of parameters. {% .lead %}

{% callout title="Sell vs. Buy Offers" type="note" %}
Every offer can be interpreted either as a sell or a buy offer. For example, selling 100 SOL for 1 ETH is equivalent to buying 1 ETH for 100 SOL. However, when it comes to technical details, we strictly adhere to sell offers.
{% /callout %}


## Parameters

The main parameters of the offer are:

### Advertiser Parties
  - **Source Seller Address:** The address of the account on the source chain used by the advertiser to create the offer. It is required for authorization, ensuring only the seller can cancel the offer.
  - **Destination Seller Address:** The address where buyers send the destination amount upon accepting the offer.
### Path
  - **Source Endpoint ID:** The LayerZero endpoint ID for the source chain, indicating where the offer is created.
  - **Destination Endpoint ID:** The LayerZero endpoint ID for the destination chain, indicating where the offer is accepted.
### Token Pair
  - **Source Token address:** The token being sold by the advertiser.  
  - **Destination Token address:** The token received by the advertiser.
### Pricing
  - **Source Amount:** The total amount of the source token to sell. Locked in the [Escrow](/) when the offer is created.
  - **Exchange Rate:** The number of destination tokens paid by the buyer for each source token [dst/src].

Later on we will use source meaning offer's source and destination meaning offer's destination.

{% diagram %}
{% node %}
{% node label="Offer" /%}
{% node label="ID" /%}
{% node label="Source Seller Address" theme="red" /%}
{% node label="Destination Seller Address" theme="red" /%}
{% node label="Source Endpoint ID" theme="green" /%}
{% node label="Destination Endpoint ID" theme="green" /%}
{% node label="Source Token Address" theme="blue" /%}
{% node label="Destination Token Address" theme="blue" /%}
{% node label="Source Amount" theme="purple" /%}
{% node label="Exchange Rate" theme="purple" /%}
{% /node %}
{% /diagram %}

### Types

{% dialect-switcher title="Offer structure" %}
{% dialect title="Solidity" id="solidity" %}
```solidity
struct Offer {
  bytes32 srcSellerAddress;
  bytes32 dstSellerAddress;
  uint32 srcEid;
  uint32 dstEid;
  bytes32 srcTokenAddress;
  bytes32 dstTokenAddress;
  uint64 srcAmountSD;
  uint64 exchangeRateSD;
}
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
#[account]
#[derive(InitSpace)]
pub struct Offer {
    pub src_seller_address: [u8; 32],
    pub dst_seller_address: [u8; 32],
    pub src_eid: u32,
    pub dst_eid: u32,
    pub src_token_address: [u8; 32],
    pub dst_token_address: [u8; 32],
    pub src_amount_sd: u64,
    pub exchange_rate_sd: u64,

    pub bump: u8,
}
```
{% /dialect %}
{% /dialect-switcher %}

Addresses use `bytes32` for handling non-EVM chains. Source amount and exchange rate are represented in `uint64` and expressed in [shared decimals](/).