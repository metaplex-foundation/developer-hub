---
title: Overview
metaTitle: Overview | Core
description: Provides a high-level overview of the new Solana NFT Asset standard called Core created by Metaplex.
---

Metaplex Core ("Core") sheds the complexity and technical debt of previous standards and provides a clean and simple core spec for digital assets. This next generation Solana NFT standard uses a single account design, reducing minting costs and improving Solana network load compared to alternatives. It also has a flexible plugin system that allows for developers to modify the behavior and functionality of assets. {% .lead %}

{% callout %}
Please note that certain Core instructions will require protocol fees.
{% /callout %}

{% protocol-fees program="core" /%}

Come try out Core's features over at [https://core.metaplex.com/](https://core.metaplex.com/) and mint an Asset yourself!

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/core/getting-started" description="Find the language or library of your choice and get started with digital assets on Solana." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% quick-link title="Differences to MPL Token Metadata Overview" icon="AcademicCap" href="/core/tm-differences" description="Used to Token Metadata and want to see an overview of new features or changes behaviour?" /%}

{% quick-link title="Try yourself in a UI!" icon="Beaker" href="https://core.metaplex.com/" target="_blank" description="Try Core yourself using an easy to use Website!" /%}

{% /quick-links %}

## Introduction

Metaplex Core is the new NFT Standard in the Metaplex Protocol. Compared to other Standards, including the Metaplex Token Metadata Program, it has the following advantages:

- **Unprecedented Cost Efficiency**: Metaplex Core offers the lowest minting costs compared to available alternatives. For instance, an NFT that would cost .022 SOL with Token Metadata or .0046 SOL with Token Extensions can be minted with Core for .0029 SOL.
- **Low Compute**: Core Operations have a small Compute Unit Footprint. This allows more Transactions to be included into one block instead of 205000 CU for minting Core requires just 17000 CU.
- **Single Account Design**: Instead of relying on a fungible Token Standard like SPL Token or Token extensions (aka Token22) Core focuses on the needs of an NFT Standard. This allows Core to just use a single account that also tracks the owner.
- **Enforced Royalties**: Core allows [royalty enforcement](/core/plugins/royalties) by default.
- **First Class Collection Support**: Assets can be grouped into [Collections](/core/collections). While this is also possible with Token Metadata, in Core Collections are their own Asset class that now allow additional features like the following:
- **Collection Level Operations**: Core allows users to make changes for all Assets at the collection level. For example, all collection assets can be frozen or have their royalty details changed at the same time with a single transaction!
- **Advanced Plugin Support**: From built-in staking to asset-based point systems, the plugin architecture of Metaplex Core opens a vast landscape of utility and customization. Plugins allow developers to add custom behaviors by hooking into any asset life cycle event like create, transfer and burn. You can add Plugins to your Assets. e.g., delegate permissions or add On-Chain Attributes that are automatically indexed by DAS:
- **Out of the Box Indexing**: Many [RPC Providers supporting DAS](/rpc-providers) are already supporting Core.

## Next steps

Now that we have covered what Metaplex Core is at a high level, we recommend checking out our [Getting Started](/core/getting-started) page which enumerates the various languages/frameworks that one can use to interact with Core Assets. You might also want to have a look at the [Differences to MPL Token Metadata](/core/tm-differences) page. Afterwards, the various feature pages can be used to learn more about the specific operations that can be performed on cNFTs.
