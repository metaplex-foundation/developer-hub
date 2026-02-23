---
title: マークルツリーキャノピー
metaTitle: マークルツリーキャノピー - Bubblegum V2
description: Bubblegumのマークルツリーキャノピーについて詳しく学びます。
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


## はじめに

SolanaのネットワーキングスタックはMTUサイズ1280バイトを使用し、ヘッダーを考慮すると、データに1232バイトが残ります。これが圧縮NFT（cNFT）に与える影響は、必要な証明がトランザクションサイズを占有しすぎるため、現在深度24を超えるマークルツリーの変更は不可能になることです。

これらの証明サイズの制限を回避するために、SPLアカウント圧縮は、マークルツリーの最上位ノードをキャッシュする機能を提供します。これは**キャノピー**と呼ばれ、同時マークルツリーアカウントの最後に保存されます。

深度*d*のツリーの上位*n*レベルをキャッシュすることで、証明を最初の*d - n*ノードに切り捨てることができます。これにより、アカウント圧縮トランザクションのサイズを削減し、10億以上のcNFTを保存できる深度31までのツリーの変更を可能にします。

マークルツリーアカウントにキャノピーを初期化するには、追加のバイトでアカウントを初期化する必要があります。必要な追加バイト数は（2*ⁿ*⁺¹ - 1）* 32です。ここで*n*は、キャノピーにキャッシュしたいマークルツリーのレベル数です。

キャノピーは、同時マークルツリーが変更されるたびに更新されます。追加の作業は必要ありません。ただし、ツリーの作成後にキャノピーサイズを変更することはできません。

## 組み合わせやすさ vs. コスト削減

以下の表は[compressed.app](https://compressed.app/)の協力で生成され、キャノピーサイズによって1,000,000個のcNFTをミントする総コストがいかに大きく異なるかを示しています。

### 様々なキャノピー深度での1,000,000 cNFTのコスト
*深度20のマークルツリーは1,048,576個のcNFTを保存できます。*
| キャノピー深度 | 証明バイト | ストレージコスト | ミントコスト（LUTで3ミント/tx） | 総コスト |
| -------------- | ---------- | --------------- | ------------------------------- | -------- |
| 0              | 640        | 0.3091          | 1.6667                          | 1.9758   |
| 14             | 192        | 7.6067          | 1.6667                          | 9.2734   |
| 17             | 96         | 58.6933         | 1.6667                          | 60.36    |

キャノピー深度をゼロにする理由は、可能な限り安いミントを行うためです。ただし、これには`transfer`、`delegate`、`burn`などの命令で大量の証明データを送信する必要があります。ゼロ深度キャノピーの場合、トランザクションサイズ制限の半分以上が証明データで消費され、Bubblegum命令を他のプログラム命令と組み合わせる能力に悪影響を与えます。

最終的に、キャノピーサイズの決定は、コストと組み合わせやすさのトレードオフを考慮する必要があります。この評価では、cNFTの使用目的、開発プラットフォームの互換性、ツリーの所有権構造などの要因を考慮に入れる必要があります。

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
