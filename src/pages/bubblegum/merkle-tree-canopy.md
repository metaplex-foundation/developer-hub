---
title: Merkle Tree Canopy
metaTitle: Bubblegum - Merkle Tree Canopy
description: Learn more about the Merkle Tree Canopy on Bubblegum
---

Solana's networking stack uses an MTU size of 1280 bytes which, after accounting for headers, leaves 1232 bytes for data.  The result of this for compressed NFTs (cNFTs) is that it would currently be impossible to modify a Merkle tree of depth greater than 24, as the required proofs would take up too much transaction size.

To circumvent these proof size restrictions, spl-account-compression provides the ability to cache the upper most nodes of the Merkle tree. This is called the **Canopy**, and is stored at the end of the concurrent Merkle tree account.

By caching the upper `N` levels of a depth `D` tree, proofs can be truncated to the first `D - N` nodes. This helps reduce the size of account compression transactions, and makes it possible to modify trees up to depth 31, which can store more than 1 billion cNFTs.

To initialize a canopy on a Merkle tree account, you must initialize the account with additional bytes. The number of additional bytes needed is `(pow(2, N+1)-1) * 32`, where `N` is the number of levels of the Merkle tree you want the canopy to cache.

The canopy will be updated everytime the concurrent merkle tree is modified.  No additional work is needed.
