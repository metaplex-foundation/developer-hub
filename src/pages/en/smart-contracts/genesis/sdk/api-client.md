---
title: API Client
metaTitle: API Client | Genesis SDK | Metaplex
description: Use the Genesis API client to create and register token launches on Solana. Three integration modes from simple to full control.
created: '02-19-2026'
updated: '02-19-2026'
keywords:
  - Genesis API client
  - token launch SDK
  - createLaunch
  - registerLaunch
  - createAndRegisterLaunch
about:
  - SDK API client
  - Token launch creation
  - Launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

The Genesis API client provides high-level functions for creating and registering token launches. It handles transaction building, signing, and on-chain registration through a simple interface built on Umi. {% .lead %}

{% callout type="note" %}
We recommend using the SDK to create launches programmatically, as [metaplex.com](https://www.metaplex.com) does not yet support the full feature set of the Genesis program. Mainnet launches created through the API will appear on metaplex.com once registered.
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
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

// For server-side or scripts, load a keypair
umi.use(keypairIdentity(myKeypair));
```

## Three Integration Modes

The SDK offers three modes for creating launches, from fully automatic to fully manual.

### Easy Mode — `createAndRegisterLaunch`

The simplest approach. One function call handles everything: creates the on-chain accounts, signs and sends transactions via Umi, and registers the launch.

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

**Returns `CreateAndRegisterLaunchResult`:**

| Field | Type | Description |
|-------|------|-------------|
| `signatures` | `Uint8Array[]` | Transaction signatures |
| `mintAddress` | `string` | Created token mint address |
| `genesisAccount` | `string` | Genesis account PDA address |
| `launch.id` | `string` | Launch ID |
| `launch.link` | `string` | Launch page URL |
| `token.id` | `string` | Token ID |
| `token.mintAddress` | `string` | Token mint address |

### Medium Mode — Custom Transaction Sender

Use `createAndRegisterLaunch` with a custom `txSender` callback for scenarios like multisig wallets or custom retry logic.

{% code-tabs-imported from="genesis/api_custom_sender" frameworks="umi" filename="customTxSender" /%}

The `txSender` callback receives the array of unsigned transactions and must return an array of signatures. The SDK handles registration after the callback completes.

### Full Control — `createLaunch` + `registerLaunch`

For complete control over the transaction lifecycle. You call `createLaunch` to get unsigned transactions, handle signing and sending yourself, then call `registerLaunch`.

{% code-tabs-imported from="genesis/api_full_control" frameworks="umi" filename="fullControl" /%}

**`createLaunch` returns `CreateLaunchResponse`:**

| Field | Type | Description |
|-------|------|-------------|
| `transactions` | `Transaction[]` | Unsigned Umi transactions to sign and send |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | Blockhash for confirming transactions |
| `mintAddress` | `string` | Created token mint address |
| `genesisAccount` | `string` | Genesis account PDA address |

**`registerLaunch` returns `RegisterLaunchResponse`:**

| Field | Type | Description |
|-------|------|-------------|
| `existing` | `boolean?` | `true` if launch was already registered |
| `launch.id` | `string` | Launch ID |
| `launch.link` | `string` | Launch page URL |
| `token.id` | `string` | Token ID |
| `token.mintAddress` | `string` | Token mint address |

{% callout type="warning" %}
Transactions must be confirmed on-chain before calling `registerLaunch`. The register endpoint validates that the genesis account exists and matches the expected configuration.
{% /callout %}

---

## Configuration

### CreateLaunchInput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wallet` | `PublicKey \| string` | Yes | Creator's wallet (signs transactions) |
| `token` | `TokenMetadata` | Yes | Token metadata |
| `network` | `SvmNetwork` | No | `'solana-mainnet'` (default) or `'solana-devnet'` |
| `quoteMint` | `QuoteMintInput` | No | `'SOL'` (default) or `'USDC'` |
| `launchType` | `LaunchType` | Yes | `'project'` |
| `launch` | `ProjectLaunchInput` | Yes | Launch configuration |

### TokenMetadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Token name, 1–32 characters |
| `symbol` | `string` | Yes | Token symbol, 1–10 characters |
| `image` | `string` | Yes | Image URL (valid HTTPS URL) |
| `description` | `string` | No | Max 250 characters |
| `externalLinks` | `ExternalLinks` | No | Website, Twitter, Telegram links |

### ExternalLinks

| Field | Type | Description |
|-------|------|-------------|
| `website` | `string?` | Website URL |
| `twitter` | `string?` | Twitter/X handle (`@mytoken`) or full URL |
| `telegram` | `string?` | Telegram handle or full URL |

### LaunchpoolConfig

| Field | Type | Description |
|-------|------|-------------|
| `tokenAllocation` | `number` | Tokens to sell (portion of 1B total supply) |
| `depositStartTime` | `Date \| string` | When the deposit period opens (lasts 48 hours) |
| `raiseGoal` | `number` | Minimum quote tokens to raise, in whole units (e.g. 200 SOL) |
| `raydiumLiquidityBps` | `number` | % of raised funds for Raydium LP, in basis points (2000–10000) |
| `fundsRecipient` | `PublicKey \| string` | Receives the unlocked portion of raised funds |

### LockedAllocation (Streamflow Lockup)

Optional locked token schedules can be added via `launch.lockedAllocations`:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Stream name, max 64 characters (e.g. "Team", "Advisors") |
| `recipient` | `PublicKey \| string` | Lockup recipient wallet |
| `tokenAmount` | `number` | Total tokens in the locked schedule |
| `vestingStartTime` | `Date \| string` | When the unlock schedule begins |
| `vestingDuration` | `{ value: number, unit: TimeUnit }` | Full lockup period |
| `unlockSchedule` | `TimeUnit` | How frequently tokens are released |
| `cliff` | `object?` | Optional cliff with `duration` and `unlockAmount` |

{% callout type="warning" %}
The `vestingStartTime` must be **after the deposit period ends** (i.e., after `depositStartTime` + 48 hours). The API will reject locked schedules that start before the deposit window closes.
{% /callout %}

**TimeUnit values:** `'SECOND'`, `'MINUTE'`, `'HOUR'`, `'DAY'`, `'WEEK'`, `'TWO_WEEKS'`, `'MONTH'`, `'QUARTER'`, `'YEAR'`

**Example with locked allocations:**

{% code-tabs-imported from="genesis/api_locked_allocations" frameworks="umi" filename="lockedAllocations" /%}

### SignAndSendOptions

Options for `createAndRegisterLaunch` (extends `RpcSendTransactionOptions`):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `txSender` | `(txs: Transaction[]) => Promise<Uint8Array[]>` | — | Custom transaction sender callback |
| `commitment` | `string` | `'confirmed'` | Commitment level for confirmation |
| `preflightCommitment` | `string` | `'confirmed'` | Preflight commitment level |
| `skipPreflight` | `boolean` | `false` | Skip preflight checks |

---

## Error Handling

The SDK provides three error types with type guard functions.

### GenesisApiError

Thrown when the API returns a non-success response.

```typescript
import { isGenesisApiError } from '@metaplex-foundation/genesis';

try {
  await createLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisApiError(err)) {
    console.error('API error:', err.statusCode, err.responseBody);
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| `statusCode` | `number` | HTTP status code |
| `responseBody` | `unknown` | Full response body from the API |

### GenesisApiNetworkError

Thrown when the fetch call fails (network issue, DNS failure, etc.).

```typescript
import { isGenesisApiNetworkError } from '@metaplex-foundation/genesis';

if (isGenesisApiNetworkError(err)) {
  console.error('Network error:', err.cause.message);
}
```

| Property | Type | Description |
|----------|------|-------------|
| `cause` | `Error` | The underlying fetch error |

### GenesisValidationError

Thrown when input validation fails before making an API call.

```typescript
import { isGenesisValidationError } from '@metaplex-foundation/genesis';

if (isGenesisValidationError(err)) {
  console.error(`Validation failed on field "${err.field}":`, err.message);
}
```

| Property | Type | Description |
|----------|------|-------------|
| `field` | `string` | The input field that failed validation |

### Comprehensive Error Handling

{% code-tabs-imported from="genesis/api_error_handling" frameworks="umi" filename="errorHandling" /%}

---

## Validation Rules

The SDK validates inputs before sending them to the API:

| Rule | Constraint |
|------|-----------|
| Token name | 1–32 characters |
| Token symbol | 1–10 characters |
| Token image | Valid HTTPS URL |
| Token description | Max 250 characters |
| Token allocation | Greater than 0 |
| Raise goal | Greater than 0 |
| Raydium liquidity BPS | 2000–10000 (20%–100%) |
| Total supply | Fixed at 1 billion tokens |
| Locked allocation name | Max 64 characters |

{% callout type="note" %}
The total supply is always 1 billion tokens. The SDK automatically calculates the creator allocation as the remainder after subtracting the launchpool, Raydium LP, and any locked allocations.
{% /callout %}

---

## Helper Functions

### signAndSendLaunchTransactions

If you want the default sign-and-send behavior as a standalone function (useful for retries or partial flows):

```typescript
import {
  createLaunch,
  signAndSendLaunchTransactions,
} from '@metaplex-foundation/genesis';

const createResult = await createLaunch(umi, {}, input);
const signatures = await signAndSendLaunchTransactions(umi, createResult, {
  commitment: 'confirmed',
});
```

Transactions are signed and sent sequentially — each is confirmed before the next is sent.

### buildCreateLaunchPayload

Validates input and builds the raw API payload. Exported for advanced use cases:

```typescript
import { buildCreateLaunchPayload } from '@metaplex-foundation/genesis';

const payload = buildCreateLaunchPayload(input);
// Use payload with your own HTTP client
```
