---
title: Core Candy Machine - NFT Minting & Distribution on Solana
metaTitle: Core Candy Machine — NFT Minting & Fair Launch Distribution | Metaplex
description: Core Candy Machine is the Metaplex program for minting and distributing Core Assets on Solana. Configure guards, insert items, and launch NFT collections with customizable mint rules.
created: '06-01-2024'
updated: '03-10-2026'
keywords:
  - core candy machine
  - candy machine
  - NFT minting
  - NFT launch
  - Solana NFT
  - Core Assets
  - minting program
  - candy guard
  - NFT distribution
  - fair mint
  - collection launch
  - Metaplex Core
  - SPL token payment
  - bot protection
  - mint guards
about:
  - Core Candy Machine minting program
  - NFT collection launches on Solana
  - Candy Guard access control
proficiencyLevel: Beginner
faqs:
  - q: What is the difference between Core Candy Machine and Candy Machine V3?
    a: Core Candy Machine mints Metaplex Core Assets, which use a single-account model with lower costs and built-in plugins. Candy Machine V3 mints legacy Token Metadata NFTs that require multiple accounts per token. New projects should use Core Candy Machine.
  - q: How much does it cost to create a Core Candy Machine?
    a: Creating a Core Candy Machine requires rent for the on-chain account, which varies by the number of items loaded. Minting costs depend on which guards are enabled — for example, a Sol Payment guard charges a creator-defined SOL amount per mint. Solana transaction fees also apply.
  - q: Can I use multiple guards at the same time on a Core Candy Machine?
    a: Yes. Guards are composable — you can enable any combination of the 23+ default guards simultaneously. For example, combine Sol Payment, Start Date, Mint Limit, and Bot Tax to create a time-gated, rate-limited, bot-protected paid mint.
  - q: What happens to a Core Candy Machine after all items are minted?
    a: After all items are minted the Candy Machine can be deleted (withdrawn) to reclaim the on-chain rent. The minted Core Assets remain on-chain and are unaffected by the deletion.
  - q: Do I need a separate Candy Guard account?
    a: In practice, yes. The Candy Guard account is what enforces mint rules (payment, timing, allowlists, bot protection). Without it, anyone can mint for free at any time. Creating a Candy Guard and setting it as the mint authority is the standard workflow.
---

The Metaplex Protocol **Core Candy Machine** is the leading minting and distribution program for fair NFT collection launches on Solana. Built for the [Metaplex Core](/smart-contracts/core) asset standard, Core Candy Machine acts as a temporary on-chain vending machine that creators load with items and buyers mint from. It allows creators to bring their digital assets on-chain in a secure and customizable way. {% .lead %}

- Mint [Core Assets](/smart-contracts/core/what-is-an-asset) with a single-account model -- lower cost and simpler than legacy Token Metadata NFTs
- Customize the mint process with [23+ composable guards](/smart-contracts/core-candy-machine/guards) for payments, timing, allowlists, and bot protection
- Manage the full lifecycle: [create](/smart-contracts/core-candy-machine/create), [insert items](/smart-contracts/core-candy-machine/insert-items), [mint](/smart-contracts/core-candy-machine/mint), and [withdraw](/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)
- Supports payments in SOL, SPL tokens, or NFTs via guard configuration

The name refers to the vending machines that dispense candy for coins via a mechanical crank. In this case the candy are NFTs and the payment is SOL or a SPL token.

{% quick-links %}
{% quick-link title="Getting Started" icon="InboxArrowDown" href="/smart-contracts/core-candy-machine/sdk" description="Find the language or library of your choice and get started with Candy Machines." /%}

{% quick-link title="CLI Commands" icon="CommandLine" href="/dev-tools/cli/cm" description="Create and manage candy machines using the Metaplex CLI with interactive wizard." /%}

{% quick-link title="API reference" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" target="_blank" description="Check out the Javascript API docs." /%}

{% quick-link title="API reference" icon="Rust" href="https://docs.rs/mpl-core-candy-machine-core/" target="_blank" description="Check out the Rust API docs." /%}
{% /quick-links %}

{% callout %}
This documentation refers to the latest iteration of Candy Machine known as Core Candy Machine. It allows minting [Core](/smart-contracts/core) Assets. If you want to mint Metaplex Token Metadata NFTs [please refer to Candy Machine V3 instead](/smart-contracts/candy-machine).
{% /callout %}

## Core Candy Machine Lifecycle

Core Candy Machine follows a four-stage lifecycle: create, load, mint, and withdraw. Creators configure settings and insert item metadata up front, then buyers mint Core Assets on demand. Once all items are minted, the creator can delete the machine to reclaim rent.

1. **[Create and configure](/smart-contracts/core-candy-machine/create)** the Candy Machine with collection-level settings
2. **[Insert items](/smart-contracts/core-candy-machine/insert-items)** by providing a name and metadata URI for each asset
3. **[Mint](/smart-contracts/core-candy-machine/mint)** -- buyers trigger on-demand Core Asset creation, subject to guard rules
4. **[Withdraw](/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)** the Candy Machine after the launch to reclaim on-chain rent

No Core Assets exist on-chain until a buyer mints. The Candy Machine stores only the metadata references needed to create each asset at mint time.

## Candy Guards and Mint Customization

[Candy Guards](/smart-contracts/core-candy-machine/guards) are modular access-control rules that protect and customize the minting process. The Core Candy Guard program ships with over 23 default guards that creators enable and configure independently.

Each guard handles a single responsibility, making them composable. Common guard combinations include:

- **[Sol Payment](/smart-contracts/core-candy-machine/guards/sol-payment)** -- charge a configured SOL amount per mint
- **[Start Date](/smart-contracts/core-candy-machine/guards/start-date)** / **[End Date](/smart-contracts/core-candy-machine/guards/end-date)** -- restrict minting to a time window
- **[Mint Limit](/smart-contracts/core-candy-machine/guards/mint-limit)** -- cap the number of mints per wallet
- **[Bot Tax](/smart-contracts/core-candy-machine/guards/bot-tax)** -- charge a penalty when a mint fails guard validation
- **[Allow List](/smart-contracts/core-candy-machine/guards/allow-list)** -- restrict minting to a predefined set of wallets
- **[Token Gate](/smart-contracts/core-candy-machine/guards/token-gate)** / **[NFT Gate](/smart-contracts/core-candy-machine/guards/nft-gate)** -- restrict minting to holders of a specific token or NFT

Guards are assigned via a separate [Candy Guard account](/smart-contracts/core-candy-machine/guards) that becomes the mint authority of the Candy Machine. Advanced developers can fork the Candy Guard program to build custom guards while still relying on the core minting program. Creators can also define [guard groups](/smart-contracts/core-candy-machine/guard-groups) to offer different mint conditions to different audiences (for example, an allowlist phase followed by a public sale).

## Quick Reference

| Item | Value |
|------|-------|
| Core Candy Machine Program | `CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J` |
| Core Candy Guard Program | `CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ` |
| JS SDK | `@metaplex-foundation/mpl-core-candy-machine` |
| Rust Crate | `mpl-core-candy-machine-core` |
| Source | [GitHub](https://github.com/metaplex-foundation/mpl-core-candy-machine) |
| JS TypeDoc | [mpl-core-candy-machine.typedoc.metaplex.com](https://mpl-core-candy-machine.typedoc.metaplex.com/) |
| Rust Docs | [docs.rs/mpl-core-candy-machine-core](https://docs.rs/mpl-core-candy-machine-core/) |
| Default Guards | 23+ composable guards |

## Notes

- Core Candy Machine mints [Metaplex Core](/smart-contracts/core) Assets only. To mint legacy Token Metadata NFTs, use [Candy Machine V3](/smart-contracts/candy-machine).
- A Candy Guard account is required in practice to enforce any mint restrictions. Without one, the Candy Machine allows unrestricted free minting.
- Items must be inserted before minting can begin. Each item requires a `name` and a `uri` pointing to pre-uploaded JSON metadata.
- After all items are minted, withdraw the Candy Machine to reclaim on-chain rent. Minted assets are not affected.
- The Candy Guard program is a separate on-chain program from the Core Candy Machine program. Both must be referenced when building transactions.
- For bot protection best practices, see [Anti-Bot Protection Best Practices](/smart-contracts/core-candy-machine/anti-bot-protection-best-practices).


## FAQ

### What is the difference between Core Candy Machine and Candy Machine V3?
Core Candy Machine mints [Metaplex Core](/smart-contracts/core) Assets, which use a single-account model with lower costs and built-in plugins. [Candy Machine V3](/smart-contracts/candy-machine) mints legacy Token Metadata NFTs that require multiple accounts per token. New projects should use Core Candy Machine.

### How much does it cost to create a Core Candy Machine?
Creating a Core Candy Machine requires rent for the on-chain account, which varies by the number of items loaded. Minting costs depend on which [guards](/smart-contracts/core-candy-machine/guards) are enabled -- for example, a [Sol Payment](/smart-contracts/core-candy-machine/guards/sol-payment) guard charges a creator-defined SOL amount per mint. Solana transaction fees also apply.

### Can multiple guards be enabled at the same time on a Core Candy Machine?
Yes. Guards are composable -- you can enable any combination of the 23+ default guards simultaneously. For example, combine Sol Payment, Start Date, Mint Limit, and Bot Tax to create a time-gated, rate-limited, bot-protected paid mint.

### What happens to a Core Candy Machine after all items are minted?
After all items are minted the Candy Machine can be [deleted (withdrawn)](/smart-contracts/core-candy-machine/withdrawing-a-candy-machine) to reclaim the on-chain rent. The minted Core Assets remain on-chain and are unaffected by the deletion.

### Do Core Candy Machines need a separate Candy Guard account?
In practice, yes. The [Candy Guard](/smart-contracts/core-candy-machine/guards) account is what enforces mint rules (payment, timing, allowlists, bot protection). Without it, anyone can mint for free at any time. Creating a Candy Guard and setting it as the mint authority is the standard workflow.

### Can developers create custom guards?
Yes. The Candy Guard program is designed to be forked. Developers can write custom guard logic while relying on the main Core Candy Machine program for minting. The default set of 23+ guards covers most use cases, but custom guards allow for project-specific requirements.

## Glossary

| Term | Definition |
|------|------------|
| **Core Candy Machine** | The on-chain Metaplex program that stores item metadata and mints Core Assets on demand |
| **Candy Guard** | A separate on-chain program that wraps the Candy Machine with composable access-control rules (guards) |
| **Guard** | A single modular rule that restricts or modifies the minting process (e.g., payment, timing, allowlist) |
| **Guard Group** | A named set of guard configurations that applies different mint conditions to different audiences |
| **Item** | A name and metadata URI pair loaded into the Candy Machine before minting |
| **Core Asset** | A Metaplex Core NFT -- a single-account digital asset with built-in plugin support |
| **Mint Authority** | The account authorized to trigger minting; typically set to the Candy Guard account |
| **Collection** | The on-chain collection address assigned to all assets minted from the Candy Machine |

## Next Steps

1. **[SDK Setup](/smart-contracts/core-candy-machine/sdk)** -- choose JavaScript or Rust and install the SDK
2. **[Create a Core Candy Machine](/smart-contracts/core-candy-machine/create)** -- configure settings and deploy
3. **[Insert Items](/smart-contracts/core-candy-machine/insert-items)** -- load asset metadata into the machine
4. **[Configure Guards](/smart-contracts/core-candy-machine/guards)** -- set up payment, timing, and access rules
5. **[Mint Core Assets](/smart-contracts/core-candy-machine/mint)** -- understand the minting flow
