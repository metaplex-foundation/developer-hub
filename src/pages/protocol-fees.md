---
title: Protocol Fees
metaTitle: Metaplex — Protocol Fees
description: A details of the on-chain fees for Metaplex's products.
---

The Metaplex Protocol currently includes the following fees:

| Instruction     | Program         | Typical Payer | Amount (SOL) | Notes                                                                                                                                                                                                                                                                                    |
| --------------- | --------------- | ------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create | Core | Collector | 0.0015 | Paid by the minter, which is typically individual collectors minting new drops. Includes all instructions that "create" an NFT including ones that create print editions. |
| Create          | Token Metadata  | Collector     | 0.01         | Paid by the minter, which is typically individual collectors minting new drops. Alternatively creators may consider using Core (next gen NFTs) for maximum composability and lower mint costs, or Bubblegum (compressed NFTs). Includes all instructions that "create" an NFT including ones that create print editions. |
| Create          | Bubblegum       | -             | Free |
| Swap   | MPL-Hybrid | Collector | 0.005 | Paid by the individual who swaps tokens and NFTs. |
| Combine         | Fusion (Trifle) | Collector     | 0.002        |                                                                                                                                                                                                                                                                                          |
| Split           | Fusion (Trifle) | Collector     | 0.002        |                                                                                                                                                                                                                                                                                          |
| Edit constraint | Fusion (Trifle) | Creator       | 0.01         |                                                                                                                                                                                                                                                                                          |


## FAQs

### Will the fee amounts change over time?

The Metaplex Foundation is constantly monitoring community feedback related to the fees and may change the fee amounts over time. Our goal is for fees to be minimally disruptive and promote the growth and usage of the protocol.

### How much will it cost me, as a creator, in Token Metadata or core fees to launch a 10k NFT collection through Candy Machine?

Creators will incur 0 SOL in Token Metadata or Core fees for a standard 10k NFT drop since the Create fees are spread amongst the collectors who are minting from the Candy Machine.

### How are Metaplex Protocol Fees Used?

All protocol fees are used to further the objectives of the Metaplex Foundation, which is a non-profit organization established to foster the research, development and adoption of the Metaplex ecosystem. This includes providing incentives and assistance to the Metaplex community for the continued development, security, governance, and administration of the Metaplex Protocol and Metaplex DAO.

Currently, 50% of protocol fees are converted to $MPLX and contributed to the Metaplex DAO treasury. The remaining 50% are reserved by the Metaplex Foundation to support the long-term sustainable development of the Metaplex ecosystem.