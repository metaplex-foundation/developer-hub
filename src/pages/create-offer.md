---
title: Create Offer
metaTitle: Create Offer | Bakstag
description: Learn how Offer is created.
---

The offer's lifecycle begins with its creation. On this page, we'll go over the process of creating an offer. {% .lead %}

## When to Create Offer
Before creating a new offer, we recommend checking if there is already an **existing** offer listed by another advertiser that meets your requirements. Accepting it will be **faster** than waiting for someone to accept your offer. See [how to accept offers](/accept-offer).

## The creation process

### **1. Create Offer Parameters.** 
First, decide what to sell, what to receive in return, set the price, and specify the address where the received tokens will be sent.

[Offer Parameters](/offer#parameters) are set during the offer creation. Namely, we must provide:
- **Destination Seller Address:** The address where buyers send the destination amount upon accepting the offer.
- **Destination Endpoint ID:** The LayerZero endpoint ID for the destination chain.
- **Source Token address:** The token to sell.  
- **Destination Token address:** The token to receive.
- **Source Amount:** The total amount of the source token to sell.
- **Exchange Rate:** In [dst/src] units.

{% diagram %}
{% node %}
{% node label="Create Offer Parameters" /%}
{% node label="Destination Seller Address" theme="red" /%}
{% node label="Destination Endpoint ID" theme="green" /%}
{% node label="Source Token Address" theme="blue" /%}
{% node label="Destination Token Address" theme="blue" /%}
{% node label="Source Amount" theme="purple" /%}
{% node label="Exchange Rate" theme="purple" /%}
{% /node %}
{% /diagram %}

**Source Seller Address** and **Source Endpoint ID** are automatically determined by the OTC Market.

- **Pay in LayerZero Token:** Decide whether to cover LayerZero fee in native or ZRO token.


### **2. Quote.** 
Next, obtain a quote that provides:
  - **LayerZero Messaging Fee** - the fee required by LayerZero.
  - **Create Offer Receipt** - includes the offer ID and the amount [cleaned from dust](/token-precision#example).
{% diagram %}
{% node %}
{% node label="Create Offer Receipt" /%}
{% node label="Offer ID" /%}
{% node label="Source Amount" theme="purple" /%}
{% /node %}
{% /diagram %}

The quote is a view (read) function, so calling it incurs no cost.

{% dialect-switcher title="Quote create offer interface" %}
{% dialect title="Solidity" id="solidity" %}
```solidity
function quoteCreateOffer(
  bytes32 _srcSellerAddress,
  CreateOfferParams calldata _params,
  bool _payInLzToken
) external view returns (MessagingFee memory fee, CreateOfferReceipt memory createOfferReceipt);
```
{% /dialect %}
{% /dialect-switcher %}

It will revert if we try to recreate the same offer or to create an offer with an unsupported destination chain.

### **3. Approve.**
If the **source token** is not native, e.g., USDC (Base), you will also be asked to **approve** the OTC Market to transfer the source tokens [to the Escrow](/create-offer#escrow).

### **4. Create.**
Finally, invoke `createOffer`.

{% dialect-switcher title="Create offer interface" %}
{% dialect title="Solidity" id="solidity" %}
```solidity
function createOffer(
    CreateOfferParams calldata _params,
    MessagingFee calldata _fee
) external payable returns (MessagingReceipt memory msgReceipt, CreateOfferReceipt memory createOfferReceipt);
```
{% /dialect %}
{% /dialect-switcher %}

This will return **LayerZero Messaging Receipt** as well as **Create Offer Receipt**.

Internally, `createOffer` will:
- **Validate pricing:** Check for zero amount, exchange rate, or insufficient balance.
- **Hashe offer:** Determine a new offer ID.
- **Store offer:** Store offer onchain.
- **Emit event:** Log `OfferCreated` event notifying offchain workers.
- **Lock source amount:** Securely lock the source amount [in the Escrow](/create-offer#escrow).
- **Send omnichain message:** Build and send `OfferCreated` message to the destination peer OTC Market (for crosschain offers only).

{% figure src="/assets/bakstag/create-offer.svg" alt="Offer creation process" caption="Offer creation" /%}

When the `OfferCreated` message arrives at the destination peer OTC Market, it will **store the offer** onchain in its offer pool as well. Bakstag currently maintains a **duplicate** storage of offers, both on the source and destination OTC Markets.

## Escrow
The **Escrow** is a smart contract deployed and managed by the OTC Market contract. When an offer is created, the **source token amount** is securely locked in the Escrow until the **buyer accepts** the offer or the **advertiser cancels** it.

## Transfers 

After the offer is created, buyers can view and accept it in whole or in part. 

Upon acceptance, buyers transfer **destination tokens** directly to the configured destination seller address. The corresponding **source tokens** will be released from the Escrow to the buyer.

We will discuss how to accept offers in detail [in the following page](/accept-offer).

## Transaction Pricing
Every transaction using Bakstag has **3** main cost elements:
1. the **source transaction gas**
2. the [LayerZero fee](https://docs.layerzero.network/v2/developers/evm/technical-reference/tx-pricing) paid to the Security Stack, Executor, and for covering destination transaction gas.
3. the [Bakstag fee](/) paid in offer destination token.

{% callout title="Source Amount" type="note" %}
Note that `createOffer` will also transfer the **source amount** to the Escrow. It remains your funds, and you can **cancel the offer** whenever you wish. This allows users to trade assets across chains in a **non-custodial** manner. See [how to cancel offers](/cancel-offer).
{% /callout %}

## Gas abstraction
The **destination gas costs** are included in the  [LayerZero fee](/create-offer#transaction-pricing). Advertisers pay this fee in the **source native currency**, which means there’s no need to hold any destination native currency. The same applies to buyers.

## Time
When you create an offer, you will first wait for the transaction to succeed on the source chain. After that, you'll need to wait for LayerZero to confirm and deliver it to the destination chain. However, this process is still **much faster** than **bridging**. We've observed transactions complete in **under 2 minutes**, though actual times may vary based on blockchains load, LayerZero load, and other factors.
