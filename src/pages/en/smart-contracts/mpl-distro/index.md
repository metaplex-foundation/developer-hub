---
title: MPL-Distro
metaTitle: MPL-Distro - Merkle Token Claims and Airdrops on Solana
description: Distribute an existing SPL token to wallets or legacy NFT holders. MPL-Distro stores a Merkle root on-chain instead of the full recipient list.
keywords:
  - MPL-Distro
  - Solana token distribution
  - Merkle airdrop
  - token claim
  - SPL token distribution
  - legacy NFT holder rewards
about:
  - MPL-Distro
  - Token Distribution
  - Merkle Claims
proficiencyLevel: Intermediate
created: '08-25-2026'
updated: '08-27-2026'
faqs:
  - q: What is MPL-Distro used for?
    a: MPL-Distro distributes an existing SPL token allocation to a fixed list of wallet addresses or legacy NFT mints through Merkle proofs.
  - q: Is MPL-Distro a token launchpad?
    a: No. MPL-Distro distributes an existing mint; use Genesis when you need a token generation event, sale, launch pool, or bonding curve.
  - q: Can someone pay transaction fees for recipients?
    a: Yes. Permissionless distributions let any payer submit a valid claim for a recipient, while Recipient and Permissioned modes restrict who may submit it.
  - q: Does MPL-Distro support vesting?
    a: No. MPL-Distro releases each Merkle allocation in one claim; use Genesis project vesting for schedule-based project allocations.
---

**MPL-Distro** is a Solana program that distributes an existing [SPL token](/solana/spl-tokens-and-token-programs) to a list of wallets or [legacy NFT](/smart-contracts/token-metadata) holders. It stores a compact Merkle root on-chain instead of the full recipient list. {% .lead %}

## Summary

MPL-Distro commits a recipient list as one on-chain Merkle root, holds the tokens in a vault, and records each successful claim so it cannot be reused.

- Distribute an existing SPL token mint without storing the full recipient list on-chain.
- Target wallet addresses or current holders of specific legacy NFT mints.
- Choose permissionless, recipient-only, or permissioned claim submission.
- Recover unclaimed tokens and unused receipt-rent subsidies after the claim window.

{% quick-links %}
{% quick-link title="Build a Distribution" icon="InboxArrowDown" href="/smart-contracts/mpl-distro/getting-started" description="Create, fund, and claim from a wallet distribution." /%}
{% quick-link title="Deliver Claims in Production" icon="PaperAirplane" href="/smart-contracts/mpl-distro/production-delivery" description="Store proofs, run a claim page or API, and recover unclaimed tokens." /%}
{% quick-link title="Choose a Distribution Type" icon="ArrowsRightLeft" href="/smart-contracts/mpl-distro/wallet-distribution" description="Compare wallet and legacy NFT allocation models." /%}
{% quick-link title="CLI" icon="CodeBracketSquare" href="/dev-tools/cli/distro" description="Create, fund, inspect, and recover distributions from the terminal." /%}
{% /quick-links %}

## MPL-Distro Distribution Model

A Merkle tree turns the recipient list into one 32-byte hash (the root). Each recipient later proves they are on that list with a short proof, so the full list never has to live on-chain.

1. The distribution authority builds an off-chain list containing each recipient, amount, and optional nonce.
2. `prepareDistribution` creates the Merkle root and one proof per allocation.
3. `createDistribution` stores the root, claim window, mint, and access rules.
4. `deposit` transfers the full token allocation to the distribution's associated token account.
5. `distribute` or `distributeToLegacyNft` verifies a proof and creates a permanent claim receipt.
6. `withdraw` returns unclaimed tokens after the distribution is inactive.

{% callout title="Store the Claim Data" type="warning" %}
The program stores only the Merkle root, not the recipient list or proofs. Preserve each allocation's address, amount, nonce, and proof in a database or downloadable claim file.
{% /callout %}

## MPL-Distro Distribution Types

MPL-Distro supports wallet-address allocations and legacy NFT-mint allocations through separate claim instructions.

| Distribution type | Merkle leaf identity | Claim instruction | Best for |
|---|---|---|---|
| `Wallet` | Wallet or other public key | `distribute` | Allowances, contributor rewards, and direct token airdrops |
| `LegacyNft` | Legacy NFT mint | `distributeToLegacyNft` | Rewards claimed by the NFT's current token-account owner |

The `LegacyNft` type pays the wallet that currently owns a listed NFT mint. See [Legacy NFT Distribution](/smart-contracts/mpl-distro/legacy-nft-distribution) for which NFTs qualify and how ownership is checked.

## MPL-Distro Allowed Distributor Modes

The allowed distributor mode controls who may submit a valid Merkle claim transaction.

| Mode | Required signer | Behavior |
|---|---|---|
| `Permissionless` | Any payer | A service or third party can submit claims on behalf of recipients |
| `Recipient` | Recipient wallet or legacy NFT owner | The beneficiary must approve the claim |
| `Permissioned` | Configured distributor | Only one designated distributor may submit claims |

Permissionless submission does not redirect tokens: the program always sends the allocation to the recipient's canonical [associated token account](/solana/understanding-solana-accounts#associated-token-accounts-atas).

## MPL-Distro Protocol Fees

A successful Merkle claim charges a protocol fee, paid by the claim transaction payer.

{% protocol-fees program="mpl-distro" config="claim" showTitle=false /%}

See [Protocol Fees](/protocol-fees) for the current amounts across Metaplex programs.

## Notes

MPL-Distro's on-chain checks protect claims but do not replace off-chain allocation validation.

- `totalClaimants` is metadata and does not cap the number of valid proofs.
- Deposits are not checked against the sum of all Merkle allocations; fund the vault with enough tokens before claims begin.
- Claim receipts are not closed, so their rent remains allocated.
- The program targets the original SPL Token program rather than Token-2022.
- MPL-Distro does not provide vesting, streaming, partial claims, or structured program events.

## FAQ

### What is MPL-Distro used for?

MPL-Distro distributes an existing SPL token allocation to a fixed list of wallet addresses or legacy NFT mints through Merkle proofs.

### Is MPL-Distro a token launchpad?

No. MPL-Distro distributes an existing mint; use [Genesis](/smart-contracts/genesis) when you need a token generation event, sale, launch pool, or bonding curve.

### Can someone pay transaction fees for recipients?

Yes. Permissionless distributions let any payer submit a valid claim for a recipient, while `Recipient` and `Permissioned` modes restrict who may submit it.

### Does MPL-Distro support vesting?

No. MPL-Distro releases each Merkle allocation in one claim; use [Genesis project vesting](/smart-contracts/genesis/project-vesting) for schedule-based project allocations.

## Glossary

MPL-Distro uses Merkle proofs and deterministic accounts to verify and record token allocations.

| Term | Definition |
|---|---|
| Distribution | Program account containing the token mint, Merkle root, time window, authority, and claim totals |
| Distribution authority | The wallet that can update configuration, deposit tokens, and recover unclaimed funds |
| Merkle tree | Off-chain structure that produces the on-chain root and one proof per allocation |
| Merkle root | A 32-byte commitment to the complete off-chain allocation list |
| Merkle proof | Sibling hashes that prove one allocation belongs to the committed tree |
| Claim receipt | [PDA](/solana/understanding-pdas) proving one `(distribution, recipient, amount, nonce)` allocation was claimed |
| Nonce | A number that distinguishes otherwise identical recipient and amount leaves |
| Token base units | Smallest mint denomination; a 6-decimal token uses `1_000_000` units per 1.0 token |
| Receipt subsidy | Optional SOL held by the distribution PDA to reimburse claim-receipt rent |
