---
title: Overview
metaTitle: Overview | MPL-Hybrid
description: Provides a high-level overview of the framework and onchain protocol for hybrid assets.
---

**MPL-404** is a new model for digital assets, web3 games, and onchain communities. At the core of the model is a swap program (**mpl-hybrid**) that trades a fixed number of fungible assets for a non-fungible asset and vice versa. The swap is a dual escrow system, ensuring that all available non-fungible assets are backed by escrowed fungibles and vice versa.

{% callout %}
Please note that certain MPL-Hybrid instructions will require protocol fees. Please review the [Protocol Fees](/protocol-fees) page for up-to-date information.
{% /callout %}

## Swapping

The ability to freely move between fungible and non-fungible assets in a predictable way allows this new asset class (often called **hybrids**) to take advantage of the best aspects of both asset types. **Non-fungible assets can now benefit from the liquidity, distribution, and DeFi opportunities** associated with fungible assets. Conversely, fungible assets can now benefit from the improved utility, collectability, and identity that come from the non-fungible world.

## Re-Rolling

the `mpl-hybrid` program includes the option to "re-roll" the asset each time its swapped. For example, every non-fungible asset can have its metadata blanked as it enters the escrow wallet and randomly reassigned (rerolled) as it leaves escrow. The creator has the ability to both manage available traits as well as to charge a small fee during the swap (typically when swapping into an NFT). MPL-Hybrid can add “loot box” gamification to every 404 project and can serve as an alternative source of revenue (e.g. unique limited time traits for an NFT community or randomized in-game rewards). It also offers the ability to craft more dynamic collections that can evolve to better suit the needs of the project and community over time.
