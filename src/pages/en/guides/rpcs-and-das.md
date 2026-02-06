---
title: RPCs and DAS
metaTitle: RPCs and DAS on the Solana Blockchain | Guides
description: Learn about RPCs on the Solana blockchain and how DAS by Metaplex aids in storing and reading data on Solana.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '04-19-2025'
---

## Roles of an RPC on the Solana Blockchain

Remote Procedure Calls (RPCs) are a crucial part of the Solana blockchain infrastructure. They serve as the bridge between users (or applications) and the blockchain, facilitating interactions and data retrieval.

#### Key Roles of an RPC

1. **Facilitating Network Communication**:
RPC servers handle requests from clients (users or applications) and interact with the blockchain to fulfill those requests. They provide a standardized way for external entities to communicate with the blockchain without requiring them to run a full node.

2. **Submitting Transactions**:
RPCs enable clients to submit transactions to the Solana blockchain. When a user wants to perform an action on the blockchain, such as transferring tokens or invoking a smart contract, the transaction is sent to an RPC server, which then propagates it to the network for processing and inclusion in a block.

3. **Retrieving Blockchain Data**:
RPC servers allow clients to ask the blockchain for various types of data, including:

- **Account Information**: details about a specific account, such as balance, token holdings, and other metadata.
- **Transaction History**: historical transactions associated with an account or a specific transaction signature.
- **Block Information**: details about specific blocks, including block height, block hash, and transactions included in the block.
- **Program Logs**: Access logs and output from executed programs (smart contracts).

1. **Monitoring Network Status**:
RPCs provide endpoints to check the status of the network and nodes, such as:

- **Node Health**: Determine if a node is online and functioning correctly.
- **Network Latency**: Measure the time it takes for requests to be processed and responses to be received.
- **Synchronization Status**: Check if a node is synchronized with the rest of the network.

1. **Supporting Development and Debugging**:
RPC endpoints are essential tools for developers building on Solana. They provide functionalities to:

- **Simulate Transactions**: simulate transactions to see their potential effects before submitting them to the network.
- **Fetch Program Accounts**: retrieve all accounts associated with a specific program, which is useful for managing program state.
- **Get Logs**: detailed logs from transactions and programs to debug and optimize their applications.

### Example RPC Endpoints

Here are some common RPC endpoints and their functionalities:

- **getBalance**: Retrieves the balance of a specified account.
- **sendTransaction**: Submits a transaction to the network.
- **getTransaction**: Fetches details about a specific transaction using its signature.
- **getBlock**: Retrieves information about a specific block by its slot number.
- **simulateTransaction**: Simulates a transaction to predict its outcome without executing it on the chain.

### Example Usage

Here’s a simple example using JavaScript to interact with Solana’s RPC endpoints:

```javascript
const solanaWeb3 = require('@solana/web3.js');

// Connect to the Solana cluster
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');

// Fetch the balance of an account
async function getBalance(publicKey) {
  const balance = await connection.getBalance(publicKey);
  console.log(`Balance: ${balance} lamports`);
}

// Send a transaction
async function sendTransaction(transaction, payer) {
  const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer]);
  console.log(`Transaction signature: ${signature}`);
}

// Example public key (a real Solana address format)
const publicKey = new solanaWeb3.PublicKey('7C4jsPZpht42Tw6MjXWF56Q5RQUocjBBmciEjDa8HRtp');

// Get balance
getBalance(publicKey);
```

## Metaplex DAS

Metaplex DAS (Digital Asset Standard) is a protocol or framework designed to standardize the read layer of NFTs and Tokens on the Solana blockchain, allowing developers to standardize their code when fetching multiple different standards and layouts of Digital Assets.

### Indexing Digital Assets

By indexing all the Digital Assets (NFTs and Tokens), users gain access to much faster reads of data for these assets as the information is stored in an optimized database rather than fetching directly from the blockchain.

### Syncing

DAS has the ability to sync the reindexing of data during certain lifecycle instructions that are sent to the blockchain. By watching these instructions, such as create, update, burn, and transfer, we can always be assured that the DAS indexed data is up to date.

Currently Core, Token Metadata, and Bubblegum are all indexed by DAS.

To find out more about Metaplex DAS you can visit these pages:

- [Metaplex DAS API](/dev-tools/das-api)
- [Metaplex DAS API Github](https://github.com/metaplex-foundation/digital-asset-standard-api)
- [Metaplex Digital Asset RPC Infrastructure Github](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)

## RPC and DAS Integration

RPCs and DAS complement each other in the Solana ecosystem. While standard RPCs provide direct access to on-chain data, Metaplex DAS offers an optimized, indexed layer specifically for digital assets. By leveraging both services appropriately, developers can build more efficient applications that retrieve general blockchain data through RPCs while accessing digital asset information through DAS, resulting in better performance and user experience.
