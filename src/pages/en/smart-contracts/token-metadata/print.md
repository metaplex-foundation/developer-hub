---
title: Printed Editions
metaTitle: Printed Editions | Token Metadata
description: Print copies of NFTs on Solana using Token Metadata Master Editions. Create limited or open editions from an Original NFT with the PrintV1 instruction.
updated: '02-07-2026'
keywords:
  - print edition NFT
  - Master Edition
  - Edition account
  - NFT copies
  - PrintV1 instruction
about:
  - printed editions
  - Master Edition management
  - NFT edition printing
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Create an Original NFT with a Master Edition and Max Supply > 0
  - Call PrintV1 to mint a new Edition NFT
  - The Edition account is created with the edition number
  - Confirm the transaction
howToTools:
  - Umi SDK
  - Kit SDK
  - Rust SDK
faqs:
  - q: What is a Master Edition?
    a: A Master Edition is a PDA account attached to an Original NFT that controls the Mint and Freeze authorities. It tracks how many editions have been printed and enforces the optional Max Supply limit.
  - q: How do I print a copy of an NFT?
    a: Use PrintV1 referencing the Original NFT's Master Edition. This creates a new Mint, Metadata, and Edition account for the printed copy.
  - q: Can I limit the number of editions?
    a: Yes. Set the Max Supply on the Master Edition when creating the Original NFT. Set to 0 to disable printing, or None for unlimited editions.
  - q: What is the difference between a Master Edition and an Edition?
    a: A Master Edition belongs to the Original NFT and controls printing. An Edition belongs to a printed copy and records its edition number and parent Master Edition.
---

Every NFT has the potential to be printed as multiple editions when its **Master Edition** account is configured accordingly. On this page, we'll learn how to create a printable NFT and how to print editions from it.

## Printable NFTs

The owner of a printable NFT can print as many editions as they want from it as long as its maximum supply has not been reached.

Every Non-Fungible asset — i.e. `NonFungible` and `ProgrammableNonFungible` token standards — can be a printable NFT when created. This is done by configuring the **Max Supply** attribute of the asset's Master Edition account. This attribute is optional and can have one of the following values:

- `None`: The NFT does not have a fixed supply. In other words, **the NFT is printable and has an unlimited supply**.
- `Some(x)`: The NFT has a fixed supply of `x` editions.
  - When `x = 0`, this means **the NFT is not printable**.
  - When `x > 0`, this means **the NFT is printable and has a fixed supply of `x` editions**.

Whenever a new printed edition is created from a printable NFT, a few things happen:

- A brand new edition NFT is created and its data matches the original NFT. The only difference is that the printed edition uses a different token standard than the original NFT.
  - For a `NonFungible` asset, the printed editions use the `NonFungibleEdition` token standard.
  - For a `ProgrammableNonFungible` asset, the printed editions use the `ProgrammableNonFungibleEdition` token standard.
- Instead of using a **Master Edition** account, the new edition NFT uses an **Edition** account which keeps track of its edition number and its parent NFT by storing the address of its parent's **Master Edition** account.
- The **Supply** attribute of the Master edition account is incremented by 1. When the **Supply** attribute reaches the **Max Supply** attribute, the NFT is no longer printable.

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node #mint-authority label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node #freeze-authority label="Freeze Authority = Edition" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-10" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-280" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #master-edition-pda parent="mint" x="-10" y="-220" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-280" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% node label="Key = MasterEditionV2" /%}
{% node label="Supply" /%}
{% node label="Max Supply" theme="orange" z=1 /%}
{% /node %}

{% node parent="master-edition" y="-140" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token edition Program" theme="dimmed" /%}
{% node label="Key = EditionV1" /%}
{% node #edition-parent label="Parent" /%}
{% node label="Edition" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="master-edition-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" fromPosition="left" label="OR" /%}
{% edge from="mint-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="freeze-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="edition-parent" to="master-edition" dashed=true arrow="none" fromPosition="left" toPosition="left" /%}
{% /diagram %}

## Setting up a Master Edition NFT

To create a printable NFT, we need to configure the **Print Supply** attribute of [the **Create** instruction](/smart-contracts/token-metadata/mint#creating-accounts) of the Token Metadata program. This will configure the **Max Supply** attribute of the **Master Edition** account as seen in the previous section. This attribute can be:

- `Zero`: The NFT is not printable.
- `Limited(x)`: The NFT is printable and has a fixed supply of `x` editions.
- `Unlimited`: The NFT is printable and has an unlimited supply.

Here is how you can use our SDKs to create a printable NFT.

{% code-tabs-imported from="token-metadata/create-master-edition" frameworks="umi,kit" /%}

## Printing Editions from the Master Edition NFT

Once we have a printable NFT that has not reached its **Max Supply**, we can print new editions from it. This is done by calling the **Print** instruction of the Token Metadata program. This instruction accepts the following attributes:

- **Master Edition Mint**: The address of the printable NFT's Mint account.
- **Edition Mint**: The address of the new edition NFT's Mint account. This is typically a newly generated Signer since the account will be created by the instruction if it does not exist.
- **Master Token Account Owner**: The owner of the printable NFT as a Signer. Only the owner of a printable NFT can print new editions from it.
- **Edition Token Account Owner**: The address of the new edition NFT's owner
- **Edition Number**: The edition number of the new edition NFT to print. This is typically the current **Supply** of the **Master Edition** account plus 1.
- **Token Standard**: The token standard of the printable NFT. This can be `NonFungible` or `ProgrammableNonFungible`.

Here is how you can use our SDKs to print a new edition from a printable NFT.

{% code-tabs-imported from="token-metadata/print-edition" frameworks="umi,kit" /%}
