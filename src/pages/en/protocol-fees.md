---
title: Protocol Fees
metaTitle: Protocol Fees | Developer Hub
description: Details of the onchain fees for Metaplex's products.
---

The Metaplex Protocol currently includes the following fees:

## Token Launches

Protocol fees for launching specific types of onchain assets.

### Memecoins

{% protocol-fees program="tokens" showTitle=false config="memecoins" /%}

### Project Tokens

{% protocol-fees program="tokens" showTitle=false config="projectTokens" /%}

## Genesis

Token launch platform fees for different operations.

### Launch Pool
{% protocol-fees program="genesis" showTitle=false config="launchPool" /%}

### Presale
{% protocol-fees program="genesis" showTitle=false config="presale" /%}

## Core

Paid by the minter, which is typically individual collectors minting new drops. Includes all instructions that "create" an NFT including ones that create print editions.

{% protocol-fees program="core" showTitle=false /%}

## Bubblegum v2

Compressed NFTs with improved features and flexibility.

{% protocol-fees program="bubblegum-v2" showTitle=false /%}

## Token Metadata

Paid by the minter, which is typically individual collectors minting new drops. Alternatively creators may consider using Core (next gen NFTs) for maximum composability and lower mint costs, or Bubblegum (compressed NFTs).

{% protocol-fees program="token-metadata" showTitle=false /%}

## Bubblegum v1 (Legacy)

The original compressed NFT program.

{% protocol-fees program="bubblegum" showTitle=false /%}

## MPL-Hybrid

Paid by the individual who swaps tokens and NFTs.

{% protocol-fees program="mpl-hybrid" showTitle=false /%}

## Fusion (Trifle)

Composable NFT fees for combine, split, and constraint editing operations.

{% protocol-fees program="fusion" showTitle=false /%}

## FAQs

### Will the fee amounts change over time?

The Metaplex Foundation is constantly monitoring community feedback related to the fees and may change the fee amounts over time. Our goal is for fees to be minimally disruptive and promote the growth and usage of the protocol.

### How are Metaplex Protocol Fees Used?

All protocol fees are used to further the objectives of the Metaplex Foundation, which is a non-profit organization established to foster the research, development and adoption of the Metaplex ecosystem. This includes providing incentives and assistance to the Metaplex community for the continued development, security, governance, and administration of the Metaplex Protocol and Metaplex DAO.

Currently, 50% of protocol fees are converted to $MPLX and contributed to the Metaplex DAO treasury. The remaining 50% are reserved by the Metaplex Foundation to support the long-term sustainable development of the Metaplex ecosystem.
