---
title: 동시 머클 트리
metaTitle: 동시 머클 트리 - Bubblegum V2
description: 동시 머클 트리와 Bubblegum에서 사용되는 방식에 대해 자세히 알아보세요.
created: '2025-01-15'
updated: '2026-02-24'
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

**동시 머클 트리**는 압축 NFT의 기반이 되는 데이터 구조를 설명합니다. 이 페이지에서는 머클 트리의 작동 방식, 리프 경로, 증명, 검증, 그리고 동일한 Solana 블록 내에서 병렬 쓰기를 가능하게 하는 동시성 메커니즘을 다룹니다.

- 머클 트리는 전체 트리를 나타내는 단일 루트와 함께 해시된 리프로 cNFT 데이터를 저장합니다
- 증명을 통해 전체 트리를 다시 해싱하지 않고 특정 cNFT의 존재를 확인할 수 있습니다
- 동시성 메커니즘은 ChangeLog 버퍼를 사용하여 블록당 여러 쓰기를 처리합니다
- 가장 오른쪽 증명이 온체인에 저장되어 증명 데이터 없이 민팅이 가능합니다


## 소개

머클 트리는 각 리프 노드가 일부 데이터를 나타내는 해시로 레이블이 지정된 트리 데이터 구조입니다. 인접한 리프들이 함께 해싱되고, 결과 해시가 해당 리프들의 부모인 노드의 레이블이 됩니다. 같은 레벨의 노드들이 다시 함께 해싱되고, 결과 해시가 해당 노드들의 부모인 노드의 레이블이 됩니다. 이 과정은 루트 노드에 대해 단일 해시가 생성될 때까지 계속됩니다. 이 단일 해시는 전체 트리의 데이터 무결성을 암호학적으로 나타내며 머클 루트라고 합니다.

대부분의 머클 트리는 이진 트리이지만 반드시 그럴 필요는 없습니다. Bubblegum 압축된 NFT(cNFT)에 사용되는 머클 트리는 다이어그램에 표시된 것처럼 이진 트리입니다.

{% diagram %}

{% node %}
{% node #root label="머클 루트" /%}
{% node label="해시(노드 1, 노드 2)" /%}
{% /node %}

{% node parent="root" y=100 x=-220 %}
{% node #i-node-1 label="노드 1" /%}
{% node label="해시(노드 3, 노드 4)" /%}
{% /node %}

{% node parent="root" y=100 x=220 %}
{% node #i-node-2 label="노드 2" /%}
{% node label="해시(노드 5, 노드 6)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=-110 %}
{% node #i-node-3 label="노드 3" /%}
{% node label="해시(리프 1, 리프 2)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=110 %}
{% node #i-node-4 label="노드 4" /%}
{% node label="해시(리프 3, 리프 4)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=-110 %}
{% node #i-node-5 label="노드 5" /%}
{% node label="해시(리프 5, 리프 6)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=110 %}
{% node #i-node-6 label="노드 6" /%}
{% node label="해시(리프 7, 리프 8)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="-40" %}
{% node #leaf-1 label="리프 1" /%}
{% node label="해시(cNFT 1)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="70" %}
{% node #leaf-2 label="리프 2" /%}
{% node label="해시(cNFT 2)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="-40" %}
{% node #leaf-3 label="리프 3" /%}
{% node label="해시(cNFT 3)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="70" %}
{% node #leaf-4 label="리프 4" /%}
{% node label="해시(cNFT 4)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="-40" %}
{% node #leaf-5 label="리프 5" /%}
{% node label="해시(cNFT 5)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="70" %}
{% node #leaf-6 label="리프 6" /%}
{% node label="해시(cNFT 6)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="-40" %}
{% node #leaf-7 label="리프 7" /%}
{% node label="해시(cNFT 7)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="70" %}
{% node #leaf-8 label="리프 8" /%}
{% node label="해시(cNFT 8)" /%}
{% /node %}

{% edge from="i-node-1" to="root" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-2" to="root" fromPosition="top" toPosition="bottom" /%}

{% edge from="i-node-3" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-4" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-6" to="i-node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-5" to="i-node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-3" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-5" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="i-node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="i-node-6" fromPosition="top" toPosition="bottom" /%}

{% /diagram %}

블록체인에 데이터 상태를 저장하는 것에 대해 이야기할 때, 이 머클 루트를 저장하면 루트를 생성하기 위해 이전에 해싱된 모든 것의 데이터 무결성을 나타내는 단일 값을 효과적으로 저장할 수 있습니다. 트리의 어떤 리프 값이 변경되면 기존 머클 루트는 무효가 되고 다시 계산되어야 합니다.

Bubblegum 압축된 NFT의 경우 리프 노드 해시는 [리프 스키마](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum-v2/program/src/state/leaf_schema.rs#L40)의 해시입니다. 리프 스키마는 리프 ID, 소유자/위임자 정보, cNFT의 [크리에이터](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum-v2/program/src/state/metaplex_adapter.rs#L103)를 나타내는 [`creator_hash`](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum-v2/program/src/lib.rs#L433), 그리고 일반적으로 압축된 NFT의 [메타데이터](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum-v2/program/src/state/metaplex_adapter.rs#L81)를 나타내는 [`data_hash`](https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/programs/bubblegum-v2/program/src/lib.rs#L450)(크리에이터 배열을 다시 포함)을 포함합니다. 따라서 단일 압축된 NFT를 암호학적으로 확인하는 데 필요한 모든 정보가 해싱된 리프 스키마에 저장됩니다.

## 리프 경로

이전 섹션에서 배운 것처럼, 머클 트리에서는 리프 노드만이 최종 사용자 데이터를 나타냅니다. 해시로 이어지는 내부 노드들은 모두 머클 루트를 위한 중간 값일 뿐입니다. 리프 노드의 **경로**를 언급할 때, 리프 노드 해시 자체와 머클 루트로 직접 이어지는 내부 노드들을 의미합니다. 예를 들어, 리프 2의 경로가 아래 다이어그램에 강조 표시되어 있습니다.

{% diagram %}

{% node %}
{% node #root label="머클 루트" theme="blue" /%}
{% node label="해시(노드 1, 노드 2)" theme="blue" /%}
{% /node %}

{% node parent="root" y=100 x=-220 %}
{% node #i-node-1 label="노드 1" theme="blue" /%}
{% node label="해시(노드 3, 노드 4)" theme="blue" /%}
{% /node %}

{% node parent="root" y=100 x=220 %}
{% node #i-node-2 label="노드 2" /%}
{% node label="해시(노드 5, 노드 6)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=-110 %}
{% node #i-node-3 label="노드 3" theme="blue" /%}
{% node label="해시(리프 1, 리프 2)" theme="blue" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=110 %}
{% node #i-node-4 label="노드 4" /%}
{% node label="해시(리프 3, 리프 4)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=-110 %}
{% node #i-node-5 label="노드 5" /%}
{% node label="해시(리프 5, 리프 6)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=110 %}
{% node #i-node-6 label="노드 6" /%}
{% node label="해시(리프 7, 리프 8)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="-40" %}
{% node #leaf-1 label="리프 1" /%}
{% node label="해시(cNFT 1)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="70" %}
{% node #leaf-2 label="리프 2" theme="blue" /%}
{% node label="해시(cNFT 2)" theme="blue" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="-40" %}
{% node #leaf-3 label="리프 3" /%}
{% node label="해시(cNFT 3)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="70" %}
{% node #leaf-4 label="리프 4" /%}
{% node label="해시(cNFT 4)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="-40" %}
{% node #leaf-5 label="리프 5" /%}
{% node label="해시(cNFT 5)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="70" %}
{% node #leaf-6 label="리프 6" /%}
{% node label="해시(cNFT 6)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="-40" %}
{% node #leaf-7 label="리프 7" /%}
{% node label="해시(cNFT 7)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="70" %}
{% node #leaf-8 label="리프 8" /%}
{% node label="해시(cNFT 8)" /%}
{% /node %}

{% edge from="i-node-1" to="root" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="i-node-2" to="root" fromPosition="top" toPosition="bottom" /%}

{% edge from="i-node-3" to="i-node-1" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="i-node-4" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-6" to="i-node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-5" to="i-node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="i-node-3" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="leaf-4" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-3" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-5" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="i-node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="i-node-6" fromPosition="top" toPosition="bottom" /%}

{% /diagram %}

## 리프 증명

압축된 NFT가 머클 트리에 존재하는지 증명하려면 모든 리프 노드를 다시 해싱할 필요가 없습니다. 아래 다이어그램에서 볼 수 있듯이 머클 루트를 계산할 때까지 함께 해싱할 특정 값들만 있으면 됩니다. 이러한 값들을 리프의 **증명**이라고 합니다. 구체적으로, 리프 노드의 증명은 인접한 리프 노드의 해시와 머클 루트를 계산하는 데 사용할 수 있는 인접한 내부 노드 해시들입니다. 리프 2의 증명이 아래 다이어그램에 강조 표시되어 있습니다.

{% diagram %}

{% node %}
{% node #root label="머클 루트" /%}
{% node label="해시(노드 1, 노드 2)" /%}
{% /node %}

{% node parent="root" y=100 x=-220 %}
{% node #i-node-1 label="노드 1" /%}
{% node label="해시(노드 3, 노드 4)" /%}
{% /node %}

{% node parent="root" y=100 x=220 %}
{% node #i-node-2 label="노드 2" theme="mint" /%}
{% node label="해시(노드 5, 노드 6)" theme="mint" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=-110 %}
{% node #i-node-3 label="노드 3" /%}
{% node label="해시(리프 1, 리프 2)" /%}
{% /node %}

{% node parent="i-node-1" y=100 x=110 %}
{% node #i-node-4 label="노드 4" theme="mint" /%}
{% node label="해시(리프 3, 리프 4)" theme="mint" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=-110 %}
{% node #i-node-5 label="노드 5" /%}
{% node label="해시(리프 5, 리프 6)" /%}
{% /node %}

{% node parent="i-node-2" y=100 x=110 %}
{% node #i-node-6 label="노드 6" /%}
{% node label="해시(리프 7, 리프 8)" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="-40" %}
{% node #leaf-1 label="리프 1" theme="mint" /%}
{% node label="해시(cNFT 1)" theme="mint" /%}
{% /node %}

{% node parent="i-node-3" y="100" x="70" %}
{% node #leaf-2 label="리프 2" theme="blue" /%}
{% node label="해시(cNFT 2)" theme="blue" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="-40" %}
{% node #leaf-3 label="리프 3" /%}
{% node label="해시(cNFT 3)" /%}
{% /node %}

{% node parent="i-node-4" y="100" x="70" %}
{% node #leaf-4 label="리프 4" /%}
{% node label="해시(cNFT 4)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="-40" %}
{% node #leaf-5 label="리프 5" /%}
{% node label="해시(cNFT 5)" /%}
{% /node %}

{% node parent="i-node-5" y="100" x="70" %}
{% node #leaf-6 label="리프 6" /%}
{% node label="해시(cNFT 6)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="-40" %}
{% node #leaf-7 label="리프 7" /%}
{% node label="해시(cNFT 7)" /%}
{% /node %}

{% node parent="i-node-6" y="100" x="70" %}
{% node #leaf-8 label="리프 8" /%}
{% node label="해시(cNFT 8)" /%}
{% /node %}

{% edge from="i-node-1" to="root" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-2" to="root" fromPosition="top" toPosition="bottom" /%}

{% edge from="i-node-3" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-4" to="i-node-1" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-6" to="i-node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="i-node-5" to="i-node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="i-node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-3" to="i-node-4" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-5" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="i-node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="i-node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="i-node-6" fromPosition="top" toPosition="bottom" /%}

{% /diagram %}

## 리프 검증

리프 노드와 그 증명을 사용하여 머클 루트를 계산하는 과정은 다음과 같습니다:
1. 원시 리프 스키마로 시작하여 해싱합니다.
2. 1단계의 값을 형제 리프 노드의 해시와 해싱하여 리프 경로의 다음 값을 생성합니다.
3. 2단계의 경로 값을 증명의 다음 값인 다음 형제 내부 노드와 해싱합니다.
4. 머클 루트를 계산할 때까지 형제 내부 노드 값들과 값을 해싱하는 이 과정을 트리 위쪽으로 계속합니다.

우리가 계산한 머클 루트가 해당 트리에 대해 주어진 머클 루트와 일치하면 정확한 리프 노드가 머클 트리에 존재한다는 것을 알 수 있습니다. 또한 리프 노드가 업데이트될 때마다(즉, cNFT가 새 소유자에게 전송될 때) 새로운 머클 루트를 계산하고 온체인에서 업데이트해야 합니다.

## 동시성

cNFT에 사용되는 온체인 머클 트리는 동일한 블록에서 여러 쓰기를 처리할 수 있어야 합니다. 트리에 새로운 cNFT를 민팅하고, cNFT를 전송하고, cNFT를 위임하고, cNFT를 소각하는 등의 여러 트랜잭션이 있을 수 있기 때문입니다. 문제는 온체인 트리에 대한 첫 번째 쓰기가 동일한 블록 내의 다른 쓰기를 위해 전송된 증명을 무효화한다는 것입니다.

이에 대한 해결책은 [spl-account-compression](https://spl.solana.com/account-compression)에서 사용하는 머클 트리가 하나의 머클 루트만 저장하는 것이 아니라 이전 루트들과 이전에 수정된 리프들의 경로에 대한 [`ChangeLog`](https://github.com/solana-labs/solana-program-library/blob/master/libraries/concurrent-merkle-tree/src/changelog.rs#L9)도 저장한다는 것입니다. 새 트랜잭션이 보낸 루트와 증명이 이전 업데이트로 무효화되었더라도 프로그램이 증명을 빨리 감습니다. 사용 가능한 `ChangeLog` 수는 트리를 생성할 때 사용되는 [최대 버퍼 크기](/ko/smart-contracts/bubblegum-v2/create-trees#creating-a-bubblegum-tree)에 의해 설정됩니다.

또한 머클 트리의 가장 오른쪽 증명이 온체인에 저장됩니다. 이를 통해 증명을 보낼 필요 없이 트리에 추가할 수 있습니다. 이것이 바로 Bubblegum이 증명 없이 새로운 cNFT를 민팅할 수 있는 방법입니다.

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
