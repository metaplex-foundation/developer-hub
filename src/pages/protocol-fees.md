---
title: Protocol Fees
metaTitle: Metaplex — Protocol Fees
description: A details of the on-chain fees for Metaplex's products.
---

The Metaplex Protocol currently includes the following fees:

| Instruction     | Program         | Typical Payer | Amount (SOL) | Notes                                                                                                                                                                                                                                                                                    |
| --------------- | --------------- | ------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create          | Token Metadata  | Collector     | 0.01         | Paid by the minter, which is typically individual collectors minting new drops. Creators that mint many NFTs may consider using Bubblegum (compressed NFTs) for radically lower mint costs. Includes all instructions that "create" an NFT including ones that create print editions. |
| Create          | Bubblegum       | -             | Free |
| Combine         | Fusion (Trifle) | Collector     | 0.002        |                                                                                                                                                                                                                                                                                          |
| Split           | Fusion (Trifle) | Collector     | 0.002        |                                                                                                                                                                                                                                                                                          |
| Edit constraint | Fusion (Trifle) | Creator       | 0.01         |                                                                                                                                                                                                                                                                                          |

## FAQs

### Will the fee amounts change over time?

The Metaplex Foundation is constantly monitoring community feedback related to the fees and may change the fee amounts over time. Our goal is for fees to be minimally disruptive and promote the growth and usage of the protocol.

### How much will it cost me, as a creator, in Token Metadata fees to launch a 10k NFT collection through Candy Machine?

Creators will incur 0 SOL in Token Metadata fees for a standard 10k NFT drop since the Create fees are spread amongst the collectors who are minting from the Candy Machine.
