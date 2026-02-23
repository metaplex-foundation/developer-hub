---
title: Bubblegumツリーの作成
metaTitle: Bubblegumツリーの作成 - Bubblegum V2
description: Bubblegum V2で圧縮NFT用のマークルツリーを作成・取得する方法を学びます。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - merkle tree
  - create tree
  - tree capacity
  - canopy depth
  - Bubblegum tree
  - cNFT tree
  - max depth
  - max buffer size
about:
  - Compressed NFTs
  - Merkle trees
  - Solana accounts
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: How do I choose the right tree size for my project?
    a: Use the recommended settings table. For small projects, a depth-14 tree holds 16,384 cNFTs at ~0.34 SOL. For large drops, a depth-20 tree holds 1 million cNFTs at ~8.5 SOL.
  - q: Can I change the tree size after creation?
    a: No. The max depth, max buffer size, and canopy depth are fixed at creation time. You must create a new tree if you need different parameters.
  - q: What is the relationship between max depth and tree capacity?
    a: The maximum number of cNFTs a tree can hold is 2^maxDepth. For example, maxDepth=20 supports 1,048,576 cNFTs.
  - q: What does the max buffer size control?
    a: The max buffer size determines how many concurrent modifications can happen to the tree in the same block. Higher values allow more parallel transactions but increase tree cost.
---

## Summary

**Creating a Bubblegum Tree** is the first step before minting compressed NFTs. This page covers how to create and fetch the two required on-chain accounts: the Merkle Tree account and the TreeConfigV2 PDA.

- Create a Bubblegum Tree with configurable max depth, max buffer size, and canopy depth
- Choose tree parameters based on your project's cNFT capacity needs (16K to 1B+ cNFTs)
- Fetch merkle tree and tree config account data after creation
- Understand the cost tradeoffs for different tree configurations

## Out of Scope


## はじめに

圧縮NFTのデータはトランザクション内に保存され、オンチェーンアカウントには保存されませんが、マークルツリーとその設定を追跡するためのオンチェーンアカウントが必要です。そのため、圧縮NFTのミントを開始する前に、2つのアカウントを作成する必要があります：

- **マークルツリーアカウント**。このアカウントは、あらゆる種類のデータの真正性を検証するために使用できる一般的なマークルツリーを保持します。これは[SPLアカウント圧縮プログラム](https://spl.solana.com/account-compression)からフォークされた[MPLアカウント圧縮プログラム](https://github.com/metaplex-foundation/mpl-account-compression)によって所有されています。私たちの場合、これを使用して圧縮NFTの真正性を検証します。
- **TreeConfigV2アカウント**。この2番目のアカウントは、マークルツリーアカウントのアドレスから派生したPDAです。これにより、圧縮NFTに特有のマークルツリーの追加設定（例：ツリー作成者、ミント済みcNFTの数など）を保存できます。

これらの2つのアカウントがあれば、圧縮NFTのミントを開始するために必要なすべてが揃います。関連するツリー設定アカウントを持つマークルツリーアカウントを**Bubblegumツリー**と呼びます。

{% diagram height="h-64 md:h-[200px]" %}

{% node %}
{% node #merkle-tree label="マークルツリーアカウント" theme="blue" /%}
{% node label="所有者: アカウント圧縮プログラム" theme="dimmed" /%}
{% /node %}

{% node #tree-config-pda parent="merkle-tree" x="300" label="PDA" theme="crimson" /%}

{% node parent="tree-config-pda" y="60" %}
{% node #tree-config label="ツリー設定アカウント" theme="crimson" /%}
{% node label="所有者: Bubblegumプログラム" theme="dimmed" /%}
{% /node %}

{% edge from="merkle-tree" to="tree-config-pda" /%}
{% edge from="tree-config-pda" to="tree-config" /%}

{% /diagram %}

## Bubblegumツリーの作成

これらのアカウントの両方を作成してBubblegumツリーを作成する方法を見てみましょう。幸いなことに、私たちのライブラリはすべてを処理する**ツリー作成**操作を提供することで、このプロセスを簡単にしています。この操作は、さまざまなパラメータ（そのほとんどがオプション）を受け入れ、Bubblegumツリーを私たちのニーズに合わせてカスタマイズできます。最も重要なものは次のとおりです：

- **マークルツリー**: マークルツリーアカウントの作成に使用される新しく生成された署名者。マークルツリーアカウントは、このアドレスでアクセス可能になります。
- **ツリー作成者**: Bubblegumツリーを管理し、圧縮NFTをミントできるアカウントのアドレス。
- **最大深度**と**最大バッファサイズ**: **最大深度**パラメータは、マークルツリーが保持できるリーフの最大数、つまり圧縮NFTを計算するために使用されます。この最大値は`2^maxDepth`で計算されます。**最大バッファサイズ**パラメータは、マークルツリーの最小同時実行制限を示します。言い換えると、ツリーで並行して発生できる変更の数を定義します。これらの2つのパラメータは任意に選択することはできず、以下の表に表示されている事前定義された値のセットから選択する必要があります。

以下は、Solanaエコシステム内での互換性のための推奨ツリー設定です。

| cNFTの数 | ツリーの深度 | キャノピーの深度 | 同時実行バッファ | ツリーのコスト | cNFTあたりのコスト |
| ----------- | ----------- | --------------- | ---------------- | ------------ | ---------------- |
| 16,384      | 14          | 8               | 64               | 0.3358       | 0.00002550       |
| 65,536      | 16          | 10              | 64               | 0.7069       | 0.00001579       |
| 262,144     | 18          | 12              | 64               | 2.1042       | 0.00001303       |
| 1,048,576   | 20          | 13              | 1024             | 8.5012       | 0.00001311       |

## Notes

- Tree parameters (max depth, max buffer size, canopy depth) are **immutable** after creation. Choose carefully based on your project's needs.
- Larger trees cost more in rent but have a lower per-cNFT cost. See the recommended settings table above for cost estimates.
- The Tree Creator is stored in the TreeConfigV2 account and can delegate minting authority to another account (see [Delegating Trees](/smart-contracts/bubblegum-v2/delegate-trees)).
- Public trees allow anyone to mint. Private trees restrict minting to the Tree Creator or Tree Delegate.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **Bubblegum Tree** | The combination of a Merkle Tree account and its associated TreeConfigV2 PDA |
| **Merkle Tree Account** | The on-chain account holding the merkle tree data, owned by the MPL Account Compression Program |
| **TreeConfigV2** | A PDA derived from the Merkle Tree address, storing Bubblegum-specific config (creator, delegate, capacity, mint count, public flag) |
| **Max Depth** | The maximum depth of the merkle tree, determining capacity as 2^maxDepth |
| **Max Buffer Size** | The number of change log entries stored, determining how many concurrent modifications the tree supports per block |
| **Canopy Depth** | The number of upper tree levels cached on-chain, reducing proof sizes in transactions |
| **Tree Creator** | The account that created the tree and has authority to manage it and mint cNFTs |
| **Tree Delegate** | An account authorized by the Tree Creator to mint cNFTs on their behalf |
