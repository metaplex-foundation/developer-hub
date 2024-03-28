---
title: Overview
metaTitle: Core - Overview
description: Provides a high-level overview of the new Solana Core standard.
---

Metaplex Core (“Core”) sheds the complexity and technical debt of previous standards and provides a clean and simple core spec for digital assets. This next generation Solana NFT standard uses a single account design, reducing minting costs and improving Solana network load compared to alternatives. It also has a flexible plugin system that allows for developers to modify the behavior and functionality of assets. {% .lead %}

Come try out Core's features over at [https://core.metaplex.com/](https://core.metaplex.com/?env=devnet) and mint an Asset yourself!

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/core/getting-started" description="Find the language or library of your choice and get started with digital assets on Solana." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="https://mpl-core-js-docs.vercel.app/" target="_blank" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% quick-link title="Differences to MPL Token Metadata Overview" icon="AcademicCap" href="/core/tm-differences" description="Used to Token Metadata and want to see an overview of new features or changes behaviour?" /%}

{% quick-link title="Differences to MPL Token Metadata Overview" icon="Beaker" href="https://core.metaplex.com/?env=devnet" target="_blank" description="Try Core yourself using an easy to use Website!" /%}

{% /quick-links %}

## Introduction

Metaplex Core is the new NFT Standard by Metaplex Foundation. 

Compared to other Standards, including our own Token Metadata Program, it has the following advantages:

- **Unprecedented Cost Efficiency**: Metaplex Core offers the lowest minting costs compared to available alternatives. For instance, an NFT that would cost .022 SOL with Token Metadata can be minted with Core for .0037 SOL.
- **Low Compute**: Core Operations have a small Compute Unit Footprint. This allows more Transactions to be included into one block..
- **Single Account Design**: Instead of relying on a fungible Token Standard like SPL Token or Token extensions (aka Token22) it is focusing on the needs of a NFT Standard. This allows the Program to just use a single Program that also tracks the owner.
- **Enforced Royalties**: Core allows you to [enforce Royalties](/core/plugins/royalties) by default.
- **First Class Collection Support**: Assets can be grouped into [Collections](/core/collections). While this is also possible with Token Metadata in Core Collections are their own Asset class and now allow additional features like the following:  
- **Collection Level Operations**: Core allows you to do changes for all Assets on collection level. For example freeze Assets or change royalty details with a single Transaction instead of requiring every single asset separately!
- **Advanced Plugin Support**: From built-in staking to asset-based point systems, the plugin architecture of Metaplex Core opens up a vast landscape of utility and customization. Plugins allow developers to to hook into any asset life cycle event like create, transfer and burn to add custom behaviors. You can add Plugins to your Assets. E.g. delegate permissions or add On-Chain Attributes that are automatically indexed by DAS: 
- **Out of the Box Indexing**: Many [RPC Providers supporting DAS](/rpc-providers) are already supporting Core.

## Next steps

Now that we know what Metaplex Core is at a high level, we recommend checking out our [Getting Started](/core/getting-started) page which enumerates the various languages/frameworks that one can use to interact with Core Assets. You might also want to have a look at the [Differences to MPL Token Metadata](/core/tm-differences) page. Afterwards, the various feature pages can be used to learn more about the specific operations that can be performed on cNFTs. 