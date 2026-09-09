---
title: Production Delivery
metaTitle: Deliver MPL-Distro Claims in Production
description: Persist Merkle proofs, give recipients a way to claim, and recover unclaimed MPL-Distro tokens after the window ends.
keywords:
  - MPL-Distro airdrop
  - Merkle proof delivery
  - token claim page
  - recover unclaimed tokens
about:
  - MPL-Distro
  - Claim Delivery
  - Token Airdrop
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-27-2026'
updated: '08-27-2026'
howToSteps:
  - Choose a claim submission mode that matches who should sign.
  - Persist every allocation's address, amount, nonce, and proof.
  - Deliver those records through a claim page or lookup API.
  - Recover unclaimed tokens after the claim window ends.
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: Does MPL-Distro host a claim website?
    a: No. The program stores only the Merkle root. The application must persist proofs and provide a claim page or API.
  - q: Can an email or Discord handle be the Merkle leaf?
    a: No. Leaves are wallet public keys or legacy NFT mints. Off-chain channels can notify users, but they are not on-chain identities.
  - q: Is it safe to make Merkle proofs public?
    a: In Permissionless mode, anyone with a valid proof can submit the claim; tokens still go to the leaf address. Use Recipient mode when proof access alone must not authorize submission.
  - q: Should a backend submit every Merkle proof itself?
    a: No. That is usually more expensive than SPL transfers because each Distro claim pays the protocol fee. Use a relayer to pay SOL for user-initiated claims, or use Distro when some allocations may go unclaimed.
  - q: When can unclaimed tokens be recovered?
    a: The authority can withdraw tokens before the start timestamp or after the end timestamp. Withdrawals are rejected while the distribution is active.
---

[MPL-Distro](/smart-contracts/mpl-distro) stores only the Merkle root on-chain. A production airdrop persists each allocation's proof off-chain and gives recipients a way to submit it. {% .lead %}

## Summary

Production delivery is the off-chain work around an MPL-Distro distribution: store claim records, serve them to the right claimant, and recover leftovers when the window ends.

- Create and fund the distribution with the [Getting Started](/smart-contracts/mpl-distro/getting-started) flow or the [Metaplex CLI](/dev-tools/cli/distro).
- Persist `address`, `amount`, `nonce`, and `proof` for every allocation before claims open.
- Choose [Permissionless, Recipient, or Permissioned](/smart-contracts/mpl-distro/wallet-distribution#wallet-claim-submission-modes) submission to match who should sign.
- Recover unclaimed tokens with [Funding and Recovery](/smart-contracts/mpl-distro/funding-and-recovery) after the window ends.

{% callout title="No Hosted Claim Interface" type="note" %}
MPL-Distro does not ship a claim website or email, SMS, or Discord identity. The [Metaplex CLI](/dev-tools/cli/distro) can create, fund, inspect, and recover a distribution; it does not generate Merkle proofs or submit claims. Notify users through any channel you already use; the on-chain leaf is still a wallet or [legacy NFT](/smart-contracts/mpl-distro/legacy-nft-distribution) mint.
{% /callout %}

**Jump to:** [Prerequisites](#prerequisites) · [Submission Mode](#choose-a-claim-submission-mode) · [Persist Records](#persist-allocation-records) · [Deliver Proofs](#deliver-merkle-proofs) · [Recover Tokens](#recover-unclaimed-tokens)

## Quick Start

A production MPL-Distro airdrop has five delivery steps around the on-chain program.

1. Build a complete allocation list and generate the root with `prepareDistribution`.
2. Persist one claim record per allocation, then create and fund the distribution.
3. Serve each record from a claim page or lookup API keyed by wallet or NFT mint.
4. Submit `distribute` or `distributeToLegacyNft` with the stored amount, nonce, and proof.
5. After `endTime`, withdraw unclaimed tokens and unused receipt-rent subsidy.

## Prerequisites

Production delivery starts from an existing [SPL token](/solana/spl-tokens-and-token-programs) mint and a finished allocation list.

- A [Getting Started](/smart-contracts/mpl-distro/getting-started) distribution (or the same create and deposit steps in your backend)
- Durable storage for claim records (database, object store, or downloadable file)
- A claim transaction payer funded for rent, network fees, and the {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} protocol fee
- A distribution type: [wallet](/smart-contracts/mpl-distro/wallet-distribution) or [legacy NFT](/smart-contracts/mpl-distro/legacy-nft-distribution)

Allocation amounts are token base units. For a 6-decimal mint, `1.0` token is `1_000_000`.

## Choose a Claim Submission Mode

`allowedDistributor` decides who may submit a valid proof; it does not change where the tokens go.

| Mode | Who signs the claim | Typical production shape |
|---|---|---|
| `Permissionless` | Any funded payer | A claim page where the user or a relayer pays; tokens still go to the leaf |
| `Recipient` | The leaf wallet or current NFT owner | A claim page where the beneficiary must approve the transaction |
| `Permissioned` | The configured `permissionedDistributor` | One backend is the only signer allowed to submit proofs |

Tokens always arrive at the leaf's canonical [associated token account](/solana/understanding-solana-accounts#associated-token-accounts-atas) (or the current NFT owner's ATA for `LegacyNft`). Permissionless submission cannot redirect funds to the payer.

Keep the distribution authority and any permissioned-distributor key outside browser applications.

## Persist Allocation Records

Each claim needs the same address, amount, nonce, and proof that `prepareDistribution` used for that leaf. The on-chain account cannot reconstruct those values from the root.

Start from a complete list, then store the proof at the same index:

```json {% title="allocations.json" %}
[
  {
    "address": "8SoWVrwJ6vPa3rcdNBkhznR54yJ6iQqPSmgcXVGnwtEu",
    "amount": "10000000",
    "nonce": "0"
  },
  {
    "address": "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
    "amount": "5000000",
    "nonce": "0"
  }
]
```

{% code-tabs-imported from="mpl-distro/persist_claim_records" frameworks="umi" filename="persistClaimRecords" /%}

After `createDistribution`, store the distribution [PDA](/solana/understanding-pdas) on every record. The claim transaction needs that address plus `mint`, `amount`, `nonce`, and `proof`.

| Field | Required for | Notes |
|---|---|---|
| `address` | Leaf identity | Wallet public key or legacy NFT mint |
| `amount` | Leaf data | Token base units as a string or `bigint` |
| `nonce` | Leaf data | Defaults to `0`; required when the same address and amount appear twice |
| `proof` | `distribute` | One 32-byte sibling hash per tree level, in SDK order |
| `distribution` | `distribute` | PDA from `findDistributionPda` after create |

{% callout title="Store Proofs Before Opening Claims" type="warning" %}
The authority cannot change the Merkle root, tree height, start time, or claimant count while `startTime <= now <= endTime`. Back up the full allocation file before the window starts.
{% /callout %}

## Deliver Merkle Proofs

The application looks up one stored record and passes it to `distribute` or `distributeToLegacyNft`. MPL-Distro does not index recipients.

Common delivery shapes:

1. **Claim page.** The user connects a wallet, pays network fees, and submits their stored proof.
2. **Lookup API.** A service maps `address` → `{ amount, nonce, proof, distribution }` for your frontend or relayer.
3. **Sponsored claim.** The recipient (or an eligibility check) still triggers the claim. A relayer pays SOL so the user does not need a funded wallet. Tokens still go to the leaf ATA.

Sponsored claims are not a substitute for sending every allocation in one backend loop. Each Distro claim still pays the {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} protocol fee. If every recipient will receive tokens immediately with no claim step, use direct [SPL token](/solana/spl-tokens-and-token-programs) transfers.

Use Distro when some allocations may go unclaimed, when you need a public Merkle commitment and time window, or when a relayer should pay only for people who actually claim.

For `LegacyNft`, key the lookup by NFT mint. Resolve the current owner at claim time; do not freeze a snapshot owner into the leaf unless you intended a [wallet distribution](/smart-contracts/mpl-distro/wallet-distribution) instead.

Do not rebuild proofs from the on-chain root. A proof generated with a different hash, byte order, or leaf set fails with `InvalidClaimProof`.

## Open the Claim Window

Claims succeed only when the cluster time is inside the inclusive `startTime`–`endTime` window and the vault holds enough tokens.

Create, deposit, and submit the first test claim with the [Getting Started](/smart-contracts/mpl-distro/getting-started) flow before opening the list to every recipient. Confirm:

- A sample proof from the persisted file matches `distribute`.
- The protocol fee payer has SOL for the {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} fee plus receipt rent, or [receipt subsidies](/smart-contracts/mpl-distro/funding-and-recovery#fund-claim-receipt-subsidies) are funded.
- Authority keys are not exposed to the claim frontend.

## Monitor Claims

A successful claim creates a permanent claim-receipt [PDA](/solana/understanding-pdas). Fetch that account, or compare `claimCount` / `claimAmount` on the distribution, to know which allocations are done.

Treat `AlreadyClaimed` as success for that exact `(distribution, recipient, amount, nonce)` tuple. Ownership transfer of a `LegacyNft` mint does not reset the receipt.

## Recover Unclaimed Tokens

The distribution authority withdraws leftover tokens and unused subsidy SOL only when the distribution is inactive: before `startTime` or after `endTime`.

See [Funding and Recovery](/smart-contracts/mpl-distro/funding-and-recovery#recover-unclaimed-tokens) for `withdraw` and `withdrawSubsidy`. Leave operational margin around the end timestamp so the last claims are not racing a recovery transaction.

## Production Delivery Checklist

Validate the off-chain file against the on-chain root before users rely on it.

- Sum of `amount` values is covered by the vault deposit.
- Every persisted proof is the `prepareDistribution` output for that same list, in the same order.
- `Recipient` mode is used when a leaked proof must not be enough to submit.
- Claim frontends never hold the distribution authority.
- Unclaimed tokens have an owner who can call `withdraw` after `endTime`.

## Notes

MPL-Distro does not replace your allocation database, notification channel, or claim UI.

- `totalClaimants` is metadata and does not cap successful proofs.
- Claim receipts are not closed, so receipt rent stays allocated.
- Large lists should be built in a controlled Node.js process; `prepareDistribution` switches implementation at 1,000 leaves.

## FAQ

### Does MPL-Distro host a claim website?

No. The program stores only the Merkle root. The application must persist proofs and provide a claim page or API.

### Can an email or Discord handle be the Merkle leaf?

No. Leaves are wallet public keys or legacy NFT mints. Off-chain channels can notify users, but they are not on-chain identities.

### Is it safe to make Merkle proofs public?

In `Permissionless` mode, anyone with a valid proof can submit the claim; tokens still go to the leaf address. Use `Recipient` mode when proof access alone must not authorize submission.

### Should a backend submit every Merkle proof itself?

No. Submitting every proof from a backend is usually more expensive than [SPL token](/solana/spl-tokens-and-token-programs) transfers because each Distro claim pays the protocol fee. Use a relayer so users without SOL can still claim, or use Distro when some allocations may go unclaimed and you need the Merkle window.

### When can unclaimed tokens be recovered?

The authority can withdraw tokens before the start timestamp or after the end timestamp. Withdrawals are rejected while `startTime <= clusterTime <= endTime`.
