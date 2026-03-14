---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: API reference for the Genesis JavaScript SDK. Function signatures, parameters, and types for token launches on Solana.
created: '01-15-2025'
updated: '03-10-2026'
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
  - q: How do I retrieve the launch type for a token?
    a: Fetch the GenesisAccountV2 on-chain account using fetchGenesisAccountV2FromSeeds with the token mint. The launchType field returns 0 (Uninitialized), 1 (Project), or 2 (Meme). You can also query all launches of a given type using the GPA builder.
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
| [triggerBehaviorsV2()](#trigger-behaviors-v2) | Execute end behaviors |
| [revokeV2()](#revoke-v2) | Permanently revoke mint and/or freeze authority |

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

### triggerBehaviorsV2

Processes the configured end behaviors for a primary bucket, moving collected funds to the destination buckets defined in `endBehaviors`.

```typescript
await triggerBehaviorsV2(umi, {
  genesisAccount,     // PublicKey
  primaryBucket,      // PublicKey
  baseMint,           // PublicKey
})
  .addRemainingAccounts([/* destination bucket + its quote token account */])
  .sendAndConfirm(umi);
```

### revokeV2

Permanently revokes mint and/or freeze authority for the base token.

```typescript
await revokeV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  revokeMintAuthority,      // boolean
  revokeFreezeAuthority,    // boolean
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

### Genesis Account

The Genesis Account stores top-level launch state including the [launch type](#launchtype). A backend crank sets the `launchType` field on-chain after creation via the `setLaunchTypeV2` instruction, so the value may initially be `Uninitialized` (0) until the crank processes it.

| Function | Returns |
|----------|---------|
| fetchGenesisAccountV2() | Genesis account state (throws if missing) |
| safeFetchGenesisAccountV2() | Genesis account state or `null` |
| fetchGenesisAccountV2FromSeeds() | Fetch by PDA seeds (`baseMint`, `genesisIndex`) |
| safeFetchGenesisAccountV2FromSeeds() | Same as above, returns `null` if missing |
| fetchAllGenesisAccountV2() | Batch fetch multiple genesis accounts |

```typescript
import {
  fetchGenesisAccountV2,
  fetchGenesisAccountV2FromSeeds,
  findGenesisAccountV2Pda,
  LaunchType,
} from '@metaplex-foundation/genesis';

// Fetch by PDA address
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});
const account = await fetchGenesisAccountV2(umi, genesisAccountPda);
console.log(account.data.launchType); // 0 = Uninitialized, 1 = Project, 2 = Meme

// Or fetch directly from seeds
const account2 = await fetchGenesisAccountV2FromSeeds(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});

// Check launch type
if (account2.data.launchType === LaunchType.Meme) {
  console.log('This is a memecoin launch');
} else if (account2.data.launchType === LaunchType.Project) {
  console.log('This is a project launch');
}
```

**Genesis account fields:** `authority`, `baseMint`, `quoteMint`, `totalSupplyBaseToken`, `totalAllocatedSupplyBaseToken`, `totalProceedsQuoteToken`, `fundingMode`, `launchType`, `bucketCount`, `finalized`

### GPA Builder — Query by Launch Type

Use `getGenesisAccountV2GpaBuilder()` to query all genesis accounts filtered by on-chain fields. This uses Solana's `getProgramAccounts` RPC method with byte-level filters for efficient lookups.

```typescript
import {
  getGenesisAccountV2GpaBuilder,
  LaunchType,
} from '@metaplex-foundation/genesis';

// Get all memecoin launches
const memecoins = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.Meme)
  .getDeserialized();

// Get all project launches
const projects = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.Project)
  .getDeserialized();

// Filter by multiple fields
const finalizedMemecoins = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.Meme)
  .whereField('finalized', true)
  .getDeserialized();

for (const account of memecoins) {
  console.log(account.publicKey, account.data.baseMint, account.data.launchType);
}
```

{% callout type="note" %}
`launchType` is set retroactively by a backend crank after a launch is created. Recently created launches may still show `LaunchType.Uninitialized` (0) until the crank processes them.
{% /callout %}

### Buckets and Deposits

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

### LaunchType

The on-chain launch category, set retroactively by a backend crank via the `setLaunchTypeV2` instruction.

```typescript
enum LaunchType {
  Uninitialized = 0, // Not yet set by the crank
  Project = 1,       // Structured project token launch
  Meme = 2,          // Community memecoin launch
}
```

The [Integration APIs](/smart-contracts/genesis/integration-apis) return this as a string (`'project'`, `'memecoin'`, or `'custom'`), while the on-chain SDK uses the numeric enum above.

### GenesisAccountV2

Top-level on-chain account for a Genesis launch. One account per token mint per launch index.

```typescript
{
  key: Key;
  bump: number;
  index: number;                          // Genesis index (usually 0)
  finalized: boolean;                     // true after finalizeV2()
  authority: PublicKey;                    // Launch creator
  baseMint: PublicKey;                     // Token being launched
  quoteMint: PublicKey;                    // Deposit token (e.g., wSOL)
  totalSupplyBaseToken: bigint;            // Total token supply
  totalAllocatedSupplyBaseToken: bigint;   // Supply allocated to buckets
  totalProceedsQuoteToken: bigint;         // Total deposits collected
  fundingMode: number;                     // Funding mode (0)
  launchType: number;                      // 0 = Uninitialized, 1 = Project, 2 = Meme
  bucketCount: number;                     // Number of buckets
}
```

Account size: **136 bytes**. PDA seeds: `["genesis_v2", baseMint, genesisIndex]`.

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

### How do I retrieve the launch type for a token?
Fetch the `GenesisAccountV2` account using `fetchGenesisAccountV2FromSeeds()` with the token's mint address. The `launchType` field returns `0` (Uninitialized), `1` (Project), or `2` (Meme). To query all launches of a given type, use the [GPA builder](#gpa-builder--query-by-launch-type). Alternatively, the [Integration APIs](/smart-contracts/genesis/integration-apis) return the launch type as a string in REST responses.

### How do I handle transaction errors?
Wrap `sendAndConfirm` calls in try/catch blocks. Check error messages for specific failure reasons.

---

## Next Steps

For complete implementation tutorials:

- [Getting Started](/smart-contracts/genesis/getting-started) - Setup and first launch
- [Launch Pool](/smart-contracts/genesis/launch-pool) - Proportional distribution
- [Presale](/smart-contracts/genesis/presale) - Fixed-price sales
