---
title: RPCs and DAS
metaTitle: RPCs and DAS on the Solana Blockchain
description: Learn about RPCS on the Solana blockchain and how DAS by Metaplex aids in storing and reading data on Solana.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-21-2024'
---

## Roles of an RPC on the Solana Blockchain
Remote Procedure Calls (RPCs) are a crucial part of the Solana blockchain infrastructure. They serve as the bridge between users (or applications) and blockchain, facilitating interactions and data retrieval.

#### Key Roles of an RPC
1. **Facilitating Network Communication**
RPC servers handle requests from clients (users or applications) and interact with the blockchain to fulfill those requests. They provide a standardized way for external entities to communicate with the blockchain without requiring them to run a full node.

2. **Submitting Transactions**
RPCs enable clients to submit transactions to the Solana blockchain. When a user wants to perform an action on the blockchain, such as transferring tokens or invoking a smart contract, the transaction is sent to an RPC server, which then propagates it to the network for processing and inclusion in a block.

3. **Retrieving Blockchain Data**
RPC servers allow clients to ask the blockchain for various types of data, including:
- **Account Information**: details about a specific account, such as balance, token holdings, and other metadata.
- **Transaction History**: historical transactions associated with an account or a specific transaction signature.
- **Block Information**: details about specific blocks, including block height, block hash, and transactions included in the block.
- **Program Logs**: Access logs and output from executed programs (smart contracts).

4. **Monitoring Network Status**
RPCs provide endpoints to check the status of the network and nodes, such as:
- **Node Health**: Determine if a node is online and functioning correctly.
- **Network Latency**: Measure the time it takes for requests to be processed and responses to be received.
- **Synchronization Status**: Check if a node is synchronized with the rest of the network.

5. **Supporting Development and Debugging**
RPC endpoints are essential tools for developers building on Solana. They provide functionalities to:
- **Simulate Transactions**: simulate transactions to see their potential effects before submitting them to the network.
- **Fetch Program Accounts**: retrieve all accounts associated with a specific program, which is useful for managing program state.
- **Get Logs**: detailed logs from transactions and programs to debug and optimize their applications.

## Example RPC Endpoints
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

// Example public key
const publicKey = new solanaWeb3.PublicKey('ExamplePublicKeyHere');

// Get balance
getBalance(publicKey);
```