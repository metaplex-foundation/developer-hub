---
title: API Client
metaTitle: API Client | Genesis SDK | Metaplex
description: Use the Genesis API client to create and register token launches on Solana. Three integration modes from simple to full control.
created: '02-19-2026'
updated: '10-12-2026'
keywords:
  - Genesis API client
  - token launch SDK
  - createLaunch
  - registerLaunch
  - createAndRegisterLaunch
  - claimCreatorRewards
  - creator rewards
about:
  - SDK API client
  - Token launch creation
  - Launch registration
  - Creator rewards claiming
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

## Function Overview

| Function | Purpose |
|----------|---------|
| [`createAndRegisterLaunch`](#easy-mode-create-and-register-launch) | One-call token launch — create, sign, send, and register |
| [`createLaunch`](#full-control-create-launch-register-launch) | Build unsigned launch transactions for custom signing flows |
| [`registerLaunch`](#full-control-create-launch-register-launch) | Register a launch after its create transactions confirm on-chain |
| [`claimCreatorRewards`](#claim-creator-rewards) | Claim accrued creator rewards across every bucket for a wallet |

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

## Claim Creator Rewards

`claimCreatorRewards` calls `POST /v1/creator-rewards/claim` and returns the base64-encoded claim transactions for every eligible bonding-curve and Raydium bucket, already deserialized into Umi `Transaction`s. Sign and send each one using the Umi identity. For the end-to-end claim flow — including the creator fee configuration, accrual checks, and the lower-level per-bucket instructions — see [Creator Fees on the Genesis Bonding Curve](/smart-contracts/genesis/creator-fees).

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi" filename="claimCreatorRewards" /%}

### ClaimCreatorRewardsInput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wallet` | `PublicKey \| string` | Yes | The creator fee wallet to claim for. |
| `network` | `SvmNetwork` | No | `'solana-mainnet'` (default) or `'solana-devnet'`. Must match the API base URL — `https://api.metaplex.com` |
| `payer` | `PublicKey \| string` | No | Wallet that covers fees and rent on the returned transactions. Defaults to `wallet`. Use this when the creator fee wallet does not hold SOL (for example, an agent PDA). The payer must sign the returned transactions; the creator fee wallet still receives the claimed SOL. |

### ClaimCreatorRewardsResponse

| Field | Type | Description |
|-------|------|-------------|
| `transactions` | `Transaction[]` | Deserialized Umi transactions, one per bucket being claimed. Sign each with the payer identity and send. |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | The blockhash the transactions were built against. Use it to confirm — do not substitute a freshly-fetched blockhash. |

{% callout type="warning" title="No-rewards is a typed error, not an empty array" %}
When the wallet has nothing to claim, the API returns HTTP `400` with `{"error":{"message":"No rewards available to claim"}}` and the SDK throws `GenesisApiError`. Callers must catch the error and branch on `err.message` (or `err.statusCode === 400`) — they cannot rely on `result.transactions.length === 0`. See [Handling the No-Rewards Case](/smart-contracts/genesis/creator-fees#handling-the-no-rewards-case).
{% /callout %}

{% code-tabs-imported from="genesis/api_claim_creator_rewards_errors" frameworks="umi" filename="errorHandling" /%}

---

## Configuration

### CreateLaunchInput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wallet` | `PublicKey \| string` | Yes | Creator's wallet (signs transactions) |
| `token` | `TokenMetadata` | Yes | Token metadata |
| `network` | `SvmNetwork` | No | `'solana-mainnet'` (default) or `'solana-devnet'` |
| `quoteMint` | `QuoteMintInput` | No | `'SOL'` (default) or `'USDC'` |
| `launchType` | `CreateLaunchType` | Yes | `'launchpool'` — the underlying launch mechanism |
| `launch` | `LaunchpoolLaunchInput` | Yes | Launch configuration |

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
| `raiseGoal` | `number` | Minimum quote tokens to raise, in whole units (e.g. 250 SOL). Minimum 250 SOL or 5,000 USDC |
| `raydiumLiquidityBps` | `number` | % of raised funds for Raydium LP, in basis points (2000–10000) |
| `fundsRecipient` | `PublicKey \| string` | Receives the unlocked portion of raised funds |
| `softCap` | `number?` | Optional ceiling on quote tokens raised, in whole units. Deposits above it are refunded pro-rata. Must be greater than 0; omit for no cap |

### ClaimScheduleAllocation (Vesting Lock)

`ClaimScheduleAllocation` defines a Genesis-native vesting lock for part of the token supply, passed in `launch.claimScheduleAllocations`. Each allocation becomes an onchain `ClaimScheduleBucketV2`: tokens accrue on a linear curve with an optional cliff, and the SDK converts the human-readable schedule below into the onchain seconds and basis-point values.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Lock name, max 64 characters (e.g. "Team", "Advisors") |
| `recipient` | `PublicKey \| string` | Yes | Wallet that can claim the vested tokens |
| `tokenAmount` | `number` | Yes | Total tokens in the vesting schedule |
| `vestingStartTime` | `Date \| string` | Yes | When the linear vesting curve begins accruing |
| `vestingDuration` | `{ value: number, unit: TimeUnit }` | Yes | Length of the linear vesting period |
| `unlockSchedule` | `TimeUnit` | Yes | How frequently tokens unlock |
| `cliff` | `{ duration, unlockAmount? }` | No | Optional cliff. `duration` is measured from `vestingStartTime`; `unlockAmount` is a token amount, or `'linear'` (the default) for the proportional share |
| `cancelable` | `boolean` | No | Launch creator can cancel the lock. Default `false` |
| `cancelableByRecipient` | `boolean` | No | Recipient can cancel the lock. Default `false` |
| `transferable` | `boolean` | No | Launch creator can transfer the lock. Default `false` |
| `transferableByRecipient` | `boolean` | No | Recipient can transfer the lock. Default `false` |
| `pausable` | `boolean` | No | Genesis authority can pause and resume vesting. Default `false` |

{% callout type="note" %}
For a launch pool, vested tokens cannot be **claimed** until the launch graduates, even when `vestingStartTime` is earlier and tokens have already accrued. The resolved cliff share must be greater than zero.
{% /callout %}

{% callout type="warning" title="lockedAllocations is deprecated" %}
`launch.lockedAllocations` (the former Streamflow lockup) is deprecated. The SDK still accepts it and maps each entry onto a claim schedule, so existing integrations keep compiling. New integrations should use `claimScheduleAllocations`. When migrating, rename `cancelableBySender` to `cancelable` and `transferableBySender` to `transferable`.
{% /callout %}

**TimeUnit values:** `'SECOND'`, `'MINUTE'`, `'HOUR'`, `'DAY'`, `'WEEK'`, `'TWO_WEEKS'`, `'MONTH'`, `'QUARTER'`, `'YEAR'`

**Example with vesting locks:**

{% code-tabs-imported from="genesis/api_locked_allocations" frameworks="umi" filename="claimScheduleAllocations" /%}

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
