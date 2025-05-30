---
title: RPC Providers
metaTitle: RPC Providers | Developer Hub
description: A list of available RPCs on Solana.
---

## Introduction

Solana makes use of independent nodes which have the responsibility of working to confirm programs and outputs of programs on one of the three Solana clusters, Devnet, Testnet or Mainnet Beta. A cluster is made up of a set of validators that work to confirm transactions. These are owned and operated by individuals. These nodes are also responsible for storing data and transaction history which is shared amongst the nodes. A node can become a validator node if it is being used to vote on valid blocks and if SOL is delegated to the validator identity it can become a leader node. [This](https://solana.com/validators) is the link to the information on how to become a validator.

Not all nodes can become leader nodes or vote to confirm blocks. They still serve the other functionalities of validator nodes, but since they cannot vote they are primarily used to respond to requests on the blockchain. These are RPC nodes. RPC stands for remote procedure call, and these RPC nodes are used to send transactions through the blockchain.

Solana maintains three public API nodes, one for each cluster which are Devnet, Mainnet Beta, and Testnet. These API nodes are what allow users to connect to the cluster. To connect to Devnet users can look at:

```
https://api.devnet.solana.com
```

This is the node for Devnet, and it is rate limited.

In the Mainnet Beta cluster, many developers choose to use their own private RPC node to take advantage of higher rate limits not available to them from Solana's public API nodes.

![](https://i.imgur.com/1GmCbcu.png#radius")

For Mainnet Beta in the picture above, from the [Solana Docs](https://docs.solana.com/cluster/rpc-endpoints), we can view the rate limits from using the mainnet api node. The Mainnet Node does not support the [Metaplex DAS API](#metaplex-das-api) currently.

We will proceed to define some capabilities of RPC nodes and then present you with several options. We recommend you choose one based on your project's needs.

## Metaplex DAS API

Another distinguishing feature of RPCs is if they support the [Metaplex DAS API](/das-api). The Metaplex Digital Asset Standard (DAS) API represents a unified interface for interacting with digital assets on Solana, supporting both standard (Token Metadata) and compressed (Bubblegum) assets. The API defines a set of methods that RPCs implement in order to provide asset data.

For Developers the DAS API is required to interact with cNFTs, but it can also make working with TM Assets easier and faster. When reading from chain we therefore highly recommend using RPC nodes with DAS Support to make the user experience as fast as possible. 

You can find out more about the DAS API in a [dedicated section](/das-api).

## Metaplex Aura

Aura is a Solana Network Extension that can provide users with efficient, decentralized, and comprehensive indexing of digital asset data. Its main features include:

- **Automated Synchronization**: Ensures data integrity by enabling nodes to assist one another during periods of high load, maintaining consistency across the network.
- **Integrated Media CDN**: Enhances media delivery, speeding up load times for digital assets displayed on web pages.
- **Support for Light Clients**: Enables node operators to index specific protocols or sub-protocols, such as Core assets or a particular Bubblegum tree. Light clients can operate without running a full Solana node or Geyser plugin, instead receiving updates from the Aura network. This reduces infrastructure costs significantly compared to maintaining a full Solana node.
- **Digital Asset Standard API**: Fully implements the DAS API, the main interface for accessing digital asset data on the Solana Virtual Machine (SVM).

Learn more about Aura's indexing features in the [dedicated section](/aura/reading-solana-and-svm-data).

## Archive and Nonarchive Nodes

We can divide nodes into two different categories. The first one we will look at are the Archive nodes. These can store information of previous blocks. In the case of these archival nodes, we can leverage having access to all previous blocks in several ways. Some of the advantages include being able to view an address's balance history and view any state in the history. Due to the high system requirements of running a full historical node, having private nodes available with this feature is highly beneficial.

Unlike archival nodes, a non-archive node, or just a regular node, will only have access to some of the previous blocks, which is upwards of 100 blocks. We previously mentioned that running an archival node has intensive requirements, but even a non-archive node can become hard to manage. For this reason, users often choose a private RPC provider. Most use cases involving private RPCs in Solana usually revolve around Mainnet-beta uses since this involves real SOL tokens, and there is a higher chance of being rate limited.

## RPCs Available

The following section includes multiple RPC providers.

{% callout type="note" %}
These lists are in alphabetical order. Please choose the RPC provider that best suits your project's needs. If we are missing a provider, let us know in our discord or submit a PR.
{% /callout %}

### RPCs with Aura Support
- [Mainnet Aura](http://aura-mainnet.metaplex.com)
- [Devnet Aura](http://aura-devnet.metaplex.com)

### RPCs with DAS Support
- [Extrnode](https://docs.extrnode.com/das_api/)
- [Helius](https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api)
- [Hello Moon](https://docs.hellomoon.io/reference/rpc-endpoint-for-digital-asset-standard)
- [QuickNode](https://quicknode.com/)
- [Shyft](https://docs.shyft.to/solana-rpcs-das-api/compression-das-api)
- [Triton](https://docs.triton.one/rpc-pool/metaplex-digital-assets-api)

### RPCs without DAS Support
- [Alchemy](https://alchemy.com/?a=metaplex)
- [Ankr](https://www.ankr.com/protocol/public/solana/)
- [Blockdaemon](https://blockdaemon.com/marketplace/solana/)
- [Chainstack](https://chainstack.com/build-better-with-solana/)
- [Figment](https://figment.io/)
- [GetBlock](https://getblock.io/)
- [NOWNodes](https://nownodes.io/)
- [Syndica](https://syndica.io/)

### Further Information
If you have any questions or would like to further understand this topic, you are welcome to ask join the [Metaplex Discord](https://discord.gg/metaplex) Server.
