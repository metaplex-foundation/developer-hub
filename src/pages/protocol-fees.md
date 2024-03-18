---
title: Protocol Fees
metaTitle: Metaplex — Protocol Fees
description: A details of the on-chain fees for Metaplex's products.
---

The Metaplex Foundation currently charges the following protocol fees, which are based on community feedback:

| Instruction     | Program         | Typical Payer | Amount (SOL) | Notes                                                                                                                                                                                                                                                                                    |
| --------------- | --------------- | ------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create          | Token Metadata  | Collector     | 0.01         | The minter for most NFTs created on Solana are the individual collectors minting from new drops. Creators that mint many NFTs may consider using compression for radically lower mint costs. (Includes all instructions that "create" an NFT including ones that create print editions.) |
| Combine         | Fusion (Trifle) | Collector     | 0.002        |                                                                                                                                                                                                                                                                                          |
| Split           | Fusion (Trifle) | Collector     | 0.002        |                                                                                                                                                                                                                                                                                          |
| Edit constraint | Fusion (Trifle) | Creator       | 0.01         |                                                                                                                                                                                                                                                                                          |

## FAQs

### Will the fee amounts change over time?

We are constantly monitoring community feedback related to the fees and may change the fee amounts over time. Our goal is for fees to be minimally disruptive and promote the growth and usage of the protocol.

### How much will it cost me, as a creator, in Token Metadata fees to launch a 10k NFT collection through Candy Machine?

Creators will incur 0 SOL in Token Metadata fees for a standard 10k NFT drop since the Create fees are spread amongst the collectors who are minting from the Candy Machine.

### Do the freeze and thaw fees impact pNFT transfers?

No.
