---
title: FAQ
metaTitle: FAQ | Core
description: Frequently asked questions about the Metaplex Core protocol.
---

## Why does the Core Asset and Collection accounts have both onchain and off-chain data?

The Core Asset and Collection accounts both contain onchain data, yet both also include a `URI` attribute that points to an off-chain JSON file which provides additional data. Why is that? Can't we just store everything onchain? Well, there are several issues with storing data onchain:

- Storing data onchain requires paying rent. If we had to store everything within the Asset or Collection account, which may include long texts such as the description of an asset, it would require a lot more bytes and creating an Asset would suddenly be a lot more expensive, since storing more bytes means more rent has to be paid
- onchain data is less flexible. Once an account state is created using a certain byte structure it cannot easily be changed without potentially causing deserialization issues. Therefore, if we had to store everything onchain, the standard would be a lot harder to evolve with the demands of the ecosystem.

Therefore, splitting the data into onchain and off-chain data allows users to get the best of both worlds where onchain data can be used by the program **to create guarantees and expectations for its users** and off-chain data can be used **to provide standardized yet flexible information**. But don't worry, if you want data entirely on chain Metaplex also offers [Inscriptions](/inscription) for this this purpose.

## Are there any costs to using Core?

Core currently charges a very small fee of 0.0015 SOL per Asset mint to the caller. More details can be found on the [Protocol Fees](/protocol-fees) page.

## How to create a Soulbound Asset?

The Core Standard allows you to create Soulbound Assets. To achieve this either the [Permanent Freeze Delegate](/core/plugins/permanent-freeze-delegate) plugin or the [Oracle Plugin](/core/external-plugins/oracle) can be used. 

To learn more check out the [Soulbound Assets Guide](/core/guides/create-soulbound-nft-asset)!

## How to set an Asset to be Immutable?

There are multiple levels of "immutability" in Core. You can find more information and how to implement it in [this guide](/core/guides/immutability).

## What are the differences between Metaplex Token Metadata and Core?

Core is an entirely new standard designed specifically for NFTs, hence there are several notable differences. For example Core is cheaper, requires less Compute Units and should be easier to work with from a developer perspective. Have a look at the [differences](/core/tm-differences) page for details.

## Does Core Support Editions?
Yes! Using the [Edition](/core/plugins/edition) and [Master Edition](/core/plugins/master-edition) Plugins. You can find more information in the ["How to print Editions" Guide](/core/guides/print-editions).