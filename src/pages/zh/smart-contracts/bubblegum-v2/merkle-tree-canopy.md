---
title: 默克尔树树冠
metaTitle: 默克尔树树冠 - Bubblegum V2
description: 了解更多关于Bubblegum上默克尔树树冠的信息。
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


## 介绍

Solana的网络栈使用1280字节的MTU大小，扣除头部后，剩余1232字节用于数据。这对压缩NFT（cNFT）的影响是，目前不可能修改深度大于24的默克尔树，因为所需的证明会占用太多交易大小。

为了规避这些证明大小限制，spl-account-compression提供了缓存默克尔树最上层节点的能力。这被称为**树冠**，存储在并发默克尔树账户的末尾。

通过缓存深度为*d*的树的上层*n*个级别，证明可以被截断为前*d - n*个节点。这有助于减小账户压缩交易的大小，并使得可以修改深度高达31的树，可以存储超过10亿个cNFT。

要在默克尔树账户上初始化树冠，您必须使用额外的字节初始化账户。所需的额外字节数为(2*ⁿ*⁺¹ - 1) * 32，其中*n*是您希望树冠缓存的默克尔树级别数。

每当并发默克尔树被修改时，树冠都会更新。不需要额外的工作。但请注意，树创建后不能更改树冠大小。

## 可组合性与成本节约

下表是在[compressed.app](https://compressed.app/)的帮助下生成的，显示了铸造1,000,000个cNFT的总成本如何因树冠大小而大不相同。

### 不同树冠深度下1,000,000个cNFT的成本
*深度为20的默克尔树可以存储1,048,576个cNFT。*
| 树冠深度     | 证明字节数   | 存储成本 | 铸造成本（3个铸造/交易 带LUT） | 总成本 |
| ---------------- | ------------- | ------------ | -----------------------------| ---------- |
| 0                | 640           | 0.3091       | 1.6667                       | 1.9758     |
| 14               | 192           | 7.6067       | 1.6667                       | 9.2734     |
| 17               | 96            | 58.6933      | 1.6667                       | 60.36      |

树冠深度为零的原因是为了获得最便宜的铸造。然而，这需要在`transfer`、`delegate`和`burn`等指令中发送大量证明数据。在零深度树冠的情况下，略超过一半的交易大小限制被证明数据消耗，这负面影响了将Bubblegum指令与其他程序指令组合的能力。

最终，树冠大小的决定必须考虑成本和可组合性之间的权衡。这个评估应该考虑诸如cNFT的预期用途、开发平台的兼容性以及树的所有权结构等因素。

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
