---
title: Overview
metaTitle: Metaplex Core | Next-Gen NFT Standard for Solana
description: Metaplex Core is the next-generation NFT standard on Solana with single-account design, enforced royalties, and a flexible plugin system. Lower costs, lower compute, better performance.
updated: '01-31-2026'
---
Metaplex Core ("Core") is the **next-generation NFT standard** on Solana. It uses a **single-account design** that reduces minting costs by 80%+ compared to alternatives, while providing **enforced royalties**, **collection-level operations**, and a **flexible plugin system** for custom behaviors. {% .lead %}
{% callout title="What You'll Learn" %}
This overview covers:
- What Metaplex Core is and why it exists
- Key advantages over Token Metadata and other standards
- Core concepts: Assets, Collections, and Plugins
- How to get started building with Core
{% /callout %}
## Summary
**Metaplex Core** is a Solana NFT standard that replaces Token Metadata for most new projects. It offers the lowest minting costs, enforced royalties, and a plugin architecture for custom functionality.
- Single-account design: ~0.0029 SOL per mint (vs 0.022 SOL for Token Metadata)
- Enforced royalties by default with allowlist/denylist controls
- Plugin system for staking, attributes, delegates, and custom behaviors
- Collection-level operations: freeze, update royalties, or modify all assets at once
## Out of Scope
This overview does not cover: fungible tokens (use SPL Token), Token Metadata migration paths, or detailed plugin implementation. See specific pages for those topics.
## Quick Start
**Jump to:** [Getting Started](#next-steps) · [Key Advantages](#introduction) · [FAQ](#faq) · [Glossary](#glossary)
1. Install the SDK: `npm install @metaplex-foundation/mpl-core`
2. Create an Asset: [Creating Assets guide](/smart-contracts/core/create-asset)
3. Add plugins: [Plugins overview](/smart-contracts/core/plugins)
4. Query with DAS: [Fetching Assets](/smart-contracts/core/fetch)
{% quick-links %}
{% quick-link title="Getting Started" icon="InboxArrowDown" href="/smart-contracts/core/sdk" description="Find the language or library of your choice and get started with digital assets on Solana." /%}
{% quick-link title="API Reference" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="Looking for something specific? Check our API References." /%}
{% quick-link title="Differences from Token Metadata" icon="AcademicCap" href="/smart-contracts/core/tm-differences" description="Coming from Token Metadata? See what's changed and what's new." /%}
{% quick-link title="Try Core in a UI" icon="Beaker" href="https://core.metaplex.com/" target="_blank" description="Mint a Core Asset yourself using our web interface." /%}
{% /quick-links %}
## Introduction
Metaplex Core is the recommended NFT standard for new projects on Solana. Compared to Token Metadata and other standards, Core provides:
### Cost Efficiency
| Standard | Mint Cost | Compute Units |
|----------|-----------|---------------|
| **Metaplex Core** | ~0.0029 SOL | ~17,000 CU |
| Token Metadata | ~0.022 SOL | ~205,000 CU |
| Token Extensions | ~0.0046 SOL | ~85,000 CU |
### Key Advantages
- **Single Account Design**: Core uses one account per asset instead of multiple (mint + metadata + token account). This reduces costs and simplifies development.
- **Enforced Royalties**: The [Royalties plugin](/smart-contracts/core/plugins/royalties) enforces creator royalties by default with allowlist/denylist controls.
- **Collection-Level Operations**: Update royalties, freeze assets, or modify metadata for an entire collection in a single transaction.
- **Plugin Architecture**: Add custom behaviors to assets via plugins:
  - [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - Allow others to freeze/unfreeze
  - [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) - Allow others to burn
  - [Attributes](/smart-contracts/core/plugins/attribute) - On-chain key/value data (auto-indexed by DAS)
  - [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) - Allow others to transfer
  - And many more in the [Plugins section](/smart-contracts/core/plugins)
- **DAS Indexing**: All major [RPC providers supporting DAS](/rpc-providers) already index Core assets.
## Core Concepts
### Assets
An **Asset** is a single on-chain account representing an NFT. Unlike Token Metadata (which uses 3+ accounts), Core Assets contain ownership, metadata URI, and plugin data in one account.
See: [What is an Asset?](/smart-contracts/core/what-is-an-asset)
### Collections
A **Collection** is a Core account that groups related Assets. Collections can have their own plugins that apply to all member Assets. Collection-level royalties, for example, apply to every Asset in the collection unless overridden.
See: [Collections](/smart-contracts/core/collections)
### Plugins
**Plugins** are modular extensions that add behavior to Assets or Collections. They hook into lifecycle events (create, transfer, burn) to enforce rules or store data.
See: [Plugins Overview](/smart-contracts/core/plugins)
## Quick Reference
### Program IDs
| Program | Address |
|---------|---------|
| MPL Core | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| MPL Core (Devnet) | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
### SDK Packages
| Language | Package |
|----------|---------|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-core` |
| Rust | `mpl-core` |
## Next Steps
1. **Choose your SDK**: Visit [Getting Started](/smart-contracts/core/sdk) to install the JavaScript or Rust SDK
2. **Create your first Asset**: Follow the [Creating Assets](/smart-contracts/core/create-asset) guide
3. **Explore plugins**: See available behaviors in [Plugins](/smart-contracts/core/plugins)
4. **Migrate from Token Metadata**: Review [Differences from Token Metadata](/smart-contracts/core/tm-differences)
{% callout %}
Please note that certain Core instructions require protocol fees. Review the [Protocol Fees](/protocol-fees) page for current information.
{% /callout %}
## FAQ
### What is Metaplex Core?
Metaplex Core is a next-generation NFT standard on Solana that uses a single-account design for lower costs, enforced royalties, and a flexible plugin system. It's the recommended standard for new NFT projects.
### How is Core different from Token Metadata?
Core uses one account per asset (vs 3+ for Token Metadata), costs ~80% less to mint, has lower compute usage, and includes built-in royalty enforcement. Token Metadata is considered legacy for new projects.
### Can I migrate from Token Metadata to Core?
Core Assets and Token Metadata NFTs are separate standards. There's no automatic migration. New projects should use Core; existing Token Metadata collections continue to work.
### Does Core support royalties?
Yes. Core has a [Royalties plugin](/smart-contracts/core/plugins/royalties) that enforces royalties by default. You can set basis points, creator splits, and allowlist/denylist rules for marketplaces.
### What are plugins?
Plugins are modular extensions that add behavior to Core Assets or Collections. Examples include Freeze Delegate (allow freezing), Attributes (on-chain data), and Royalties (creator payments).
### How much does it cost to mint a Core Asset?
Approximately 0.0029 SOL per asset, compared to ~0.022 SOL for Token Metadata. This makes Core ~80% cheaper for minting.
### Which RPC providers support Core?
All major RPC providers supporting DAS (Digital Asset Standard) index Core assets. See [RPC Providers](/rpc-providers) for a current list.
### Can I use Core for gaming assets?
Yes. Core's plugin system makes it ideal for gaming: use Attributes for on-chain stats, Freeze Delegate for locking items, and Transfer Delegate for marketplace integration.
## Glossary
| Term | Definition |
|------|------------|
| **Asset** | A single Core on-chain account representing an NFT with ownership, metadata, and plugins |
| **Collection** | A Core account that groups related Assets and can apply collection-wide plugins |
| **Plugin** | A modular extension that adds behavior to Assets or Collections (royalties, freeze, attributes) |
| **DAS** | Digital Asset Standard - the API specification for querying indexed NFT data |
| **Basis Points** | Royalty percentage in hundredths of a percent (500 = 5%) |
| **Delegate** | An account authorized to perform specific actions on an Asset without owning it |
| **CPI** | Cross-Program Invocation - calling the Core program from another Solana program |
| **URI** | The off-chain metadata URL pointing to a JSON file with name, image, and attributes |
