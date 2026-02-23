---
title: 同時マークルツリー
metaTitle: 同時マークルツリー - Bubblegum V2
description: 同時マークルツリーとBubblegumでの使用方法について詳しく学びます。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - concurrent merkle tree
  - SPL account compression
  - tree buffer
  - max buffer
  - merkle proof
  - leaf validation
  - change log
about:
  - Merkle trees
  - Data structures
  - Solana programs
proficiencyLevel: Advanced
---

## Summary

**Concurrent Merkle Trees** explains the data structure underlying compressed NFTs. This page covers how merkle trees work, leaf paths, proofs, validation, and the concurrency mechanism that enables parallel writes within the same Solana block.

- Merkle trees store cNFT data as hashed leaves with a single root representing the entire tree
- Proofs enable verifying a specific cNFT exists without rehashing the entire tree
- The concurrent mechanism uses a ChangeLog buffer to handle multiple writes per block
- The rightmost proof is stored on-chain, enabling minting without sending proof data


## はじめに

マークルツリーは、各リーフノードが何らかのデータを表すハッシュでラベル付けされたツリーデータ構造です。隣接するリーフは一緒にハッシュ化され、結果として得られるハッシュがそれらのリーフの親であるノードのラベルになります。同じレベルのノードは再び一緒にハッシュ化され、結果として得られるハッシュがそれらのノードの親であるノードのラベルになります。このプロセスは、ルートノードに対して単一のハッシュが作成されるまで続きます。この単一のハッシュは、ツリー全体のデータ整合性を暗号学的に表し、マークルルートと呼ばれます。

ほとんどのマークルツリーは二進ツリーですが、そうである必要はありません。Bubblegum圧縮NFT（cNFT）に使用されるマークルツリーは、私たちの図に示されているように二進ツリーです。

{% diagram %}

{% node %}
{% node #root label="マークルルート" /%}
{% node label="Hash(ノード 1, ノード 2)" /%}
{% /node %}

{% node parent="root" y=100 x=-220 %}
{% node #i-node-1 label="ノード 1" /%}
{% node label="Hash(ノード 3, ノード 4)" /%}
{% /node %}

{% node parent="root" y=100 x=220 %}
{% node #i-node-2 label="ノード 2" /%}
{% node label="Hash(ノード 5, ノード 6)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=-110 %}
{% node #i-node-3 label="ノード 3" /%}
{% node label="Hash(リーフ 1, リーフ 2)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=110 %}
{% node #i-node-4 label="ノード 4" /%}
{% node label="Hash(リーフ 3, リーフ 4)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=-110 %}
{% node #i-node-5 label="ノード 5" /%}
{% node label="Hash(リーフ 5, リーフ 6)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=110 %}
{% node #i-node-6 label="ノード 6" /%}
{% node label="Hash(リーフ 7, リーフ 8)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="-40" %}
{% node #leaf-1 label="リーフ 1" /%}
{% node label="Hash(cNFT 1)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="70" %}
{% node #leaf-2 label="リーフ 2" /%}
{% node label="Hash(cNFT 2)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="-40" %}

## Notes

- The max buffer size set at tree creation determines how many concurrent changes can be fast-forwarded per block.
- If more concurrent changes occur than the buffer size allows, some transactions will fail and need to be retried.
- Proofs fetched from the DAS API may become stale if the tree is modified between fetch and use. The ChangeLog mechanism mitigates this for concurrent operations.
- The rightmost proof optimization allows minting (appending) without any proof data, since new leaves are always added at the rightmost position.

## Glossary

| Term | Definition |
|------|------------|
| **Merkle Tree** | A binary tree where each node is a hash of its children, with leaves representing cNFT data |
| **Merkle Root** | The single top-level hash representing the integrity of the entire tree |
| **Leaf Path** | The leaf node hash and all intermediate nodes leading to the root |
| **Proof** | The sibling hashes needed to recalculate the root from a given leaf |
| **ChangeLog** | A buffer of recent tree modifications that enables concurrent writes by fast-forwarding stale proofs |
| **spl-account-compression** | The Solana program that manages the on-chain concurrent merkle tree |
