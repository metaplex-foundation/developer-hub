---
title: Creator Fees on the Genesis Bonding Curve
metaTitle: Genesis Bonding Curve Creator Fees — Configure and Claim | Metaplex
description: How to configure a creator fee on a Genesis bonding curve launch and claim accrued fees during the active curve and after graduation to a Raydium CPMM pool.
keywords:
  - creator fee
  - bonding curve
  - genesis
  - claimBondingCurveCreatorFeeV2
  - claimRaydiumCreatorFeeV2
  - creatorFeeWallet
  - creatorFeeAccrued
  - Raydium CPMM
  - token launch
  - Solana
about:
  - Creator Fees
  - Bonding Curve
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Set creatorFeeWallet in the launch object when calling createAndRegisterLaunch
  - After launch, monitor creatorFeeAccrued in the bucket account using fetchBondingCurveBucketV2
  - Call claimBondingCurveCreatorFeeV2 to collect accrued fees during the active curve
  - After graduation, call claimRaydiumCreatorFeeV2 to collect fees from the Raydium CPMM pool
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: What is the default creator fee wallet if creatorFeeWallet is not set?
    a: The default is the launching wallet — the wallet that signed the createLaunch call. Set creatorFeeWallet explicitly in the launch object to redirect fees to any other address.
  - q: Are creator fees transferred on every swap?
    a: No. Creator fees are accrued in the bucket (creatorFeeAccrued) on each swap but are not transferred immediately. Call claimBondingCurveCreatorFeeV2 to collect them during the active curve, and claimRaydiumCreatorFeeV2 after graduation.
  - q: Can anyone call claimBondingCurveCreatorFeeV2?
    a: Yes. Both claimBondingCurveCreatorFeeV2 and claimRaydiumCreatorFeeV2 are permissionless — any wallet can trigger the claim, but the SOL is always sent to the configured creator fee wallet, not the caller.
  - q: Does the first buy pay creator fees?
    a: No. When a first buy is configured, all fees — both the protocol swap fee and creator fee — are waived for that one initial purchase. All subsequent swaps pay the normal creator fee.
  - q: How do I check how much creator fee has accrued?
    a: Read the creatorFeeAccrued field from the bucket account using fetchBondingCurveBucketV2 from the Genesis SDK.
  - q: Can I change the creator fee wallet after launch?
    a: No. The creator fee wallet is set at curve creation and cannot be changed after the curve is live.
---

Creator fees are an optional per-swap fee on the [Genesis Bonding Curve](/smart-contracts/genesis/bonding-curve) that accrue to a configured wallet on every buy and sell. {% .lead %}

{% callout title="What You'll Learn" %}
- Configuring a creator fee wallet at launch
- Redirecting fees to a specific wallet or agent PDA
- Checking how much has accrued in the bucket
- Claiming accrued fees during the active curve
- Claiming post-graduation fees from the Raydium CPMM pool
{% /callout %}

## Summary

A creator fee is an optional per-swap fee on the Genesis Bonding Curve, applied to the SOL side of every buy and sell. Fees accrue in the bucket account (`creatorFeeAccrued`) rather than being transferred immediately — collect them via two permissionless instructions.

- **Configuration** — set `creatorFeeWallet` in the `launch` object at curve creation; defaults to the launching wallet if omitted
- **Accrual** — `creatorFeeAccrued` increments on every swap; fees are not transferred per-swap
- **Active curve claiming** — `claimBondingCurveCreatorFeeV2` collects accrued fees while the curve is live
- **Post-graduation claiming** — `claimRaydiumCreatorFeeV2` collects fees from the Raydium CPMM pool after the curve graduates

For how creator fees interact with swap pricing and the protocol swap fee, see [Theory of Operation — Fee Structure](/smart-contracts/genesis/bonding-curve-theory#fee-structure).

## Quick Start

**Jump to:** [Configure at Launch](#configuring-a-creator-fee-at-launch) · [Redirect to Wallet](#redirecting-creator-fees-to-a-specific-wallet) · [Agent PDA](#agent-launches-automatic-pda-routing) · [Combine with First Buy](#combining-creator-fees-with-a-first-buy) · [Check Accrued](#checking-accrued-creator-fees) · [Claim During Curve](#claiming-creator-fees-during-the-active-curve) · [Claim After Graduation](#claiming-creator-fees-after-graduation)

1. Set `creatorFeeWallet` in the `launch` object when calling `createAndRegisterLaunch`
2. After launch, read `bucket.creatorFeeAccrued` to monitor accumulated fees
3. Call `claimBondingCurveCreatorFeeV2` to collect fees while the curve is active
4. After graduation, call `claimRaydiumCreatorFeeV2` to collect Raydium LP fees

## Prerequisites

- `@metaplex-foundation/genesis` SDK installed
- A Umi instance configured with your keypair identity — see [Launching a Bonding Curve via the Metaplex API](/smart-contracts/genesis/bonding-curve-launch#umi-setup)
- A funded Solana wallet for transaction fees

## Configuring a Creator Fee at Launch

Creator fees are configured in the `launch` object passed to `createAndRegisterLaunch` (or `createLaunch`). The `creatorFeeWallet` field is optional — if omitted, the launching wallet receives all fees by default.

### Redirecting Creator Fees to a Specific Wallet

Set `creatorFeeWallet` to direct accrued fees to any wallet address other than the launching wallet.

```typescript {% title="launch-with-creator-fee.ts" showLineNumbers=true %}
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    creatorFeeWallet: 'FeeRecipientWalletAddress...',
  },
});
```

{% callout type="note" %}
The creator fee wallet is set at curve creation and cannot be changed after the curve is live.
{% /callout %}

### Agent Launches — Automatic PDA Routing

When launching on behalf of a Metaplex agent, the creator fee is automatically routed to the agent's PDA without setting `creatorFeeWallet` manually. For the full agent launch flow — Core execute wrapping and `setToken` association — see [Create an Agent Token](/agents/create-agent-token).

### Combining Creator Fees with a First Buy

You can configure a creator fee wallet and a first buy together. The first buy is always fee-free — no protocol fee or creator fee applies to that initial purchase. All subsequent swaps pay the normal creator fee.

```typescript {% title="launch-with-fee-and-first-buy.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
  firstBuyAmount: 0.5, // 0.5 SOL, fee-free for the first buyer
},
```

## Checking Accrued Creator Fees

The `creatorFeeAccrued` field on the `BondingCurveBucketV2` account tracks the total SOL accumulated since the last claim. Read it using `fetchBondingCurveBucketV2`:

```typescript {% title="check-creator-fees.ts" showLineNumbers=true %}
import {
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');

const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
console.log('Creator fees accrued (lamports):', bucket.creatorFeeAccrued);
console.log('Creator fees claimed to date (lamports):', bucket.creatorFeeClaimed);

// Read the configured creator fee wallet from the bucket extension
const creatorFeeExt = bucket.extensions.creatorFee;
const creatorFeeWallet = isSome(creatorFeeExt) ? creatorFeeExt.value.wallet : null;
console.log('Creator fee wallet:', creatorFeeWallet?.toString() ?? 'none configured');
```

## Claiming Creator Fees During the Active Curve

`claimBondingCurveCreatorFeeV2` transfers all accrued creator fees from the bucket to the configured creator fee wallet. Call it at any time while the curve is active.

```typescript {% title="claim-creator-fees.ts" showLineNumbers=true %}
import { claimBondingCurveCreatorFeeV2 } from '@metaplex-foundation/genesis';
import { isSome } from '@metaplex-foundation/umi';

// Read the creator fee wallet from the bucket extension before claiming.
const creatorFeeExt = bucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured on this bucket');
const creatorFeeWallet = creatorFeeExt.value.wallet;

const result = await claimBondingCurveCreatorFeeV2(umi, {
  genesisAccount,
  bucket: bucketPda,
  baseMint,
  creatorFeeWallet,
}).sendAndConfirm(umi);

console.log('Creator fees claimed:', result.signature);
```

{% callout type="note" %}
`claimBondingCurveCreatorFeeV2` is permissionless — any wallet can call it, but the SOL is always sent to the configured creator fee wallet, not the caller.
{% /callout %}

## Claiming Creator Fees After Graduation

After the bonding curve [graduates](/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated), liquidity migrates to a Raydium CPMM pool and creator fees continue to accrue from LP trading activity. The `RaydiumCpmmBucketV2` account exposes `creatorFeeAccrued` and `creatorFeeClaimed` fields analogous to those on `BondingCurveBucketV2`. Collect post-graduation fees with `claimRaydiumCreatorFeeV2`.

```typescript {% title="claim-raydium-creator-fees.ts" showLineNumbers=true %}
import { claimRaydiumCreatorFeeV2 } from '@metaplex-foundation/genesis';

const result = await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount,
  // ... Raydium pool accounts
}).sendAndConfirm(umi);
```

{% callout type="note" %}
Like its bonding curve counterpart, `claimRaydiumCreatorFeeV2` is permissionless — any wallet can trigger the claim, but the SOL is always sent to the configured creator fee wallet.
{% /callout %}

## Notes

- Creator fees are accrued in the bucket (`creatorFeeAccrued`) on each swap, not transferred immediately — explicitly call the claim instructions to receive them; `creatorFeeClaimed` tracks the cumulative total claimed to date
- Both claim instructions are permissionless: any wallet can trigger them, but the SOL always goes to the configured creator fee wallet, not the caller
- `creatorFeeWallet` defaults to the launching wallet if not set; it cannot be changed after the curve is created
- The first buy mechanism waives all fees (protocol and creator) for the designated initial purchase only; all subsequent swaps pay the normal creator fee
- Creator fees apply to the SOL side of every swap regardless of direction (buy or sell); they do not compound with the protocol swap fee
- For current fee rates, see the [Genesis Protocol Fees](/smart-contracts/genesis) page

## FAQ

### What is the default creator fee wallet if `creatorFeeWallet` is not set?

The default creator fee wallet is the launching wallet — the wallet that signed the `createLaunch` call. Set `creatorFeeWallet` explicitly in the `launch` object to redirect fees to any other address.

### Are creator fees transferred on every swap?

No. Creator fees are accrued in the bucket (`creatorFeeAccrued`) on each swap but are not transferred immediately. Call `claimBondingCurveCreatorFeeV2` to collect them during the active curve, and `claimRaydiumCreatorFeeV2` after graduation.

### Can anyone call `claimBondingCurveCreatorFeeV2`?

Yes. Both `claimBondingCurveCreatorFeeV2` and `claimRaydiumCreatorFeeV2` are permissionless — any wallet can trigger the claim, but the SOL is always sent to the configured creator fee wallet, not the caller.

### Does the first buy pay creator fees?

No. When a first buy is configured, all fees — protocol swap fee and creator fee — are waived for that one initial purchase. All subsequent swaps pay the normal creator fee.

### How do I check how much creator fee has accrued?

Read the `creatorFeeAccrued` field from the bucket account using `fetchBondingCurveBucketV2`. See [Checking Accrued Creator Fees](#checking-accrued-creator-fees).

### Can I change the creator fee wallet after launch?

No. The creator fee wallet is set at curve creation and cannot be changed after the curve is live.
