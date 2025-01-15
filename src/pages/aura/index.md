---
title: Overview
metaTitle: Overview | Aura
description: High level overview of Aura, an integrated network for digital assets.
---

Metaplex Aura is a data network that extends Solana and the Solana Virtual Machine (SVM).

Decentralized applications struggle to compete with centralized alternatives because it can be difficult, costly and slow to read and display the current state of blockchain data. Aura solves these problems by complementing the SVM and MPL with a decentralized network of Aura nodes that performantly index asset data and provide real time data availability for compressed state, all secured by the $MPLX token.

**The Metaplex Aura Network has three main components**:
1. **Reading Solana data**: Users and developers will benefit from decentralized read access on the Solana network, ensuring that digital assets and media content are always accessible, even while compressed, without relying on a single point of failure.
2. **Managing compressed state across any SVM**: Aura implements the Digital Asset Standard (DAS) API to offer performant indexing across any protocols on Solana and the broader SVM. Developers and applications will have the ability to transition assets between SVM account space and different levels of state compression on demand, increasing flexibility and optimizing asset performance and scalability.
3. **Batch minting NFTs**: Batch minting will be generated from off chain json object/file and the transaction initiated and indexed by an Aura node.

The Aura network can be accessed through a public gateway, which is integrated directly into the Metaplex SDKs and developer tools, providing an all-in-one solution for developers to create and manage digital assets. Alternatively, projects can choose to run a node directly and access the full benefits of the network. 

Powered by $MPLX, Aura nodes will be eligible to receive read requests from the public gateway and have access to new instructions that can elastically manage state on the SVM, compressing and decompressing asset data in account space to optimize for performance and cost.

This elastic state management enables rollup mint transactions and the ability to batch create millions of assets into compressed state with 99% fewer transactions, with Aura Nodes providing the data availability (DA) needed to manage state transitions.

## Features

- [Reading Solana and SVM Data](/aura/reading-solana-and-svm-data): The Aura Network provides data availability and decentralized indexing for asset data, which can be queried using the [Metaplex Digital Asset Standard (DAS) API](/das-api).

- [Managing compressed state](/aura/managing-compressed-state): Aura facilitates the management of state compression on Solana and the SVM generally.

- [Batch Minting](aura/batch-minting): Aura nodes can create entire trees of compressed digital assets at once substantially reducing the load on the Solana network, while reducing cost and complexity for developers.



## Secured by MPLX

Aura Nodes efficiently index asset data and provide real-time data availability, secured and governed by the $MPLX token. 

<!-- With the introduction of a delegated staking model, users and developers can unlock advanced features that rely on the Aura infrastructure like batch minting. -->
<!-- 
By staking or delegating $MPLX, users can access additional functionality, using weighted stake to determine eligibility for these features. -->

<!-- To read more about the economics behind Aura you can read the [Economics Page](/aura/economics). -->

<!-- 

Come try out Aura's features over at [https://aura.metaplex.com/](https://aura.metaplex.com/)!

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/core/getting-started" description="Find the language or library of your choice and get started with digital assets on Solana." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% /quick-links %} -->
