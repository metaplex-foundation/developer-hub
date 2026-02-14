---
title: RPCs, DAS, and RPC Providers
metaTitle: RPCs, DAS, and RPC Providers on Solana | Guides
description: Learn about RPCs on the Solana blockchain, how DAS by Metaplex aids in storing and reading data, and find RPC providers for your project.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '02-13-2026'
keywords:
  - Solana RPC
  - DAS
  - Digital Asset Standard
  - Metaplex DAS
  - RPC endpoints
  - digital asset indexing
  - RPC providers
about:
  - Remote Procedure Calls
  - Metaplex DAS
  - digital asset indexing
  - Solana infrastructure
  - RPC providers
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
faqs:
  - q: What is an RPC on Solana?
    a: RPCs (Remote Procedure Calls) are servers that act as a bridge between applications and the Solana blockchain, handling requests for submitting transactions, retrieving data, and monitoring network status.
  - q: What is Metaplex DAS?
    a: Metaplex DAS (Digital Asset Standard) is a protocol that standardizes the read layer for NFTs and tokens on Solana by indexing digital assets into an optimized database for faster data retrieval.
  - q: Which Metaplex programs are indexed by DAS?
    a: Core, Token Metadata, and Bubblegum are all currently indexed by DAS, providing fast access to digital asset data for these standards.
  - q: How do RPCs and DAS work together?
    a: RPCs provide direct access to on-chain data while DAS offers an optimized indexed layer for digital assets. Developers use RPCs for general blockchain data and DAS for efficient digital asset queries.
---

Learn about RPCs on Solana, how Metaplex DAS standardizes digital asset reads, and find the right RPC provider for your project. {% .lead %}

## Roles of an RPC on the Solana Blockchain

Remote Procedure Calls (RPCs) are a crucial part of the Solana blockchain infrastructure. They serve as the bridge between users (or applications) and the blockchain, facilitating interactions and data retrieval.

Solana uses independent nodes responsible for confirming programs and outputs across its clusters (Devnet, Testnet, Mainnet Beta). Not all nodes can vote on blocks — those that can't are primarily used to respond to requests. These are RPC nodes, used to send transactions through the blockchain.

Solana maintains three public API nodes (one per cluster). For example, the Devnet endpoint is:

```
https://api.devnet.solana.com
```

These public endpoints are rate-limited. On Mainnet Beta, many developers use a private RPC provider for higher rate limits.

#### Key Roles of an RPC

1. **Facilitating Network Communication**:
RPC servers handle requests from clients (users or applications) and interact with the blockchain to fulfill those requests. They provide a standardized way for external entities to communicate with the blockchain without running a full node.

2. **Submitting Transactions**:
RPCs enable clients to submit transactions to the Solana blockchain. When a user wants to perform an action such as transferring tokens or invoking a smart contract, the transaction is sent to an RPC server, which propagates it to the network.

3. **Retrieving Blockchain Data**:
RPC servers allow clients to query the blockchain for various types of data, including:
- **Account Information**: balance, token holdings, and other metadata for a specific account.
- **Transaction History**: historical transactions associated with an account or transaction signature.
- **Block Information**: block height, block hash, and transactions included in a block.
- **Program Logs**: logs and output from executed programs (smart contracts).

4. **Monitoring Network Status**:
RPCs provide endpoints to check the status of the network, such as node health, network latency, and synchronization status.

5. **Supporting Development and Debugging**:
RPC endpoints allow developers to simulate transactions, fetch program accounts, and retrieve detailed logs for debugging.

### Common RPC Methods

| Method | Description |
|--------|-------------|
| `getBalance` | Retrieves the balance of a specified account |
| `sendTransaction` | Submits a transaction to the network |
| `getTransaction` | Fetches details about a transaction by signature |
| `getBlock` | Retrieves block information by slot number |
| `simulateTransaction` | Simulates a transaction without executing it |

### Example Usage

```bash
# Get the balance of an account
curl https://api.mainnet-beta.solana.com -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getBalance","params":["7C4jsPZpht42Tw6MjXWF56Q5RQUocjBBmciEjDa8HRtp"]}'

# Simulate a transaction
curl https://api.mainnet-beta.solana.com -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"simulateTransaction","params":["<base64-encoded-tx>"]}'
```

---

## Metaplex DAS

Metaplex DAS (Digital Asset Standard) is a protocol designed to standardize the read layer for NFTs and tokens on Solana. It allows developers to use a consistent interface when fetching different standards and layouts of digital assets.

### Indexing Digital Assets

By indexing all digital assets (NFTs and tokens), DAS provides much faster data reads since the information is stored in an optimized database rather than fetched directly from the blockchain.

### Syncing

DAS syncs by watching lifecycle instructions sent to the blockchain — create, update, burn, and transfer. This ensures the indexed data is always up to date.

Currently **Core**, **Token Metadata**, and **Bubblegum** are all indexed by DAS.

### DAS and RPCs

RPCs and DAS complement each other. Standard RPCs provide direct access to on-chain data, while DAS offers an optimized indexed layer specifically for digital assets. For developers, the DAS API is required to interact with compressed NFTs (cNFTs), and it also makes working with Token Metadata assets easier and faster. We strongly recommend using RPC nodes with DAS support for the best user experience.

To learn more:

- [Metaplex DAS API](/dev-tools/das-api)
- [Metaplex DAS API GitHub](https://github.com/metaplex-foundation/digital-asset-standard-api)
- [Metaplex Digital Asset RPC Infrastructure GitHub](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)

---

## Archive and Non-Archive Nodes

**Archive nodes** store the full history of all previous blocks. This allows you to view an address's balance history and inspect any historical state. Due to the high system requirements, having access to a private archive node is highly beneficial.

**Non-archive nodes** (regular nodes) only retain around the last 100 blocks. Even non-archive nodes can be resource-intensive to manage, which is why many developers choose a private RPC provider — especially for Mainnet Beta where real SOL is involved and rate limits are stricter.

---

## RPC Providers

{% callout type="note" %}
These lists are in alphabetical order. Choose the provider that best suits your project's needs. If we are missing a provider, let us know on [Discord](https://discord.gg/metaplex) or submit a PR.
{% /callout %}

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
