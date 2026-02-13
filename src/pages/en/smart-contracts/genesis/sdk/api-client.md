---
title: API Client
metaTitle: API Client | Genesis SDK | Metaplex
description: High-level API client for creating and registering token launches on Solana via the Genesis SDK. Simplified interface with automatic payload building, transaction handling, and validation.
created: '02-13-2026'
updated: '02-13-2026'
keywords:
  - Genesis API client
  - create launch
  - register launch
  - token launch SDK
  - Umi framework
about:
  - API client usage
  - Launch creation
  - Transaction handling
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What's the difference between the API Client and the low-level SDK instructions?
    a: The API Client wraps the Genesis REST API to handle account creation, transaction building, and registration in a few function calls. The low-level SDK instructions (initializeV2, addLaunchPoolBucketV2, etc.) give you full control over each on-chain instruction.
  - q: Can I use the API Client on devnet?
    a: Yes. Set network to 'solana-devnet' in your input. The SDK automatically resolves quote mint addresses for the correct network.
  - q: What quote tokens are supported?
    a: SOL (default) and USDC. You can also pass a raw mint address string for other SPL tokens.
---

The Genesis API Client provides high-level functions for creating and registering token launches. It wraps the Genesis REST API and handles payload construction, transaction signing, and on-chain confirmation. {% .lead %}

{% callout type="note" %}
The API Client is for creating **project** launches (Launch Pool type). For low-level control over individual on-chain instructions, see the [JavaScript SDK](/smart-contracts/genesis/sdk/javascript).
{% /callout %}

## Installation

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Setup

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());
```

---

## Quick Start

The simplest way to launch a token is `createAndRegisterLaunch`, which handles the full flow:

```typescript
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis';

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/...',
    description: 'A community token',
  },
  launchpool: {
    tokenAllocation: 500_000_000,
    depositStartTime: new Date('2026-03-01T00:00:00Z'),
    raiseGoal: 200,
    raydiumLiquidityBps: 5000,
    fundsRecipient: 'RecipientWallet...',
  },
});

console.log(`Mint: ${result.mintAddress}`);
console.log(`Launch page: ${result.launch.link}`);
```

---

## Functions

### createLaunch

Creates a launch via the Genesis API and returns unsigned transactions ready to be signed.

```typescript
import { createLaunch } from '@metaplex-foundation/genesis';

const result = await createLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/...',
  },
  launchpool: {
    tokenAllocation: 500_000_000,
    depositStartTime: new Date('2026-03-01T00:00:00Z'),
    raiseGoal: 200,
    raydiumLiquidityBps: 5000,
    fundsRecipient: 'RecipientWallet...',
  },
});

// Sign and send transactions sequentially
for (const tx of result.transactions) {
  const signed = await umi.identity.signTransaction(tx);
  await umi.rpc.sendTransaction(signed);
}
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `umi` | `Umi` | Umi instance with signer and RPC configured |
| `config` | `GenesisApiConfig` | API configuration (base URL, custom fetch) |
| `input` | `CreateProjectLaunchInput` | Launch configuration (see [Input Types](#createprojectlaunchinput)) |

**Returns:** `CreateLaunchResponse`

| Field | Type | Description |
|-------|------|-------------|
| `transactions` | `Transaction[]` | Deserialized Umi transactions to sign and send |
| `blockhash` | `object` | Blockhash and last valid block height for confirmation |
| `mintAddress` | `string` | The created token's mint address |
| `genesisAccount` | `string` | The genesis account PDA address |

---

### registerLaunch

Registers a confirmed launch in the Genesis database. Call this after the create transactions have been signed and confirmed on-chain.

```typescript
import { registerLaunch } from '@metaplex-foundation/genesis';

const registered = await registerLaunch(umi, {}, {
  genesisAccount: createResult.genesisAccount,
});

console.log(`Launch live at: ${registered.launch.link}`);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `umi` | `Umi` | Umi instance |
| `config` | `GenesisApiConfig` | API configuration |
| `input` | `RegisterLaunchInput` | Registration input |

**`RegisterLaunchInput` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `genesisAccount` | `PublicKey \| string` | Yes | Genesis account public key from `createLaunch` |
| `network` | `SvmNetwork` | No | Defaults to `'solana-mainnet'` |

**Returns:** `RegisterLaunchResponse`

| Field | Type | Description |
|-------|------|-------------|
| `existing` | `boolean` | Whether this launch was already registered |
| `launch.id` | `string` | Launch ID |
| `launch.link` | `string` | Public launch page URL |
| `token.id` | `string` | Token ID |
| `token.mintAddress` | `string` | Token mint address |

---

### createAndRegisterLaunch

Orchestrates the full launch flow: create → sign & send → register.

```typescript
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis';

const result = await createAndRegisterLaunch(
  umi,
  {},
  {
    wallet: umi.identity.publicKey,
    token: {
      name: 'My Token',
      symbol: 'MTK',
      image: 'https://gateway.irys.xyz/...',
    },
    launchpool: {
      tokenAllocation: 500_000_000,
      depositStartTime: new Date('2026-03-01T00:00:00Z'),
      raiseGoal: 200,
      raydiumLiquidityBps: 5000,
      fundsRecipient: 'RecipientWallet...',
    },
  },
  { commitment: 'confirmed' }
);
```

**Additional parameter:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `signAndSendOptions` | `SignAndSendOptions` | Optional confirmation settings |

**`SignAndSendOptions` fields:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `commitment` | `'processed' \| 'confirmed' \| 'finalized'` | `'confirmed'` | Confirmation level |
| `skipPreflight` | `boolean` | `false` | Skip preflight simulation |

**Returns:** `CreateAndRegisterLaunchResult`

| Field | Type | Description |
|-------|------|-------------|
| `signatures` | `Uint8Array[]` | Transaction signatures |
| `mintAddress` | `string` | Token mint address |
| `genesisAccount` | `string` | Genesis account PDA |
| `launch.id` | `string` | Launch ID |
| `launch.link` | `string` | Public launch page URL |
| `token.id` | `string` | Token ID |
| `token.mintAddress` | `string` | Token mint address |

---

### signAndSendLaunchTransactions

Signs and sends the transactions returned by `createLaunch`. Transactions are sent **sequentially** — each is confirmed before sending the next, since later transactions depend on accounts created by earlier ones.

```typescript
import { createLaunch, signAndSendLaunchTransactions } from '@metaplex-foundation/genesis';

const createResult = await createLaunch(umi, {}, input);
const signatures = await signAndSendLaunchTransactions(umi, createResult);
```

---

## Input Types

### CreateProjectLaunchInput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wallet` | `PublicKey \| string` | Yes | Creator's wallet (will sign transactions) |
| `token` | `TokenMetadata` | Yes | Token metadata |
| `launchpool` | `LaunchpoolConfig` | Yes | Launchpool configuration |
| `lockedAllocations` | `LockedAllocation[]` | No | Vesting allocations via Streamflow |
| `network` | `SvmNetwork` | No | `'solana-mainnet'` (default) or `'solana-devnet'` |
| `quoteMint` | `QuoteMintInput` | No | `'SOL'` (default), `'USDC'`, or a mint address |

### TokenMetadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Token name (1–32 characters) |
| `symbol` | `string` | Yes | Ticker symbol (1–10 characters) |
| `image` | `string` | Yes | Image URL on Irys (`https://gateway.irys.xyz/...`) |
| `description` | `string` | No | Token description (max 250 characters) |
| `externalLinks` | `ExternalLinks` | No | Website, Twitter, Telegram links |

### LaunchpoolConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tokenAllocation` | `number` | Yes | Tokens to sell (portion of 1B total supply) |
| `depositStartTime` | `Date \| string` | Yes | When deposits open (48-hour deposit period) |
| `raiseGoal` | `number` | Yes | Minimum raise in whole units (e.g., 200 SOL) |
| `raydiumLiquidityBps` | `number` | Yes | Raydium LP allocation (2000–10000 bps) |
| `fundsRecipient` | `PublicKey \| string` | Yes | Wallet receiving unlocked funds |

{% callout type="note" %}
The deposit period is always **48 hours** from `depositStartTime`. Claims open 1 second after deposits close. The SDK calculates all timing automatically.
{% /callout %}

### LockedAllocation

For token vesting via Streamflow.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Label (e.g., 'Team', 'Advisors', max 64 chars) |
| `recipient` | `PublicKey \| string` | Yes | Recipient wallet |
| `tokenAmount` | `number` | Yes | Tokens in this vesting stream |
| `vestingStartTime` | `Date \| string` | Yes | When vesting begins |
| `vestingDuration` | `{ value: number; unit: TimeUnit }` | Yes | Total vesting period |
| `unlockSchedule` | `TimeUnit` | Yes | Release frequency |
| `cliff` | `object` | No | Cliff configuration |
| `cliff.duration` | `{ value: number; unit: TimeUnit }` | Yes (if cliff) | Time until cliff |
| `cliff.unlockAmount` | `number` | No | Tokens released at cliff |

**TimeUnit values:** `'SECOND'`, `'MINUTE'`, `'HOUR'`, `'DAY'`, `'WEEK'`, `'TWO_WEEKS'`, `'MONTH'`, `'QUARTER'`, `'YEAR'`

### ExternalLinks

| Field | Type | Description |
|-------|------|-------------|
| `website` | `string` | Project website URL |
| `twitter` | `string` | Twitter/X handle or URL |
| `telegram` | `string` | Telegram handle or URL |

---

## Configuration

### GenesisApiConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `baseUrl` | `string` | `'https://api.metaplex.com'` | Genesis API base URL |
| `fetch` | `typeof fetch` | `globalThis.fetch` | Custom fetch implementation |

Pass an empty object `{}` for default configuration:

```typescript
const result = await createLaunch(umi, {}, input);
```

---

## Error Handling

The API Client throws typed errors that can be identified with type guard functions.

### GenesisValidationError

Thrown when input fails validation before the API call.

```typescript
import { isGenesisValidationError } from '@metaplex-foundation/genesis';

try {
  await createLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`Validation failed on ${err.field}: ${err.message}`);
  }
}
```

**Validation rules:**
- Token name: 1–32 characters
- Token symbol: 1–10 characters
- Token image: must be an Irys URL (`https://gateway.irys.xyz/...`)
- Token description: max 250 characters
- Token allocation: must be > 0
- Raise goal: must be > 0
- Raydium liquidity: 2000–10000 basis points
- Total allocated tokens cannot exceed 1B supply
- Deposit start time cannot be more than 30 minutes in the past

### GenesisApiError

Thrown when the API returns an error response.

```typescript
import { isGenesisApiError } from '@metaplex-foundation/genesis';

try {
  await createLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisApiError(err)) {
    console.error(`API error ${err.statusCode}: ${err.message}`);
    console.error('Response body:', err.responseBody);
  }
}
```

### GenesisApiNetworkError

Thrown when the HTTP request itself fails (network timeout, DNS failure, etc.).

```typescript
import { isGenesisApiNetworkError } from '@metaplex-foundation/genesis';

try {
  await createLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisApiNetworkError(err)) {
    console.error(`Network error: ${err.message}`);
    console.error('Cause:', err.cause);
  }
}
```

---

## Full Example

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';
import {
  genesis,
  createAndRegisterLaunch,
  isGenesisValidationError,
  isGenesisApiError,
} from '@metaplex-foundation/genesis';

// Setup
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(keypairIdentity(myKeypair));

try {
  const result = await createAndRegisterLaunch(umi, {}, {
    wallet: umi.identity.publicKey,
    token: {
      name: 'Community Token',
      symbol: 'COMM',
      image: 'https://gateway.irys.xyz/abc123',
      description: 'A community-driven token on Solana',
      externalLinks: {
        website: 'https://example.com',
        twitter: '@communitytoken',
      },
    },
    launchpool: {
      tokenAllocation: 500_000_000,
      depositStartTime: new Date('2026-03-01T00:00:00Z'),
      raiseGoal: 200,
      raydiumLiquidityBps: 5000,
      fundsRecipient: 'RecipientWallet...',
    },
    lockedAllocations: [
      {
        name: 'Team',
        recipient: 'TeamWallet...',
        tokenAmount: 100_000_000,
        vestingStartTime: new Date('2026-03-03T00:00:00Z'),
        vestingDuration: { value: 2, unit: 'YEAR' },
        unlockSchedule: 'MONTH',
        cliff: {
          duration: { value: 6, unit: 'MONTH' },
          unlockAmount: 10_000_000,
        },
      },
    ],
  });

  console.log(`Token mint: ${result.mintAddress}`);
  console.log(`Genesis account: ${result.genesisAccount}`);
  console.log(`Launch page: ${result.launch.link}`);
  console.log(`Transactions: ${result.signatures.length}`);
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`Invalid input (${err.field}): ${err.message}`);
  } else if (isGenesisApiError(err)) {
    console.error(`API error ${err.statusCode}: ${err.message}`);
  } else {
    throw err;
  }
}
```

---

## FAQ

### What's the difference between the API Client and the low-level SDK instructions?

The API Client wraps the Genesis REST API to handle account creation, transaction building, and registration in a few function calls. The [low-level SDK instructions](/smart-contracts/genesis/sdk/javascript) (`initializeV2`, `addLaunchPoolBucketV2`, etc.) give you full control over each on-chain instruction.

### Can I use the API Client on devnet?

Yes. Set `network: 'solana-devnet'` in your input. The SDK automatically resolves quote mint addresses (e.g., USDC) for the correct network.

### What quote tokens are supported?

SOL (default) and USDC via friendly names. You can also pass a raw SPL token mint address string.

### Why are transactions sent sequentially?

Later transactions depend on accounts created by earlier ones. Each transaction must be confirmed before the next can be sent.

---

## Next Steps

- [JavaScript SDK](/smart-contracts/genesis/sdk/javascript) — Low-level on-chain instructions
- [Launch Pool](/smart-contracts/genesis/launch-pool) — How Launch Pools work
- [Create Launch API](/smart-contracts/genesis/integration-apis/create-launch) — REST endpoint details
- [Register API](/smart-contracts/genesis/integration-apis/register) — REST endpoint details
