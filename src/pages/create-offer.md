---
title: Create Offer
metaTitle: Create Offer | Bakstag
description: Learn how Offer is created.
---

The offer's lifecycle begins with its creation. On this page, we'll go over the process of creating an offer. {% .lead %}

## The creation process

### **1. Create Offer Parameters.** 
First, decide what to sell, what to receive in return, set the price, and specify where the revenue will be received upon offer acceptance.

**Offer Parameters**, discussed [in the offer page](/offer), are set during the offer creation. Namely, we must provide:
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

- **Pay in LayerZero Token:** Decide whether you want to cover LayerZero fee in native or ZRO token.


### **2. Quote.** 
Next, obtain a quote that provides:
  - **LayerZero Messaging Fee** - the fee required by LayerZero.
  - **Create Offer Receipt** - includes the offer ID and the amount [cleaned from dust](/).
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

### **3. Create.**
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

Internally, `createOffer`:
- **Validates pricing**. Checks for zero amount, exchange rate, or insufficient balance.
- **Hashes offer**. Determines a new offer ID.
- **Stores offer**. Stores offer onchain.
- **Emits event**. Logs `OfferCreated` event notifying offchain workers.
- **Locks source amount**. Securely locks the source amount [in the Escrow](/).
- **Sends omnichain message**. Builds and sends `OfferCreated` message to the destination peer OTC Market in case for crosschain offer.

