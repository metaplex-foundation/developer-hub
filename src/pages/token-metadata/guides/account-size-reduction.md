---
title: FAQ - Token Metadata Account Size Reduction
metaTitle: Token Metadata Account Size Reduction | Token Metadata Guides
description: Learn about the impacts of the TM Account Size reduction.
---

On 10th of October 2024 a Metaplex Token Metadata program change was deployed to mainnet that reduces the size of all new metadata accounts created. Subsequently on October 25th, Metaplex introduced a new Resize instruction that enables existing metadata accounts to be resized. If your product fetches any metadata from TM, this change might affect you. Make sure to read below and implement any necessary changes so things don't break!

## What does it mean to "resize" an asset?

Resizing an NFT enables the release of excess SOL not previously accessible without fully closing (aka burning) the Token Metadata (TM) accounts.

Resize does not impact your NFT's functionality, they are simply optimized to free up space on the Solana network. Users will receive the excess SOL from EACH NFT that they Resize.

However, as stated in the Developer FAQ, programs using SDK versions dating back to August and October 2023 will need to update to handle the smaller Token Metadata accounts.

## How many NFTs are eligible to be resized and how much SOL can I claim?

There are 23.2M eligible NFTs that are eligible to be resized (as of March 4th). 0.0023 excess SOL can be claimed per Master Edition and 0.0019 excess SOL can be claimed per Edition.

## Why should I Resize?

The update reduces metadata account sizes, lowering the data storage cost, while making Solana lighter & more cost-efficient.

There is ~15GB of state taken up with unused Token Metadata buffer space, which is an added tax on those who maintain and power the network. This optimization is an important step in benefitting every Solana user and the validator infrastructure the network depends on.

## Where can I resize my NFT?

You can use our free UI at [resize.metaplex.com](https://resize.metaplex.com) to resize your eligible assets between now and April 25th, 2025.

Community builders such as [SolRip](https://solrip.io/) (free to use) and [Sol Incinerator](https://sol-incinerator.com/) (fee of 5% of the Resize amount) have created alternative tools to process the Resize instruction.

## If I Resize my NFT now, can I still burn the NFT later and claim the excess SOL?

Yes, Resizing the NFT now and burning the NFT later would enable NFT holders to receive the same amount of SOL as if they closed all of the Token Metadata accounts today.

## Why does the Resize window have an end date? Why will the remaining excess SOL no longer needed for rent be transferred to the Metaplex DAO?

The goal of the Resize initiative is to get as many people to participate which will then improve performance of the Solana network.

In order to do this, we've allowed NFT holders to optimize the network directly by adding a Resize instruction which enables the release of excess SOL not previously accessible without fully closing (aka burning) the Token Metadata accounts.

After that point any remaining SOL will be contributed to the Metaplex DAO which is responsible for stewarding the Protocol, at which point the DAO can vote to airdrop the SOL, distribute grants to ecosystem builders, or other initiatives.

## Developer FAQ

### Who is affected by the change?

Every Program and Tool that is based on our Rust SDK and deserializes Data from the TM Accounts and is using very old SDK Versions might be affected.

### How much is the Size reduced?

The Account sizes are reduced as you can see in the table below.

| Account           | Size (bytes) | New Size (bytes) |
| ----------------- | ------------ | ---------------- |
| Metadata          | 679          | 607              |
| Master Edition v1 | 282          | 20               |
| Master Edition v2 | 282          | 20               |
| Edition           | 241          | 42               |

### Which SDK Versions are affected?

* **Javascript**: The JS SDKs (both @metaplex-foundation/js and Umi-based SDKs) are not affected
* **Rust**: The Rust SDK became compatible over a Year ago starting with v2.0.0 (Available since August 2023)
* **Anchor**: Anchor 0.29 and above is compatible to the new sizes (Available since October 2023)

### How to make your Program compatible?

If you are using an older SDK Version than listed above and deserializing Token Metadata Data it is recommended to update the used Packages to ensure compatibility.

### Where can I find Help and more Information?

In case something is unclear after reading this FAQ please feel free to join our [Discord](https://discord.gg/metaplex) and drop your questions!
