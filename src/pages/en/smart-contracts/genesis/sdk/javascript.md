---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: API reference for the Genesis JavaScript SDK. Function signatures, parameters, and types for token launches on Solana.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis SDK
  - JavaScript SDK
  - TypeScript SDK
  - token launch SDK
  - Umi framework
  - Genesis API reference
about:
  - SDK installation
  - API reference
  - Genesis instructions
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What is Umi and why is it required?
    a: Umi is Metaplex's JavaScript framework for Solana. It provides a consistent interface for building transactions, managing signers, and interacting with Metaplex programs.
  - q: Can I use the Genesis SDK in a browser?
    a: Yes. The SDK works in both Node.js and browser environments. For browsers, use a wallet adapter for signing instead of keypair files.
  - q: What's the difference between fetch and safeFetch?
    a: fetch throws an error if the account doesn't exist. safeFetch returns null instead, useful for checking if an account exists without error handling.
  - q: How do I handle transaction errors?
    a: Wrap sendAndConfirm calls in try/catch blocks. Common errors include insufficient funds, already-initialized accounts, and time condition violations.
---

API reference for the Genesis JavaScript SDK. For complete tutorials, see [Launch Pool](/smart-contracts/genesis/launch-pool) or [Presale](/smart-contracts/genesis/presale). {% .lead %}

{% quick-links %}

{% quick-link title="NPM Package" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="@metaplex-foundation/genesis" /%}

{% quick-link title="TypeDoc" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="Auto-generated API docs" /%}

{% /quick-links %}

## Installation

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

## Setup

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

For complete implementation examples, see [Launch Pool](/smart-contracts/genesis/launch-pool) or [Presale](/smart-contracts/genesis/presale).

---

## Instructions Reference

### Core

| Function | Description |
|----------|-------------|
| [initializeV2()](#initialize-v2) | Create Genesis Account and mint token |
| [finalizeV2()](#finalize-v2) | Lock configuration, activate launch |

### Buckets

| Function | Description |
|----------|-------------|
| [addLaunchPoolBucketV2()](#add-launch-pool-bucket-v2) | Add proportional distribution bucket |
| [addPresaleBucketV2()](#add-presale-bucket-v2) | Add fixed-price sale bucket |
| [addUnlockedBucketV2()](#add-unlocked-bucket-v2) | Add treasury/recipient bucket |

### Launch Pool Operations

| Function | Description |
|----------|-------------|
| [depositLaunchPoolV2()](#deposit-launch-pool-v2) | Deposit SOL into Launch Pool |
| [withdrawLaunchPoolV2()](#withdraw-launch-pool-v2) | Withdraw SOL (during deposit period) |
| [claimLaunchPoolV2()](#claim-launch-pool-v2) | Claim tokens (after deposit period) |

### Presale Operations

| Function | Description |
|----------|-------------|
| [depositPresaleV2()](#deposit-presale-v2) | Deposit SOL into Presale |
| [claimPresaleV2()](#claim-presale-v2) | Claim tokens (after deposit period) |

### Admin

| Function | Description |
|----------|-------------|
| [transitionV2()](#transition-v2) | Execute end behaviors |
| [revokeMintAuthorityV2()](#revoke-mint-authority-v2) | Permanently revoke mint authority |
| [revokeFreezeAuthorityV2()](#revoke-freeze-authority-v2) | Permanently revoke freeze authority |

---

## Function Signatures

### initializeV2

```typescript
await initializeV2(umi, {
  baseMint,           // Signer - new token keypair
  quoteMint,          // PublicKey - deposit token (wSOL)
  fundingMode,        // number - use 0
  totalSupplyBaseToken, // bigint - supply with decimals
  name,               // string - token name
  symbol,             // string - token symbol
  uri,                // string - metadata URI
}).sendAndConfirm(umi);
```

### finalizeV2

```typescript
await finalizeV2(umi, {
  baseMint,           // PublicKey
  genesisAccount,     // PublicKey
}).sendAndConfirm(umi);
```

### addLaunchPoolBucketV2

```typescript
await addLaunchPoolBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint - tokens for this bucket
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addPresaleBucketV2

```typescript
await addPresaleBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint
  allocationQuoteTokenCap,  // bigint - SOL cap (sets price)
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  depositLimit,             // bigint | null - max per user
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addUnlockedBucketV2

```typescript
await addUnlockedBucketV2(umi, {
  genesisAccount,       // PublicKey
  baseMint,             // PublicKey
  baseTokenAllocation,  // bigint - usually 0n
  recipient,            // PublicKey - who can claim
  claimStartCondition,  // TimeCondition
  claimEndCondition,    // TimeCondition
  backendSigner,        // null
}).sendAndConfirm(umi);
```

### depositLaunchPoolV2

```typescript
await depositLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### depositPresaleV2

```typescript
await depositPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### withdrawLaunchPoolV2

```typescript
await withdrawLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### claimLaunchPoolV2

```typescript
await claimLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### claimPresaleV2

```typescript
await claimPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### transitionV2

```typescript
await transitionV2(umi, {
  genesisAccount,     // PublicKey
  primaryBucket,      // PublicKey
  baseMint,           // PublicKey
})
  .addRemainingAccounts([/* destination accounts */])
  .sendAndConfirm(umi);
```

### revokeMintAuthorityV2

```typescript
await revokeMintAuthorityV2(umi, {
  baseMint,           // PublicKey
}).sendAndConfirm(umi);
```

### revokeFreezeAuthorityV2

```typescript
await revokeFreezeAuthorityV2(umi, {
  baseMint,           // PublicKey
}).sendAndConfirm(umi);
```

---

## PDA Helpers

| Function | Seeds |
|----------|-------|
| findGenesisAccountV2Pda() | `baseMint`, `genesisIndex` |
| findLaunchPoolBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findPresaleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findUnlockedBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findLaunchPoolDepositV2Pda() | `bucket`, `recipient` |
| findPresaleDepositV2Pda() | `bucket`, `recipient` |

```typescript
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, { baseMint: mint.publicKey, genesisIndex: 0 });
const [bucketPda] = findLaunchPoolBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
const [depositPda] = findLaunchPoolDepositV2Pda(umi, { bucket: bucketPda, recipient: wallet });
```

---

## Fetch Functions

| Function | Returns |
|----------|---------|
| fetchLaunchPoolBucketV2() | Bucket state (throws if missing) |
| safeFetchLaunchPoolBucketV2() | Bucket state or `null` |
| fetchPresaleBucketV2() | Bucket state (throws if missing) |
| safeFetchPresaleBucketV2() | Bucket state or `null` |
| fetchLaunchPoolDepositV2() | Deposit state (throws if missing) |
| safeFetchLaunchPoolDepositV2() | Deposit state or `null` |
| fetchPresaleDepositV2() | Deposit state (throws if missing) |
| safeFetchPresaleDepositV2() | Deposit state or `null` |

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, bucketPda);
const deposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // null if not found
```

**Bucket state fields:** `quoteTokenDepositTotal`, `depositCount`, `claimCount`, `bucket.baseTokenAllocation`

**Deposit state fields:** `amountQuoteToken`, `claimed`

---

## Types

### TimeCondition

```typescript
{
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: bigint,                    // Unix timestamp (seconds)
  triggeredTimestamp: null,
}
```

### EndBehavior

```typescript
{
  __kind: 'SendQuoteTokenPercentage',
  padding: Array(4).fill(0),
  destinationBucket: PublicKey,
  percentageBps: number,           // 10000 = 100%
  processed: false,
}
```

---

## Constants

| Constant | Value |
|----------|-------|
| `WRAPPED_SOL_MINT` | `So11111111111111111111111111111111111111112` |

---

## Common Errors

| Error | Cause |
|-------|-------|
| `insufficient funds` | Not enough SOL for fees |
| `already initialized` | Genesis Account exists |
| `already finalized` | Cannot modify after finalization |
| `deposit period not active` | Outside deposit window |
| `claim period not active` | Outside claim window |

---

## FAQ

### What is Umi and why is it required?
Umi is Metaplex's JavaScript framework for Solana. It provides a consistent interface for building transactions, managing signers, and interacting with Metaplex programs.

### Can I use the Genesis SDK in a browser?
Yes. The SDK works in both Node.js and browser environments. For browsers, use a wallet adapter for signing instead of keypair files.

### What's the difference between fetch and safeFetch?
`fetch` throws an error if the account doesn't exist. `safeFetch` returns `null` instead, useful for checking if an account exists.

### How do I handle transaction errors?
Wrap `sendAndConfirm` calls in try/catch blocks. Check error messages for specific failure reasons.

---

## Next Steps

For complete implementation tutorials:

- [Getting Started](/smart-contracts/genesis/getting-started) - Setup and first launch
- [Launch Pool](/smart-contracts/genesis/launch-pool) - Proportional distribution
- [Presale](/smart-contracts/genesis/presale) - Fixed-price sales
