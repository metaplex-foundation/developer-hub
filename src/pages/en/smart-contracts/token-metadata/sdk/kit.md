---
title: JavaScript SDK (Kit)
metaTitle: JavaScript SDK (Kit) | Token Metadata
description: Set up the Metaplex Token Metadata Kit SDK for JavaScript and TypeScript. Install dependencies, configure @solana/kit, create NFTs, and manage digital assets on Solana.
updated: '02-07-2026'
keywords:
  - mpl-token-metadata-kit
  - Kit SDK
  - Token Metadata TypeScript
  - Solana Kit NFT
  - create NFT Kit
about:
  - JavaScript SDK
  - Kit integration
  - TypeScript development
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What is the Token Metadata Kit SDK?
    a: The Token Metadata Kit SDK (@metaplex-foundation/mpl-token-metadata-kit) is a TypeScript library built on @solana/kit for creating and managing NFTs and fungible tokens on Solana using a functional API pattern.
  - q: What is the difference between the Kit SDK and the Umi SDK?
    a: The Kit SDK uses @solana/kit with a functional API and returns instructions with signers attached. The Umi SDK uses the Umi framework with a plugin-based architecture and fluent builder pattern. Both provide the same Token Metadata functionality.
  - q: How do I send transactions with the Kit SDK?
    a: The Kit SDK returns instructions with signers already attached. Use signTransactionMessageWithSigners from @solana/kit to automatically extract and sign with all required signers, then send the transaction.
  - q: Can I use the Kit SDK with existing @solana/kit projects?
    a: Yes. The Kit SDK is designed to integrate seamlessly with @solana/kit projects. It uses the same RPC, signer, and transaction patterns as the rest of the @solana/kit ecosystem.
---

The **Kit SDK** (`@metaplex-foundation/mpl-token-metadata-kit`) provides a functional API for interacting with Token Metadata on Solana. Built on [`@solana/kit`](https://github.com/solana-labs/solana-web3.js), it returns instructions with signers already attached for seamless transaction building. {% .lead %}

{% callout title="What You'll Learn" %}
- Installing and configuring the Token Metadata Kit SDK
- Setting up RPC connections and signers
- Building a transaction helper
- Creating your first NFT
- Core operations: fetch, update, transfer, burn
{% /callout %}

## Prerequisites

- **Node.js 18+** or a modern browser with ES modules
- **SOL** for transaction fees (use devnet for testing)

{% quick-links %}
{% quick-link title="API Reference" target="_blank" icon="JavaScript" href="https://mpl-token-metadata-kit.typedoc.metaplex.com/" description="Full TypeDoc API documentation for the Kit SDK." /%}
{% quick-link title="NPM Package" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata-kit" description="Package on npmjs.com with version history." /%}
{% /quick-links %}

## Installation

```bash {% title="Terminal" %}
npm install \
  @solana/kit \
  @metaplex-foundation/mpl-token-metadata-kit
```

## Setup

```ts {% title="setup-kit.ts" %}
import { createSolanaRpc, createSolanaRpcSubscriptions, generateKeyPairSigner } from '@solana/kit';

// Create RPC connection
const rpc = createSolanaRpc('https://api.devnet.solana.com');
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com');

// Generate or load a keypair
const authority = await generateKeyPairSigner();
```

### Transaction Helper

The Kit SDK returns instructions with signers already attached to the relevant accounts. This allows you to use `signTransactionMessageWithSigners` which automatically extracts and uses these signers:

```ts {% title="send-and-confirm.ts" %}
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getSignatureFromTransaction,
  type Instruction,
  type TransactionSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit';

async function sendAndConfirm(options: {
  instructions: Instruction[];
  payer: TransactionSigner;
}) {
  const { instructions, payer } = options;
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(payer.address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  );

  // Sign with all signers attached to instruction accounts
  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });

  return getSignatureFromTransaction(signedTransaction);
}
```

## Quick Start: Create an NFT

```ts {% title="create-nft.ts" %}
import { generateKeyPairSigner } from '@solana/kit';
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit';

// Generate keypairs
const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner();

// Create and mint an NFT
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
});

// Send transaction
const sx = await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
});

console.log('NFT created:', mint.address);
console.log('Signature:', sx);
```

## Core Operations

### Fetch an Asset

```ts {% title="fetch-asset.ts" %}
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata-kit';

const asset = await fetchDigitalAsset(rpc, mintAddress);

console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
```

### Update an Asset

```ts {% title="update-asset.ts" %}
import { getUpdateV1Instruction } from '@metaplex-foundation/mpl-token-metadata-kit';

const updateIx = getUpdateV1Instruction({
  metadata: metadataAddress,
  authority,
  data: { ...asset.metadata, name: 'Updated Name' },
});

await sendAndConfirm({ instructions: [updateIx], payer: authority });
```

### Transfer an Asset

```ts {% title="transfer-asset.ts" %}
import { getTransferV1Instruction } from '@metaplex-foundation/mpl-token-metadata-kit';

const transferIx = getTransferV1Instruction({
  token: tokenAddress,
  tokenOwner: ownerAddress,
  destinationToken: destinationTokenAddress,
  destinationOwner: recipientAddress,
  mint: mintAddress,
  metadata: metadataAddress,
  authority,
  payer: authority,
  tokenStandard: TokenStandard.NonFungible,
  amount: 1,
});

await sendAndConfirm({ instructions: [transferIx], payer: authority });
```

### Burn an Asset

```ts {% title="burn-asset.ts" %}
import { getBurnV1Instruction } from '@metaplex-foundation/mpl-token-metadata-kit';

const burnIx = getBurnV1Instruction({
  token: tokenAddress,
  mint: mintAddress,
  metadata: metadataAddress,
  authority,
  tokenStandard: TokenStandard.NonFungible,
  amount: 1,
});

await sendAndConfirm({ instructions: [burnIx], payer: authority });
```

See the [Features](/smart-contracts/token-metadata/mint) section for detailed documentation on each operation.

## Common Errors

### `Account does not exist`

The mint address doesn't exist on-chain. Verify the address is correct and you're connected to the right network (devnet vs mainnet).

### `Invalid authority`

You're not authorized to perform this action. Check that:
- You own the asset (for transfers, burns)
- You're the update authority (for updates)
- You have the required delegate permission

### `Transaction too large`

Solana transactions are limited to ~1232 bytes. If combining many instructions, split them into separate transactions.

## Quick Reference

| Function | Purpose |
|----------|---------|
| `createNft()` | Create a new NFT with Master Edition |
| `createFungible()` | Create a fungible token |
| `createProgrammableNft()` | Create a programmable NFT (pNFT) |
| `fetchDigitalAsset()` | Fetch asset by mint address |
| `getUpdateV1Instruction()` | Update asset metadata |
| `getTransferV1Instruction()` | Transfer asset ownership |
| `getBurnV1Instruction()` | Burn an asset |
| `getVerifyCollectionV1Instruction()` | Verify collection membership |
| `getDelegateV1Instruction()` | Delegate authority |

### Program ID

| Network | Address |
|---------|---------|
| Mainnet | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |
| Devnet | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |

## Next Steps

- [Creating & Minting](/smart-contracts/token-metadata/mint) — Detailed minting guide for all token types
- [Token Standards](/smart-contracts/token-metadata/token-standard) — Understand the different asset types
- [Programmable NFTs](/smart-contracts/token-metadata/pnfts) — Learn about pNFTs and authorization rules
