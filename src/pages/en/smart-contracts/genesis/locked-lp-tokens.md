---
title: Locked LP Tokens
metaTitle: Locked LP Tokens on Graduation | Genesis Bonding Curve | Metaplex
description: When a Genesis bonding curve graduates, LP tokens from the Raydium CPMM pool are program-locked in a Genesis bucket with vesting set to never. Learn how to verify the lock onchain.
created: '04-22-2026'
updated: '04-22-2026'
keywords:
  - locked LP tokens
  - LP token lock
  - graduation
  - bonding curve graduation
  - Raydium CPMM
  - program locked
  - program locked liquidity
  - Genesis
  - LP burn
  - liquidity lock
about:
  - LP token locking
  - Bonding curve graduation
  - Raydium CPMM liquidity
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Are LP tokens burned or locked during graduation?
    a: LP tokens are program-locked, not burned. They are transferred to an associated token account owned by a Genesis bucket signer PDA. The bucket's lpLockSchedule has both its startCondition and cliffCondition set to Never, meaning no wallet can claim them.
  - q: Can anyone withdraw the locked LP tokens?
    a: No. The lpLockSchedule on the RaydiumCpmmBucketV2 account has its startCondition and cliffCondition set to Never. There is no instruction or authority that can release them.
  - q: How can I verify that LP tokens are locked onchain?
    a: Fetch the RaydiumCpmmBucketV2 account using the Genesis SDK and check that extensions.lpLockSchedule has both startCondition.__kind and cliffCondition.__kind set to Never. The lpTokenBalance field shows the exact number of LP tokens held.
  - q: What is the difference between burning LP tokens and program-locking them?
    a: Burning destroys tokens via an SPL token burn instruction, permanently removing them from circulation. Program-locking transfers them to a PDA with vesting set to never — the tokens still exist onchain and can be verified, but no wallet can withdraw them. Both approaches make the liquidity permanent.
---

LP tokens created during [bonding curve graduation](/smart-contracts/genesis/bonding-curve#lifecycle) are program-locked in a Genesis-owned bucket. No wallet can withdraw them. {% .lead %}

## Summary

When a Genesis bonding curve sells out and graduates into a [Raydium CPMM](/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated) pool, the resulting LP tokens are transferred to a PDA owned by the Genesis program. The vesting schedule on this bucket is set to `Never`, making the tokens inaccessible.

- **LP tokens are not burned** — they are transferred to a Genesis bucket signer PDA with vesting set to never
- **Program-locked** — the `lpLockSchedule.startCondition` and `cliffCondition` are both `Never`, so no instruction or authority can release them
- **Verifiable onchain** — fetch the `RaydiumCpmmBucketV2` account to confirm the lock schedule and token balance
- **Happens automatically** — locking occurs as part of the graduation process with no manual step

## How LP Token Locking Works

During graduation, LP tokens are deposited into an ATA owned by a **bucket signer PDA** — a program-derived address with no private key. The `RaydiumCpmmBucketV2` account locks them by setting both `lpLockSchedule.startCondition` and `cliffCondition` to `{ __kind: 'Never' }`, preventing any withdrawal.

{% callout type="note" %}
Some platforms refer to this as "burning" LP tokens. In Genesis the LP tokens are not sent to a burn address — they remain in a verifiable onchain account. The term **program-locked** is more accurate because the tokens exist and can be audited, but no wallet can access them.
{% /callout %}

### Graduation Flow

1. Bonding curve sells out (`baseTokenBalance` reaches zero)
2. Graduation fires automatically — accumulated SOL and tokens migrate to a Raydium CPMM pool
3. Raydium returns LP tokens to the Genesis program
4. LP tokens are deposited into the bucket signer's ATA
5. The `lpLockSchedule.startCondition` and `cliffCondition` are set to `Never` — program-locking the LP tokens

## Verifying the LP Token Lock

Fetch the `RaydiumCpmmBucketV2` account and inspect the `lpLockSchedule` extension to confirm that LP tokens are locked.

### Deriving the Accounts

Three accounts form the LP token lock:

| Account | Description | How to Derive |
|---------|-------------|---------------|
| **Raydium Bucket PDA** | The `RaydiumCpmmBucketV2` account storing graduation state and lock config | `findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex })` |
| **Bucket Signer PDA** | The PDA that owns the LP token ATA — has no private key | `findRaydiumBucketSignerPda(umi, { bucket })` |
| **Bucket Signer ATA** | The associated token account holding the locked LP tokens | Standard ATA derivation using the bucket signer + LP mint |

### Fetching and Checking the Lock

```typescript {% title="verify-lp-lock.ts" showLineNumbers=true %}
import {
  genesis,
  findRaydiumCpmmBucketV2Pda,
  fetchRaydiumCpmmBucketV2,
  findRaydiumBucketSignerPda,
  findLpMintPda,
  RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';

const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis());

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

// 1. Derive the Raydium bucket PDA
const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// 2. Fetch the bucket account
const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);

// 3. Check the LP lock schedule
const lpLockSchedule = raydiumBucket.extensions.lpLockSchedule;

if (lpLockSchedule.__option === 'Some') {
  const schedule = lpLockSchedule.value;
  console.log('LP lock start condition:', schedule.startCondition.__kind);
  console.log('LP lock cliff condition:', schedule.cliffCondition.__kind);
  // Expected output: both "Never"
}

console.log('LP token balance:', raydiumBucket.lpTokenBalance);

// 4. Derive the bucket signer PDA
const [bucketSignerPda] = findRaydiumBucketSignerPda(umi, {
  bucket: raydiumBucketPda,
});

console.log('Bucket signer (LP token owner):', bucketSignerPda);

// 5. Derive the LP mint from the pool state
const [lpMint] = findLpMintPda(umi, RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET, raydiumBucket.poolState);

// 6. Derive the bucket signer's ATA for the LP mint
const [bucketSignerAta] = findAssociatedTokenPda(umi, {
  mint: lpMint,
  owner: bucketSignerPda,
});

console.log('LP mint:', lpMint);
console.log('Bucket signer ATA (holds LP tokens):', bucketSignerAta);
```

### Expected Output

When LP tokens are program-locked, the output confirms:

```
LP lock start condition: Never
LP lock cliff condition: Never
LP token balance: 123456789
Bucket signer (LP token owner): <PDA address>
LP mint: <LP mint address>
Bucket signer ATA (holds LP tokens): <ATA address>
```

The `startCondition.__kind` value of `Never` confirms that no vesting begins, and the `cliffCondition` of `Never` confirms there is no cliff release. Together they prove the LP tokens cannot be withdrawn.

## RaydiumCpmmBucketV2 Account Fields

Key fields on the `RaydiumCpmmBucketV2` account relevant to LP token locking:

| Field | Type | Description |
|-------|------|-------------|
| `lpTokenBalance` | `bigint` | Number of LP tokens held in the bucket signer's ATA |
| `lpClaimAuthority` | `Option<PublicKey>` | Authority that could claim LP tokens — `None` when no authority is set |
| `lpTokensClaimed` | `bigint` | Cumulative LP tokens claimed (zero when fully locked) |
| `bucketSigner` | `PublicKey` | PDA that owns the ATA holding LP tokens |
| `extensions.lpLockSchedule` | `Option<ClaimSchedule>` | Vesting schedule for LP tokens — `startCondition` set to `Never` |
| `poolState` | `PublicKey` | Address of the Raydium CPMM pool state account (not the LP mint — read the pool state to obtain the LP mint) |

### ClaimSchedule Fields

The `lpLockSchedule` extension is a `ClaimSchedule` with these fields:

| Field | Type | Description |
|-------|------|-------------|
| `startCondition` | `Condition` | When claims can begin — `{ __kind: 'Never' }` for program lock |
| `duration` | `bigint` | Vesting duration in seconds (irrelevant when start is `Never`) |
| `period` | `bigint` | Vesting period interval (irrelevant when start is `Never`) |
| `cliffCondition` | `Condition` | Cliff condition for vesting — also `{ __kind: 'Never' }` for LP lock |
| `cliffAmountBps` | `number` | Cliff unlock percentage in basis points (irrelevant when start is `Never`) |

{% callout type="note" %}
The `duration`, `period`, and `cliffAmountBps` fields are present in the `ClaimSchedule` struct but are functionally irrelevant when both `startCondition` and `cliffCondition` are `Never`. Neither vesting nor cliff release can begin.
{% /callout %}


## FAQ

### Are LP tokens burned or locked during graduation?

LP tokens are program-locked, not burned. They are transferred to an [associated token account](/solana/understanding-solana-accounts#associated-token-accounts-atas) owned by a Genesis bucket signer PDA. The bucket's `lpLockSchedule` has both its `startCondition` and `cliffCondition` set to `Never`, meaning no wallet can claim them.

### Can anyone withdraw the locked LP tokens?

No. The `lpLockSchedule` on the `RaydiumCpmmBucketV2` account has both its `startCondition` and `cliffCondition` set to `Never`. There is no instruction or authority that can release them.

### How can I verify that LP tokens are locked onchain?

Fetch the `RaydiumCpmmBucketV2` account using the Genesis SDK and check that `extensions.lpLockSchedule` has both `startCondition.__kind` and `cliffCondition.__kind` set to `Never`. The `lpTokenBalance` field shows the exact number of LP tokens held. See [Verifying the LP Token Lock](#verifying-the-lp-token-lock) for the full code example.

### What is the difference between burning LP tokens and program-locking them?

Burning destroys tokens via an SPL token burn instruction, permanently removing them from circulation. Program-locking transfers them to a PDA with vesting set to `Never` — the tokens still exist onchain and can be verified, but no wallet can withdraw them. Both approaches make the liquidity permanent.

## Glossary

| Term | Definition |
|------|------------|
| **Graduation** | The automatic process triggered when a bonding curve sells out — migrates accumulated SOL and tokens into a Raydium CPMM pool |
| **LP Token** | Liquidity provider token representing a share of a Raydium CPMM pool |
| **Program-Locked** | Tokens held in a PDA-owned account with no withdrawal path — inaccessible but verifiable onchain |
| **Bucket Signer PDA** | A program-derived address that owns the ATA holding LP tokens; has no private key |
| **ClaimSchedule** | A vesting configuration with start condition, duration, period, and cliff — used on the Raydium bucket to define LP token release rules |
| **Condition: Never** | A condition variant that can never be satisfied — used as both the `startCondition` and `cliffCondition` on `lpLockSchedule` to prevent LP token claims |
| **RaydiumCpmmBucketV2** | The Genesis account that stores post-graduation state including the Raydium pool reference, LP token balance, and lock schedule |
