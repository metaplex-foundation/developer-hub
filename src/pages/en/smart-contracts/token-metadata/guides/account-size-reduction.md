---
title: Account Size Reduction
metaTitle: Token Metadata Account Size Reduction | Token Metadata Guides
description: Understand the Token Metadata account size reduction, its impact on existing NFTs, and how to handle resized Metadata accounts in your applications on Solana.
updated: '02-07-2026'
keywords:
  - account size reduction
  - metadata account resize
  - Token Metadata migration
  - account data length
about:
  - account management
  - migration guide
  - backward compatibility
proficiencyLevel: Intermediate
faqs:
  - q: What is the Token Metadata account size reduction?
    a: Token Metadata reduced the size of Metadata accounts to save rent costs. Existing accounts may have a larger size than newly created accounts. Applications should handle both sizes.
  - q: Does this affect existing NFTs?
    a: Existing NFTs continue to work. The size reduction applies when accounts are resized during updates or when new accounts are created.
  - q: Do I need to update my application?
    a: If your application hardcodes Metadata account sizes or uses fixed-offset deserialization, you should update it to handle variable account sizes.
---

On 10th of October 2024, a Metaplex Token Metadata (TM) program change was deployed to mainnet that reduces the size of all new metadata accounts created. Subsequently on October 25th, Metaplex introduced a new Resize instruction that enables existing metadata accounts to be resized. If your product fetches any metadata from TM, this change might affect you.

## What does it mean to "resize" an asset?

Resizing an NFT enables the release of excess SOL not previously accessible without fully closing (aka burning) the Token Metadata (TM) accounts.

Resize does not impact your NFT's functionality, they are simply optimized to free up space on the Solana network.

However, as stated in the Developer FAQ, programs using SDK versions dating back to August and October 2023 will need to update to handle the smaller Token Metadata accounts.

## How many NFT accounts have been resized and how much SOL can I claim?

As of August 15, 2025, all TM NFT metadata accounts have been resized.

Holders of TM NFTs that had not already been resized at the time of the final optimization can claim 100% of the excess SOL attributed to their NFTs’ storage accounts at [resize.metaplex.com](https://resize.metaplex.com). The claimable amounts include: 0.0023 excess SOL per Master Edition and 0.0019 excess SOL per Edition.

## What are the benefits of Resizing?

The update reduces metadata account sizes, lowering the data storage cost, while making Solana lighter & more cost-efficient.

The optimization saved a total of 7,380 MB of Solana network space, resulting in more efficient validator performance that benefits all Solana users and stakers.

It was an important step in benefitting every Solana user and the validator infrastructure the network depends on.

## Where can I claim excess SOL with my NFTs?

You can use our free UI at [resize.metaplex.com](https://resize.metaplex.com) to claim excess SOL attributed to your NFTs’ storage accounts. Per the Metaplex DAO’s approved MTP-004, the deadline to claim excess SOL is extended until at least Feb. 13th, 2027. This extends the total amount of time for NFT holders to claim excess SOL from the optimization to at least 28 months.

## Developer FAQ

### Who is affected by the change?

Every Program and Tool that is based on our Rust SDK and deserializes Data from the TM Accounts and is using very old SDK Versions might be affected. The specific versions can be found [below](#which-sdk-versions-are-affected).

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
