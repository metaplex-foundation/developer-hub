---
title: FAQ - Token Metadata Account Size Reduction
metaTitle: Token Metadata Account Size Reduction | Token Metadata Guides
description: Learn about the impacts of the TM Account Size reduction.
---

On 9th of September 2024 a Metaplex Token Metadata program change was deployed to devnet that reduces the size of all future metadata accounts created. If your product fetches any metadata from TM, this change might affect you. Make sure to read below and implement any necessary changes so things don't break!

## What is the reason for this update?

The update reduces new metadata account sizes, lowering the data storage cost, while making Solana lighter & more cost-efficient.

## Why is this important?

There is ~15GB of state taken up with unused Token Metadata buffer space, which is an added tax on those who maintain and power the network. This optimization is an important step in benefitting every Solana user and the validator infrastructure the network depends on.

## How much is the Size reduced?

The Account sizes are reduced as you can see in the table below.

| Account           | Size (bytes) | New Size (bytes) |
| ----------------- | ------------ | ---------------- |
| Metadata          | 679          | 607              |
| Master Edition v1 | 282          | 20               |
| Master Edition v2 | 282          | 20               |
| Edition           | 241          | 42               |

## How many Token Metadata accounts are eligible to be resized and how much SOL can I claim?

There are 25.7M eligible Token Metadata NFTs with Token Metadata accounts that are eligible to be resized (as of October 30th). 0.0023 excess SOL can be claimed per Master Edition and 0.0019 excess SOL can be claimed per Edition.

## Where can I resize my NFT?

You can use our free UI at [resize.metaplex.com](https://resize.metaplex.com) to resize your eligible assets between now and April 25, 2025.

Alternative tools exist that offer a paid service for processing the Resize instruction, such as [Sol Incinerator](https://sol-incinerator.com/) (5% of the resize amount).

## If I resize my NFT now, can I still burn the NFT later and claim the remaining rent?

Yes, resizing the NFT now and burning the NFT later would enable NFT holders to receive the same amount of SOL as if they closed all of the Token Metadata accounts today.

## What happens to my NFT if I resize?

Resize does not impact your NFT’s functionality. TM accounts associated with your NFT will be optimized to free up space on the Solana network. You will receive the excess SOL from the optimization. However, as stated below, programs
using exceedingly old SDK versions will need to update to handle the smaller Token Metadata accounts.

## Who is affected by the Change?

Every Program and Tool that is based on our Rust SDK and deserializes Data from the TM Accounts and is using very old SDK Versions might be affected.

## Which SDK Versions are affected?

- **Javascript**: The JS SDKs (both @metaplex-foundation/js and Umi-based SDKs) are not affected
- **Rust**: The Rust SDK became compatible over a Year ago starting with v2.0.0 (Available since August 2023)
- **Anchor**: Anchor 0.29 and above is compatible to the new sizes (Available since October 2023)

## How to make your Program compatible?

If you are using an older SDK Version than listed above and deserializing Token Metadata Data it is recommended to update the used Packages to ensure compatibility.

## Where can I find Help and more Information?

In case something is unclear after reading this FAQ please feel free to join our [Discord](https://discord.gg/metaplex) and drop your questions!
