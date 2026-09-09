---
title: Getting Started
metaTitle: Create an MPL-Distro Token Distribution on Solana
description: Create a Merkle allocation, fund an MPL-Distro vault, and submit a wallet claim with the JavaScript SDK.
keywords:
  - MPL-Distro tutorial
  - create token distribution
  - Solana Merkle claim
  - SPL token airdrop
about:
  - MPL-Distro
  - JavaScript SDK
  - Wallet Distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
howToSteps:
  - Install the MPL-Distro and Umi JavaScript packages.
  - Build and preserve the Merkle allocation data.
  - Create and fund the on-chain distribution.
  - Submit and verify a recipient claim.
howToTools:
  - Node.js 20 or newer
  - Umi
  - MPL-Distro JavaScript SDK 0.4.x
faqs:
  - q: Does MPL-Distro create the token mint?
    a: No. Create and fund an SPL token mint before creating the distribution.
  - q: Where should Merkle proofs be stored?
    a: Store each address, amount, nonce, and proof in a durable database or claim file because the program stores only the root. See Production Delivery.
  - q: Can one wallet receive multiple allocations?
    a: Yes. Assign a different nonce to each otherwise identical wallet and amount allocation.
---

This guide sends an existing token to two wallets with [MPL-Distro](/smart-contracts/mpl-distro) and the [Umi framework](/dev-tools/umi). {% .lead %}

## Summary

An MPL-Distro launch requires an existing SPL token mint, a preserved off-chain Merkle allocation, and enough tokens in the distribution vault.

- Build the root and proofs with `prepareDistribution`.
- Create a seven-day `Wallet` distribution with permissionless submission.
- Deposit the sum of every allocation before claims begin.
- Submit the exact amount, nonce, and proof committed in the tree.

{% callout title="What You Will Build" %}
You will create a two-recipient distribution, deposit `350,000` token base units, and submit the first recipient's `100,000`-unit claim.
{% /callout %}

{% callout title="Create and Fund from the CLI" type="note" %}
The [Metaplex CLI](/dev-tools/cli/distro) can create the distribution and deposit or withdraw tokens. Generate Merkle proofs and submit claims with this SDK walkthrough.
{% /callout %}

**Jump to:** [Prerequisites](#prerequisites) · [Install](#install-the-mpl-distro-sdk) · [Create](#create-the-wallet-distribution) · [Fund](#fund-the-wallet-distribution) · [Claim](#claim-the-wallet-allocation) · [Errors](#common-mpl-distro-errors)

## Quick Start

The MPL-Distro quick start has four required phases.

1. Install the MPL-Distro client and register `mplDistro()` with Umi.
2. Generate and preserve the allocation root, proofs, amounts, and nonces.
3. Create the distribution and deposit the complete token allocation.
4. Submit a proof with `distribute` and verify its claim receipt.

## Prerequisites

MPL-Distro requires a funded Solana signer and an existing mint owned by the original SPL Token program.

- Node.js 20 or newer
- A [Umi](/dev-tools/umi) identity with SOL for rent, transaction fees, and the {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} claim protocol fee
- An existing [SPL token](/solana/spl-tokens-and-token-programs) mint and its authority's funded associated token account
- Recipient addresses and allocation amounts expressed in token base units (the mint's smallest denomination; a 6-decimal token uses `1_000_000` units per 1.0 token)

{% callout type="warning" %}
The examples do not accept Token-2022 mints. Use an original SPL Token program mint.
{% /callout %}

## Install the MPL-Distro SDK

Install the MPL-Distro client and its Umi peer dependencies in the application that prepares and submits transactions.

```shell {% title="Terminal" %}
npm install @metaplex-foundation/mpl-distro@^0.4 \
  @metaplex-foundation/umi@^1.1 \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox@^0.10
```

Install [`@metaplex-foundation/mpl-core`](/smart-contracts/mpl-distro/wallet-distribution#claim-to-a-core-asset-signer) only when claiming into a Core asset signer.

## Create the Wallet Distribution

Create the distribution by committing the recipient list as a Merkle root and storing the returned proofs off-chain.

{% code-tabs-imported from="mpl-distro/create_distribution" frameworks="umi" filename="createDistribution" /%}

The `seed` signer makes the distribution address unique for a mint, so the same token can have more than one distribution. The resulting [PDA](/solana/understanding-pdas) uses `["distribution", mint, seed]`, so the seed public key must be retained if the application needs to derive the address again.

{% callout title="Allocation Data Is Immutable During Claims" type="warning" %}
The authority cannot change the Merkle root, tree height, start time, or claimant count while `startTime <= now <= endTime`. Validate and back up the complete allocation file before opening claims.
{% /callout %}

## Fund the Wallet Distribution

Fund the distribution by depositing at least the sum of every allocation into its program-owned associated token account. The current distribution authority must sign `deposit`.

{% code-tabs-imported from="mpl-distro/fund_distribution" frameworks="umi" filename="fundDistribution" /%}

This tutorial deposits tokens only. Optional claim-receipt rent subsidies are covered in [Funding and Recovery](/smart-contracts/mpl-distro/funding-and-recovery).

## Claim the Wallet Allocation

Claim an allocation by submitting the same recipient, amount, nonce, and proof generated from the committed list.

{% code-tabs-imported from="mpl-distro/claim_distribution" frameworks="umi" filename="claimDistribution" /%}

The program creates the recipient's canonical associated token account when needed, transfers tokens from the vault, and creates a claim receipt. A second transaction with the same allocation fails with `AlreadyClaimed`.

## Verify the MPL-Distro Accounts

Verify a claim by fetching the distribution and deterministic claim receipt after confirmation.

{% code-tabs-imported from="mpl-distro/verify_claim" frameworks="umi" filename="verifyClaim" /%}

## Common MPL-Distro Errors

MPL-Distro errors identify mismatched proofs, windows, permissions, and vault balances.

| Error | Cause | Resolution |
|---|---|---|
| `InvalidClaimProof` | Address, amount, nonce, or proof differs from the committed leaf | Load every value from the same preserved allocation record |
| `DistributionNotStarted` | The cluster timestamp is before `startTime` | Wait for the configured Unix timestamp |
| `DistributionEnded` | The cluster timestamp is after `endTime` | The authority must create a new distribution |
| `AlreadyClaimed` | The claim receipt PDA already exists | Treat the allocation as completed |
| `InsufficientFunds` | Recorded distribution balance is below the claim amount | Deposit more tokens before, during, or after the active window, or review prior withdrawals |
| `RecipientMustSign` | A recipient-gated claim omitted the recipient signer | Submit with the recipient as a signer |
| `InvalidDistributor` | The permissioned distributor does not match | Use the configured distributor signer |

## Tested Configuration

The getting-started flow is based on the current MPL-Distro client tests and generated instruction builders.

| Component | Version |
|---|---|
| `@metaplex-foundation/mpl-distro` | 0.4.x |
| `@metaplex-foundation/umi` | 1.1.x or newer |
| `@metaplex-foundation/mpl-toolbox` | 0.10.x |
| Token program | Original SPL Token program |

## Notes

The getting-started flow demonstrates a small wallet distribution. [Production Delivery](/smart-contracts/mpl-distro/production-delivery) covers proof storage, claim pages, and recovering unclaimed tokens.

- Use Unix timestamps in seconds, not JavaScript milliseconds.
- Use `bigint` for token base-unit amounts and timestamps.
- `prepareDistribution` switches to a memory-optimized implementation at 1,000 allocations.
- Run very large allocation builds in a controlled Node.js process and test proof delivery before funding mainnet.
- A permissionless payer can submit a claim for another wallet, but tokens still go only to that recipient.

## FAQ

### Does MPL-Distro create the token mint?

No. Create and fund an [SPL token](/tokens/create-a-token) mint before creating the distribution.

### Where should Merkle proofs be stored?

Store each address, amount, nonce, and proof in a durable database or claim file because the program stores only the root. See [Production Delivery](/smart-contracts/mpl-distro/production-delivery).

### Can one wallet receive multiple allocations?

Yes. Assign a different nonce to each otherwise identical wallet and amount allocation.
