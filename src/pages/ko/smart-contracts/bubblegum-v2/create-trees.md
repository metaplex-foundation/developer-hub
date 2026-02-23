---
title: Bubblegum 트리 생성
metaTitle: Bubblegum 트리 생성 - Bubblegum V2
description: 압축된 NFT를 보관할 수 있는 새로운 머클 트리를 생성하고 가져오는 방법을 알아보세요.
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


## 소개

압축된 NFT의 데이터는 트랜잭션 내에 저장되고 온체인 계정에 저장되지 않지만, 여전히 머클 트리와 그 구성을 추적하기 위한 일부 온체인 계정이 필요합니다. 따라서 압축된 NFT를 민팅하기 시작하기 전에 두 개의 계정을 생성해야 합니다:

- **머클 트리 계정**. 이 계정은 모든 유형의 데이터의 진위를 확인하는 데 사용할 수 있는 일반적인 머클 트리를 보관합니다. [SPL Account Compression Program](https://spl.solana.com/account-compression)에서 포크된 [MPL Account Compression Program](https://github.com/metaplex-foundation/mpl-account-compression)이 소유합니다. 우리의 경우, 압축된 NFT의 진위를 확인하는 데 사용할 것입니다.
- **TreeConfigV2 계정**. 이 두 번째 계정은 머클 트리 계정의 주소에서 파생된 PDA입니다. 압축된 NFT에 특정한 머클 트리의 추가 구성(예: 트리 제작자, 민팅된 cNFT 수 등)을 저장할 수 있습니다.

이 두 계정으로 압축된 NFT를 민팅하기 시작하는 데 필요한 모든 것이 있습니다. 연관된 트리 구성 계정이 있는 머클 트리 계정을 **Bubblegum 트리**라고 부르겠습니다.

{% diagram height="h-64 md:h-[200px]" %}

{% node %}
{% node #merkle-tree label="머클 트리 계정" theme="blue" /%}
{% node label="소유자: Account Compression Program" theme="dimmed" /%}
{% /node %}

{% node #tree-config-pda parent="merkle-tree" x="300" label="PDA" theme="crimson" /%}

{% node parent="tree-config-pda" y="60" %}
{% node #tree-config label="트리 구성 계정" theme="crimson" /%}
{% node label="소유자: Bubblegum Program" theme="dimmed" /%}
{% /node %}

{% edge from="merkle-tree" to="tree-config-pda" /%}
{% edge from="tree-config-pda" to="tree-config" /%}

{% /diagram %}

## Bubblegum 트리 생성

이제 Bubblegum 트리를 만들기 위해 이 두 계정을 모두 생성하는 방법을 살펴보겠습니다. 다행히 우리 라이브러리는 모든 것을 처리하는 **트리 생성** 작업을 제공하여 이 과정을 쉽게 만들어줍니다. 이 작업은 Bubblegum 트리를 우리의 요구에 맞게 사용자 정의할 수 있는 다양한 매개변수(대부분 선택사항)를 받아들입니다. 가장 중요한 것들은 다음과 같습니다:

- **머클 트리**: 머클 트리 계정을 생성하는 데 사용될 새로 생성된 서명자입니다. 그러면 머클 트리 계정이 이 주소에서 액세스 가능해집니다.
- **트리 제작자**: Bubblegum 트리를 관리하고 압축된 NFT를 민팅할 수 있는 계정의 주소입니다.
- **최대 깊이**와 **최대 버퍼 크기**: **최대 깊이** 매개변수는 머클 트리가 보관할 수 있는 최대 리프 수(따라서 압축된 NFT 수)를 계산하는 데 사용됩니다. 이 최대값은 `2^maxDepth`로 계산됩니다. **최대 버퍼 크기** 매개변수는 머클 트리의 최소 동시성 제한을 나타냅니다. 다시 말해, 트리에서 병렬로 발생할 수 있는 변경 수를 정의합니다. 이 두 매개변수는 임의로 선택할 수 없으며 아래 표에 표시된 대로 미리 정의된 값 집합에서 선택해야 합니다.

다음은 Solana 생태계 내 호환성을 위한 권장 트리 설정입니다.

| cNFT 수 | 트리 깊이 | 캐노피 깊이 | 동시성 버퍼 | 트리 비용 | cNFT당 비용 |
| --------------- | ---------- | ------------ | ------------------ | --------- | ------------- |
| 16,384          | 14         | 8            | 64                 | 0.3358    | 0.00002550    |
| 65,536          | 16         | 10           | 64                 | 0.7069    | 0.00001579    |
| 262,144         | 18         | 12           | 64                 | 2.1042    | 0.00001303    |
| 1,048,576       | 20         | 13           | 1024               | 8.5012    | 0.00001311    |
| 16,777,216      | 24         | 15           | 2048               | 26.1201   | 0.00000656    |
| 67,108,864      | 26         | 17           | 2048               | 70.8213   | 0.00000606    |
| 1,073,741,824   | 30         | 17           | 2048               | 72.6468   | 0.00000507    |

트리의 최대 깊이는 다음과 같습니다:

  {% totem %}
  {% totem-accordion title="최대 깊이 / 최대 버퍼 크기 테이블" %}

  | 최대 깊이 | 최대 버퍼 크기 | 최대 cNFT 수 |
  | --------- | --------------- | ------------------- |
  | 3         | 8               | 8                   |
  | 5         | 8               | 32                  |
  | 14        | 64              | 16,384              |
  | 14        | 256             | 16,384              |
  | 14        | 1,024           | 16,384              |
  | 14        | 2,048           | 16,384              |
  | 15        | 64              | 32,768              |
  | 16        | 64              | 65,536              |
  | 17        | 64              | 131,072             |
  | 18        | 64              | 262,144             |
  | 19        | 64              | 524,288             |
  | 20        | 64              | 1,048,576           |
  | 20        | 256             | 1,048,576           |
  | 20        | 1,024           | 1,048,576           |
  | 20        | 2,048           | 1,048,576           |
  | 24        | 64              | 16,777,216          |
  | 24        | 256             | 16,777,216          |
  | 24        | 512             | 16,777,216          |
  | 24        | 1,024           | 16,777,216          |
  | 24        | 2,048           | 16,777,216          |
  | 26        | 512             | 67,108,864          |
  | 26        | 1,024           | 67,108,864          |
  | 26        | 2,048           | 67,108,864          |
  | 30        | 512             | 1,073,741,824       |
  | 30        | 1,024           | 1,073,741,824       |
  | 30        | 2,048           | 1,073,741,824       |

  {% /totem-accordion %}
  {% /totem %}

- **공개**: Bubblegum 트리가 공개되어야 하는지 여부입니다. 공개된 경우 누구나 그것으로부터 압축된 NFT를 민팅할 수 있습니다. 그렇지 않으면 트리 제작자 또는 트리 위임자([cNFT 위임](/ko/smart-contracts/bubblegum-v2/delegate-cnfts)에서 논의)만이 압축된 NFT를 민팅할 수 있습니다.

다음은 우리 라이브러리를 사용하여 Bubblegum 트리를 생성하는 방법입니다:

{% dialect-switcher title="Bubblegum 트리 생성" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createTreeV2 } from '@metaplex-foundation/mpl-bubblegum'

const merkleTree = generateSigner(umi)
const builder = await createTreeV2(umi, {
        merkleTree,
        maxBufferSize: 64,
        maxDepth: 14,
      })

await builder.sendAndConfirm(umi)
```

기본적으로 트리 제작자는 Umi 신원으로 설정되고 공개 매개변수는 `false`로 설정됩니다. 하지만 아래 예제에서 보는 것처럼 이러한 매개변수를 사용자 정의할 수 있습니다.

```ts
const customTreeCreator = generateSigner(umi)
const builder = await createTreeV2(umi, {
  // ...
  treeCreator: customTreeCreator,
  public: true,
})
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Bubblegum 트리 가져오기

**Bubblegum 트리**는 두 개의 온체인 계정으로 구성되므로 그 중 하나를 가져오는 방법을 살펴보겠습니다.

### 머클 트리 가져오기

머클 트리 계정에는 다음과 같은 트리에 대한 다양한 정보가 포함됩니다:

- **최대 깊이**, **최대 버퍼 크기**, 트리의 **권한** 및 트리가 생성된 **생성 슬롯**을 저장하는 **트리 헤더**.
- **변경 로그**(또는 루트), **시퀀스 번호** 등과 같은 트리의 저수준 정보를 저장하는 **트리** 자체. 이 문서의 [전용 페이지](/ko/smart-contracts/bubblegum-v2/concurrent-merkle-trees)에서 동시 머클 트리에 대해 더 자세히 이야기합니다.
- [머클 트리 캐노피](/ko/smart-contracts/bubblegum-v2/merkle-tree-canopy) 페이지에서 논의된 **캐노피**.

다음은 우리 라이브러리를 사용하여 모든 데이터를 가져오는 방법입니다:

{% dialect-switcher title="머클 트리 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  fetchMerkleTree,
} from "@metaplex-foundation/mpl-account-compression";

const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree)
```

{% /dialect %}
{% /dialect-switcher %}

### 트리 구성 가져오기

트리 구성 계정에는 압축된 NFT에 특정한 데이터가 포함됩니다. 다음을 저장합니다:

- Bubblegum 트리의 **트리 제작자**.
- Bubblegum 트리의 **트리 위임자** (있는 경우). 그렇지 않으면 **트리 제작자**로 설정됩니다.
- 트리에서 민팅할 수 있는 cNFT의 최대 수인 Bubblegum 트리의 **총 용량**.
- 트리에 민팅된 cNFT 수를 추적하는 **민팅된 수**. 이 값은 머클 트리 리프가 고유하도록 하는 작업에 대한 **넌스**("한 번 사용되는 수") 값으로 사용되기 때문에 중요합니다. 따라서 이 넌스는 자산의 트리 범위 고유 식별자 역할을 합니다.
- 트리에서 누구나 cNFT를 민팅할 수 있는지 여부를 나타내는 **공개** 매개변수.
- **압축 해제 가능**은 Bubblegum V1에서만 유효합니다.
- **버전**은 사용할 수 있는 LeafSchema의 버전입니다.

다음은 우리 라이브러리를 사용하여 모든 데이터를 가져오는 방법입니다:

{% dialect-switcher title="트리 구성 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchTreeConfigFromSeeds } from '@metaplex-foundation/mpl-bubblegum';

const treeConfig = await fetchTreeConfigFromSeeds(umi, { merkleTree });
```

{% /dialect %}
{% /dialect-switcher %}

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
