---
title: Legacy NFT Distribution
metaTitle: Distribute Tokens to Legacy NFT Holders with MPL-Distro
description: Configure MPL-Distro allocations by legacy NFT mint and let each NFT's current owner claim SPL tokens.
keywords:
  - legacy NFT holder rewards
  - Token Metadata NFT airdrop
  - MPL-Distro NFT distribution
  - NFT-gated token claim
about:
  - MPL-Distro
  - Legacy NFTs
  - Holder Rewards
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
howToSteps:
  - Build allocations keyed by legacy NFT mint addresses.
  - Create and fund a LegacyNft distribution.
  - Resolve the current NFT owner and token account.
  - Submit a distributeToLegacyNft claim.
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: Who receives an allocation after the NFT is transferred?
    a: The wallet that owns the NFT token account when the claim executes receives the allocation.
  - q: Can a later NFT owner claim again?
    a: No. The claim receipt is keyed by the NFT mint, amount, and nonce, so ownership transfer does not reset it.
  - q: Can this flow distribute tokens to MPL Core asset holders?
    a: No. LegacyNft validates SPL token-account ownership; Core assets require the Wallet distribution asset-signer pattern.
  - q: Does LegacyNft work for pNFTs?
    a: Yes, when the pNFT token account is owned by the original SPL Token program and holds a balance of one. Token-2022 pNFTs are not supported.
---

Legacy NFT distributions assign token allocations to NFT mint addresses and pay the wallet that owns each NFT when the claim executes. {% .lead %}

## Summary

A `LegacyNft` distribution uses the legacy NFT mint as the Merkle leaf and verifies its current SPL token-account owner during `distributeToLegacyNft`.

- Build the allocation tree from NFT mint addresses rather than owner wallets.
- Create the distribution with `DistributionType.LegacyNft`.
- Send distributed tokens to the current owner's token account.
- Record the receipt against the NFT mint so an ownership transfer cannot enable a second claim.

{% callout title="Legacy NFTs Only" type="warning" %}
This flow validates an original SPL Token account with balance one. Token Metadata NFTs and pNFTs on that token program qualify. It is not compatible with MPL Core assets or Token-2022 NFTs.
{% /callout %}

## Legacy NFT Allocation Model

Each allocation commits a legacy NFT mint address, token amount, and optional nonce.

{% code-tabs-imported from="mpl-distro/legacy_nft_allocations" frameworks="umi" filename="legacyNftAllocations" /%}

Do not build the leaves from snapshot owner wallets. The NFT mint is the stable identity that lets ownership transfer before a claim.

## Legacy NFT Ownership Verification

The program verifies current ownership from the NFT's SPL token account at claim time.

The supplied NFT token account must:

- Be owned by the original SPL Token program.
- Use the NFT mint committed in the Merkle leaf.
- Hold exactly one token.
- Be owned by the supplied `nftOwner`.

The program does not call [Token Metadata](/smart-contracts/token-metadata), Token Record, or Authorization Rules. It only checks the SPL token account listed above.

## Submit a Legacy NFT Claim

The `distributeToLegacyNft` instruction verifies the mint proof and sends tokens to the current NFT owner's associated token account.

{% code-tabs-imported from="mpl-distro/claim_legacy_nft" frameworks="umi" filename="claimLegacyNft" /%}

When `nftOwner` is omitted, the SDK defaults it to the transaction payer and derives that payer's NFT token account. Supply `nftOwner` explicitly when a permissionless service pays on behalf of another owner.

{% code-tabs-imported from="mpl-distro/sponsored_legacy_nft_claim" frameworks="umi" filename="sponsoredLegacyNftClaim" /%}

## Legacy NFT Claim Receipt

The legacy NFT receipt stores the NFT mint as its recipient identity.

| Receipt component | Value |
|---|---|
| Recipient seed | NFT mint, not owner wallet |
| Destination | Current owner's associated token account for the distributed mint |
| Ownership transfer effect | Changes who may receive an unclaimed allocation |
| Repeat claim after transfer | Rejected because the receipt remains tied to the NFT mint |

## Legacy NFT Distribution Access Modes

The allowed distributor mode applies to the NFT owner rather than the NFT mint.

| Mode | Claim signer requirement |
|---|---|
| `Permissionless` | Any payer may submit for the verified current owner |
| `Recipient` | The current `nftOwner` must sign |
| `Permissioned` | The configured permissioned distributor must sign |

Use `Recipient` when the current holder must opt in. Use `Permissionless` when a relayer can pay the claim for the verified current owner without that owner signing.

## Legacy NFT Snapshot Considerations

The Merkle tree fixes eligible NFT mints while ownership remains dynamic until each mint claims.

This distinction creates two common models:

1. **Mint eligibility model:** Eligible NFT mints can claim regardless of later transfer, and the owner at claim time receives the reward.
2. **Owner snapshot model:** Snapshot owner wallets instead and use a [Wallet distribution](/smart-contracts/mpl-distro/wallet-distribution) when transfer after the snapshot must not move eligibility.

{% callout title="Prevent Marketplace Surprises" type="note" %}
Publish whether eligibility follows the NFT mint or the snapshot owner. A buyer can receive an unclaimed mint-based allocation, but cannot determine claim status from ownership alone; the application should check the claim receipt.
{% /callout %}

## Notes

Legacy NFT distributions verify fungible token-account facts rather than complete NFT metadata semantics.

- Collection verification and NFT eligibility must happen before root generation.
- Frozen or delegated NFT token accounts still need application-level review.
- The reward token goes to the NFT owner's canonical associated token account.
- The current program does not close claim receipts after redemption.

## FAQ

### Who receives an allocation after the NFT is transferred?

The wallet that owns the NFT token account when the claim executes receives the allocation.

### Can a later NFT owner claim again?

No. The claim receipt is keyed by the NFT mint, amount, and nonce, so ownership transfer does not reset it.

### Can this flow distribute tokens to MPL Core asset holders?

No. `LegacyNft` validates SPL token-account ownership; Core assets require the `Wallet` distribution asset-signer pattern.

### Does LegacyNft work for pNFTs?

Yes, when the pNFT token account is owned by the original SPL Token program and holds a balance of one. The program does not call Token Metadata, Token Record, or Authorization Rules. Token-2022 pNFTs are not supported.
