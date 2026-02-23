---
title: Merkle Tree Canopy
metaTitle: Merkle Tree Canopy - Bubblegum V2 - Metaplex
description: Learn how the merkle tree canopy reduces proof sizes and enables composability for compressed NFTs in Bubblegum V2. Covers canopy depth, cost tradeoffs, and transaction size.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - canopy
  - merkle proof
  - proof path
  - transaction size
  - canopy depth
  - composability
about:
  - Merkle trees
  - Transaction optimization
  - Compressed NFTs
proficiencyLevel: Advanced
---

## Summary

**The Merkle Tree Canopy** caches the upper nodes of the merkle tree on-chain, reducing the proof data that must be sent in transactions. This page covers how the canopy works, its cost implications, and the tradeoff between composability and storage cost.

- The canopy stores the top n levels of the tree, reducing proof sizes from d to d-n nodes
- Larger canopies enable better composability with other Solana programs in the same transaction
- Canopy size is fixed at tree creation and cannot be changed afterward
- The formula for additional bytes needed is (2^(n+1) - 1) * 32

## Introduction

Solana's networking stack uses an MTU size of 1280 bytes which, after accounting for headers, leaves 1232 bytes for data.  The effect of this on compressed NFTs (cNFTs) is that it would currently be impossible to modify a Merkle tree of depth greater than 24, as the required proofs would take up too much transaction size.

To circumvent these proof size restrictions, spl-account-compression provides the ability to cache the upper most nodes of the Merkle tree. This is called the **Canopy**, and is stored at the end of the concurrent Merkle tree account.

By caching the upper *n* levels of a depth *d* tree, proofs can be truncated to the first *d - n* nodes. This helps reduce the size of account compression transactions, and makes it possible to modify trees up to depth 31, which can store more than 1 billion cNFTs.

To initialize a canopy on a Merkle tree account, you must initialize the account with additional bytes. The number of additional bytes needed is (2*ⁿ*⁺¹ - 1) * 32, where *n* is the number of levels of the Merkle tree you want the canopy to cache.

The canopy will be updated everytime the concurrent merkle tree is modified.  No additional work is needed.  Note however that you cannot change the canopy size after the tree is created.

## Composability vs. Cost Savings

The table below was generated with help from [compressed.app](https://compressed.app/), and shows how the total cost of minting 1,000,000 cNFTs can vary widely depending on canopy size.

### Cost for 1,000,000 cNFTs with various Canopy depth
*A Merkle tree of depth 20 can store 1,048,576 cNFTs.*
| Canopy Depth     | Proof Bytes   | Storage Cost | Mint cost (3 mint/tx w/ LUT) | Total cost |
| ---------------- | ------------- | ------------ | -----------------------------| ---------- |
| 0                | 640           | 0.3091       | 1.6667                       | 1.9758     |
| 14               | 192           | 7.6067       | 1.6667                       | 9.2734     |
| 17               | 96            | 58.6933      | 1.6667                       | 60.36      |

The reason to have a canopy depth of zero is to have the cheapest mint possible.  However, this requires sending lots of proof data with instructions such as `transfer`, `delegate`, and `burn`.  In the zero-depth canopy case, slighty more than half of the transaction size limit is consumed with proof data, which negatively affects the ability to compose Bubblegum instructions with other program instructions.

Ultimately, the decision for canopy size must consider the tradeoff between cost and composability.  This assessment should take into account factors such as the intended use of the cNFTs, the development platform's compatibility, and the ownership structure of the tree.


## Notes

- A canopy depth of 0 is the cheapest option but uses the most transaction space for proofs, limiting composability.
- The canopy is automatically updated whenever the tree is modified — no additional work is required.
- You cannot change the canopy size after tree creation. Plan your canopy depth based on expected transaction composition needs.
- For trees deeper than 24, a canopy is required because full proofs would exceed Solana's 1232-byte transaction limit.

## Glossary

| Term | Definition |
|------|------------|
| **Canopy** | Cached upper nodes of the merkle tree stored on-chain to reduce proof sizes in transactions |
| **Canopy Depth** | The number of upper tree levels cached in the canopy |
| **Proof Bytes** | The number of bytes consumed by merkle proofs in a transaction (32 bytes per proof node) |
| **Composability** | The ability to include other program instructions alongside Bubblegum operations in a single transaction |
| **MTU** | Maximum Transmission Unit — Solana uses 1280 bytes, leaving 1232 bytes for transaction data |
