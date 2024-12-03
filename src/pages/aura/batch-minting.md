---
title: Batch Minting
metaTitle: Batch Minting | Aura
description: Learn how Batch Minting works.
---

Aura will allow a feature called **Batch Minting** which till take Bubblegum minting data and allow the user to mint cNFT Digtal Assets in minimal transactions.

Minting digital assets accounts for more than 90% of all operations related to asset creation. To optimize this process and reduce transaction costs, Aura introduces an efficient solution through network extension. This extension to the Bubblegum program allows users to create and manage Merkle trees offline before finalizing them on-chain, enabling developers to generate entire trees with only a few transactions. This reduces the network load on Solana and lowers the costs associated with asset creation.

The key optimization lies in creating an entire tree of digital assets in fewer transactions by handling them off-chain and finalizing them on-chain.

## Spam Prevention

With the increased efficiency of batch minting, there's a risk of enabling spam asset creation. To address this, Aura introduces a delegated $MPLX staking model to deter misuse and encourage responsible asset generation.

Creators who engage in batch minting must stake $MPLX tokens to ensure accountability. In cases of abuse, the community can raise a claim through DAO arbitration, leading to penalties such as the removal of offending assets from the DAS index, denylisting, temporary restrictions on token withdrawals, or even token slashing for repeated violations. This approach safeguards the integrity of the system while maintaining the efficiency and accessibility of Bubblegum's user interface.

Additionally, the system discourages spam by imposing a protocol fee on batch minting operations. This fee helps offset the strain caused by low-value assets, which can burden indexers and RPC providers who bear the costs of maintaining and indexing data with little demand. The fee serves to balance these externalities, ensuring that resources are used effectively and providing rewards for legitimate activity.

## How does it work

Let's start by reviewing the structure of a tree data account:

| **Header**                                        | **Tree body**                                   | **Canopy**                                       |
|-------------------------------------------------- |-------------------------------------------------|--------------------------------------------------|
| 56 bytes                                          | Depends on the tree depth and buffer size       | (2ⁿ⁺¹ - 2) * 32 bytes                            |

**Note**: n is the depth of the canopy.

The asset creation process begins by preparing an empty Bubblegum tree, which is then populated off-chain and serialized into a JSON file for indexing. If the target tree includes a canopy for better composability, each canopy-leaf is initialized in batches, with up to 24 canopy-leafs set per operation.

Finalizing the batch mint is completed through a transaction initiated by an Aura node or another participant with the necessary stake. The Solana blockchain processes the transaction, while Aura nodes verify the file’s hash and, optionally, the Merkle root due to its computational demands.

To incentivize nodes for processing batch operations and indexing asset data, an additional fee of 0.00256 SOL will be applied for every 1,024 assets created.

## Development Progress

The developement of batch minting can be found in our github repo here [https://github.com/metaplex-foundation/bubblegum-batch-sdk](https://github.com/metaplex-foundation/bubblegum-batch-sdk) and within our Aura repo [https://github.com/metaplex-foundation/aura/](ttps://github.com/metaplex-foundation/aura/)

