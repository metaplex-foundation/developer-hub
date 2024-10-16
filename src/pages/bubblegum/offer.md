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

## ID

Offers are identified globally by their unique identifier. Once an advertiser creates an offer, they cannot recreate it with the same parameters.

The offer ID is derived hashing source seller address, path, token pair, and exchange rate.

{% dialect-switcher title="Hash offer" %}
{% dialect title="Solidity" id="solidity" %}
```solidity
function hashOffer(
  bytes32 _srcSellerAddress,
  uint32 _srcEid,
  uint32 _dstEid,
  bytes32 _srcTokenAddress,
  bytes32 _dstTokenAddress,
  uint64 _exchangeRateSD
) public pure virtual override returns (bytes32 offerId) {
  offerId = keccak256(
      abi.encodePacked(_srcSellerAddress, _srcEid, _dstEid, _srcTokenAddress, _dstTokenAddress, _exchangeRateSD)
  );
}
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use anchor_lang::solana_program::keccak::hash;

pub fn hash_offer(
  src_seller_address: &[u8; 32],
  src_eid: u32,
  dst_eid: u32,
  src_token_address: &[u8; 32],
  dst_token_address: &[u8; 32],
  exchange_rate_sd: u64
) -> [u8; 32] {
  hash(
      &[
          src_seller_address,
          &src_eid.to_be_bytes()[..],
          &dst_eid.to_be_bytes()[..],
          src_token_address,
          dst_token_address,
          &exchange_rate_sd.to_be_bytes()[..],
      ].concat()
  ).to_bytes()
}
```
{% /dialect %}
{% /dialect-switcher %}

## Types

Bakstag is an Omnichain OTC Market, supporting both crosschain and monochain offers.

### Crosschain

In crosschain trades, users can exchange assets between different blockchains possible with LayerZero messaging. For example, you can sell ETH on Base and receive SOL on Solana in return. This allows users to trade assets across chains without bridging or wrapping.

### Monochain

In monochain offers both assets are on the same blockchain. In this case source endpoint ID equals destination endpoint ID. For example, you can sell ETH on Base for USDC on Base.

### Token support

We support both native tokens and standard fungible tokens:

- **Native Tokens:** ETH, SOL, TRX, etc.
- **Fungible Tokens:** ERC20, SPL, TRC20, etc.

In case of native token, token address is set to null bytes.