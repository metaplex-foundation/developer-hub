---
title: FAQ
metaTitle: Core - FAQ
description: Frequently asked questions about Core
---

## Why does the Core account have both on-chain and off-chain data?

The Core contains on-chain data, yet it also has a `URI` attribute which points to an off-chain JSON file which provides additional data. So why is that? Can't we just store everything on-chain? Well, there are several issues with that:

- We have to pay rent to store data on-chain. If we had to store everything within the Metadata account, which may include long texts such as the description of an asset, it would require a lot more bytes and minting an asset would suddenly be a lot more expensive.
- On-chain data is much less flexible. Once an account is created using a certain structure, it cannot easily be changed. Therefore, if we had to store everything on-chain, the standard would be a lot harder to evolve with the demands of the ecosystem.

Therefore, splitting the data into on-chain and off-chain data allows us to get the best of both worlds where on-chain data can be used by the program **to create guarantees and expectations for its users** whereas off-chain data can be used **to provide standardized yet flexible information**.

## Are there any costs to using Core?

Token Metadata currently charges very small fee of 0.0015 SOL per Asset mint to the caller. More details can be found on the [Protocol Fees](/protocol-fees) page.

## How to create a Soulbound Asset?

The Core Standard allows you to create Soulbound Assets. To achieve this you should use the [PermanentFreeze](/core/plugins/permanent-freeze) plugin like this.

## How to set an Asset to be Immutable?

*coming soon*