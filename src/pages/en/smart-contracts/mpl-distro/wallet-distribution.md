---
title: Wallet Distribution
metaTitle: MPL-Distro Wallet Claims and Merkle Proofs
description: Build wallet allocation trees, configure claim permissions, and submit MPL-Distro token claims.
keywords:
  - MPL-Distro wallet distribution
  - Merkle proof format
  - permissionless token claim
  - Solana airdrop
about:
  - MPL-Distro
  - Wallet Claims
  - Merkle Trees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
howToSteps:
  - Define wallet allocations and unique nonces.
  - Generate and store the Merkle root and proofs.
  - Create a Wallet distribution with the required submission mode.
  - Submit each allocation with the distribute instruction.
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: Can a backend submit a claim without the recipient signing?
    a: Yes. Permissionless mode lets a relayer pay SOL and submit the proof. Tokens still go to the leaf address. This is for gasless claims, not a bulk replacement for SPL transfers.
  - q: What prevents the same wallet allocation from being claimed twice?
    a: A deterministic claim receipt PDA records each unique distribution, recipient, amount, and nonce tuple.
  - q: Does totalClaimants limit successful claims?
    a: No. totalClaimants is metadata; Merkle inclusion and available vault funds determine whether an allocation can claim.
  - q: What address belongs in a Core asset allocation leaf?
    a: Use the Core asset-signer PDA. distributeToAssetAndClaim then moves the tokens to the current owner.
---

Wallet distributions assign fixed token amounts to public keys and verify each allocation through `distribute`. {% .lead %}

## Summary

A wallet distribution uses a wallet or other public key as the Merkle leaf identity and always transfers the allocation to that identity's associated token account.

- Use `prepareDistribution` to generate compatible roots and proofs.
- Set a nonce when duplicate recipient-and-amount allocations must remain distinct.
- Select a distributor mode that matches the application's signing model.
- Preserve every proof because proofs cannot be reconstructed from the on-chain root alone.

## Wallet Allocation Shape

Each wallet allocation contains an address, an amount in token base units, and an optional unsigned 64-bit nonce.

{% code-tabs-imported from="mpl-distro/wallet_allocations" frameworks="umi" filename="walletAllocations" /%}

Amounts must be greater than zero. A nonce defaults to zero and should change only when two leaves would otherwise contain the same address and amount.

## MPL-Distro Merkle Format

MPL-Distro hashes allocation data with Keccak-256 and sorted internal node pairs.

| Element | Encoding |
|---|---|
| Leaf data | `recipient_pubkey[32] || amount_u64_le || nonce_u64_le` |
| Leaf hash | `keccak256("claim" || leaf_data)` |
| Internal node | `keccak256(0x01 || min(left,right) || max(left,right))` |
| Odd node | Paired with itself |
| Proof item | One 32-byte sibling hash |
| Maximum configured height | 64 |

Use the SDK helper instead of implementing this format independently. A proof generated with SHA-256, big-endian integers, unsorted pairs, or a different domain prefix fails with `InvalidClaimProof`.

{% callout title="Tree Height Is a Proof Bound" type="note" %}
The on-chain `treeHeight` limits proof length; it does not independently verify `totalClaimants`. Pass the value returned by `prepareDistribution`.
{% /callout %}

## Wallet Claim Submission Modes

The `allowedDistributor` setting determines which signer may submit `distribute`.

### Permissionless Wallet Claims

Permissionless claims let any funded payer submit a valid proof while the program sends tokens only to the committed recipient.

Use this mode for a recipient-paid claim page, or a relayer that pays SOL when someone actually claims. Do not use Distro to push every allocation from a backend; that is usually more expensive than direct SPL transfers.

### Recipient-Signed Wallet Claims

Recipient claims require the committed recipient to sign the transaction.

Use this mode when the beneficiary must explicitly accept the allocation or when proof access alone must not authorize submission.

### Permissioned Wallet Claims

Permissioned claims require the configured `permissionedDistributor` signer.

Use this mode when one backend controls release timing within the broader on-chain claim window. The authority can [change the permissioned distributor](/smart-contracts/mpl-distro/updates#change-the-permissioned-distributor) later.

{% callout title="Set the Permissioned Distributor at Creation" type="warning" %}
`createDistribution` defaults `permissionedDistributor` to the System Program public key. Pass the real distributor address when `allowedDistributor` is `Permissioned`, or every claim fails with `InvalidDistributor`.
{% /callout %}

## Submit a Wallet Claim

The `distribute` instruction verifies the proof, creates the associated token account when necessary, transfers tokens, and records the receipt atomically.

{% code-tabs-imported from="mpl-distro/claim_distribution" frameworks="umi" filename="claimDistribution" /%}

The payer pays transaction fees, the {% fee product="mpl-distro" config="claim" fee="protocolFee" /%} protocol fee, and account rent. See [Funding and Recovery](/smart-contracts/mpl-distro/funding-and-recovery) for optional claim-receipt rent subsidies.

## Wallet Claim Receipt

The claim receipt prevents one exact allocation from being processed more than once.

| Field | Value |
|---|---|
| PDA seeds | `["claim_receipt", distribution, recipient, amount_le, nonce_le]` |
| Stored distribution | Distribution PDA |
| Stored recipient | Wallet or public key from the leaf |
| Stored amount | Claimed token base units |
| Stored nonce | Leaf nonce |
| Account size | 88 bytes |

Claim receipts are permanent in the current program and do not have a close instruction.

## Claim to a Core Asset Signer

`distributeToAssetAndClaim` claims a `Wallet` allocation into an [MPL Core](/smart-contracts/core) asset-signer PDA, then uses [Core Execute](/smart-contracts/core/execute-asset-signing) to move the tokens to the current owner.

Build the Merkle leaves from each asset's signer PDA, not from owner wallets. The helper then transfers the claimed tokens out of that PDA's associated token account.

{% code-tabs-imported from="mpl-distro/claim_to_core_asset" frameworks="umi" filename="claimToCoreAsset" /%}

This helper is a `Wallet` distribution flow. It is not a `LegacyNft` claim and does not validate Core collection membership on-chain.

## Wallet Distribution Security Checklist

A production wallet distribution should validate allocation integrity before publishing the root.

- Confirm the sum of allocations does not exceed the planned deposit.
- Reject zero, negative, or out-of-range amounts before calling the SDK.
- Assign deterministic nonces and store them with proofs.
- Test random proofs and every edge allocation against the final root.
- Keep authority and permissioned-distributor keys outside browser applications.
- Confirm cluster timestamps and leave operational time around the start and end boundaries.

## Notes

Wallet distributions can use any public key as a leaf identity, but the default destination is its SPL token associated token account.

- Core asset claims use `distributeToAssetAndClaim` and require the asset-signer PDA in the Merkle leaf.
- `totalClaimants` is not an on-chain claim cap.
- A valid proof can still fail when the vault lacks tokens.
- Claims are accepted at both exact boundary timestamps: `startTime <= now <= endTime`.

## FAQ

### Can a backend submit a claim without the recipient signing?

Yes. A `Permissionless` distribution lets a relayer pay SOL and submit the proof. Tokens still go to the leaf address. Use this so recipients without SOL can claim, not to replace a bulk SPL transfer.

### What prevents the same wallet allocation from being claimed twice?

A deterministic claim receipt PDA records each unique distribution, recipient, amount, and nonce tuple.

### Does totalClaimants limit successful claims?

No. `totalClaimants` is metadata; Merkle inclusion and available vault funds determine whether an allocation can claim.

### What address belongs in a Core asset allocation leaf?

Use the Core asset-signer PDA. `distributeToAssetAndClaim` then moves the tokens to the current owner.
