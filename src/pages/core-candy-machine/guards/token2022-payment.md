---
title: Token2022 Payment Guard
metaTitle: Token2022 Payment Guard | Core Candy Machine
description: "The Core Candy Machine 'Token2022 Payment' guard allows minting by charging the payer a set value of an SPL Token2022."
---

## Overview

The **Token2022 Payment** guard allows minting by charging the payer some tokens from a configured mint account. Both the number of tokens and the destination address can also be configured.

If the payer does not have the required amount of tokens to pay, minting will fail.

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node label="Token 2022 Payment" /%}
{% node #guardAmount label="- Amount" /%}
{% node #guardMint label="- Token Mint" /%}
{% node #guardDestinationAta label="- Destination ATA" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardMint" #mint x="270" y="-80" %}
{% node  theme="blue" %}
Mint Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token 2022 Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #tokenAccount x="270" y="1" %}
{% node  theme="blue" %}
Token Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token 2022 Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #destinationWallet x="272" y="80" %}
{% node  theme="indigo" %}
Destination Wallet {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% edge from="mint" to="tokenAccount" arrow="none" /%}
{% edge from="tokenAccount" to="destinationWallet" arrow="none" /%}

{% node parent="candy-machine" x="600" %}
{% node #mint-candy-guard theme="pink" %}
Mint from

    _Core Candy Guard Program_{% .whitespace-nowrap %}

{% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
{% node theme="pink" %}
Mint from

    _Core Candy Machine Program_{% .whitespace-nowrap %}

{% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="guardMint" to="mint" arrow="none" dashed=true /%}
{% edge from="guardDestinationAta" to="tokenAccount" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="tokenAccount" theme="pink" %}
Transfer x Amount tokens

from the payer{% .whitespace-nowrap %}
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% callout %}

The **Token2022 Payment** guard works the same way as the **Token Payment** guard&mdash;the only difference is that the mint and token accounts should be from the [SPL Token-2022 program](https://spl.solana.com/token-2022).

{% /callout %}

## Guard Settings

The Token Payment guard contains the following settings:

- **Amount**: The number of tokens to charge the payer.
- **Mint**: The address of the mint account defining the SPL Token we want to pay with.
- **Destination Associated Token Address (ATA)**: The address of the associated token account to send the tokens to. We can get this address by finding the Associated Token Address PDA using the **Token Mint** attribute and the address of any wallet that should receive these tokens.

{% dialect-switcher title="Set up a Core Candy Machine using the Token Payment guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Note that, in this example, we’re using the current identity as the destination wallet.

```ts
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox'
create(umi, {
  // ...
  guards: {
    token2022Payment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta: findAssociatedTokenPda(umi, {
        mint: tokenMint.publicKey,
        owner: umi.identity.publicKey,
      })[0],
    }),
  },
})
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenPaymentArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Token Payment guard contains the following Mint Settings:

- **Mint**: The address of the mint account defining the SPL Token we want to pay with.
- **Destination Associated Token Address (ATA)**: The address of the associated token account to send the tokens to.

Note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to provide these Mint Settings and more as a combination of instruction arguments and remaining accounts. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#tokenpayment) for more details.

{% dialect-switcher title="Mint with the NFT Burn Guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Token Payment guard using the `mintArgs` argument like so.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    tokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
})
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [TokenPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/Token2022PaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

_The Token Payment guard does not support the route instruction._
