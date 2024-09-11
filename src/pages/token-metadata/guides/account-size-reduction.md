---
title: FAQ - Token Metadata Account Size Reduction
metaTitle: Token Metadata Account Size Reduction | Token Metadata Guides
description: Learn about the impacts of the TM Account Size reduction
---

On 9th of September 2024 a Metaplex Token Metadata program change was deployed to devnet that reduces the size of all future metadata accounts created. If your product fetches any metadata from TM, this change might affect you. Make sure to read below and implement any necessary changes so things don't break!


## What is the reason for this update?
The update reduces new metadata account sizes, lowering the data storage cost, while making Solana lighter & more cost-efficient.

## How much is the Size reduced?
The Account sizes are reduced as you can see in the table below.

|Account           | Size (bytes) | New Size (bytes)|
|------------------|--------------|-----------------|
|Metadata          | 679          | 607             |
|Master Edition v1 | 282          | 20              |
|Master Edition v2 | 282          | 20              |
|Edition           | 241          | 42              |

## Who is affected by the Change?
Every Program and Tool that is based on our Rust SDK and deserializes Data from the TM Accounts and is using very old SDK Versions might be affected.

## Which SDK Versions are affected?
- **Javascript**: The JS SDKs (both @metaplex-foundation/js and Umi-based SDKs) are not affected
- **Rust**: The Rust SDK became compatible over a Year ago starting with v2.0.0 (Available since August 2023)
- **Anchor**: Anchor 0.29 and above is compatible to the new sizes (Available since October 2023)

## How to make your Program compatible?
If you are using an older SDK Version than listed above and deserializing Token Metadata Data it is recommended to update the used Packages to ensure compatability.

## Where can I find Help and more Information?
In case something is unclear after reading this FAQ please feel free to join our [Discord](https://discord.gg/metaplex) and drop your questions!