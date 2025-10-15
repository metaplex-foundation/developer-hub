---
title: Bubblegum 트리 생성
metaTitle: Bubblegum 트리 생성 | Bubblegum
description: 압축 NFT를 보유할 수 있는 새로운 Merkle 트리를 생성하고 가져오는 방법을 알아봅니다.
---

## 소개

압축 NFT의 데이터는 트랜잭션 내부에 저장되며 온체인 계정에는 저장되지 않지만, Merkle 트리와 그 구성을 추적하기 위해 여전히 일부 온체인 계정이 필요합니다. 따라서 압축 NFT 발행을 시작하기 전에 두 개의 계정을 생성해야 합니다:

- **Merkle 트리 계정**. 이 계정은 모든 유형의 데이터의 진위성을 확인하는 데 사용할 수 있는 일반 Merkle 트리를 보유합니다. Solana에서 생성하고 유지 관리하는 [계정 압축 프로그램](https://spl.solana.com/account-compression)이 소유합니다. 우리의 경우 압축 NFT의 진위성을 확인하는 데 사용할 것입니다.
- **트리 구성 계정**. 이 두 번째 계정은 Merkle 트리 계정의 주소에서 파생된 PDA입니다. 이를 통해 압축 NFT에 특정한 Merkle 트리에 대한 추가 구성을 저장할 수 있습니다(예: 트리 생성자, 발행된 cNFT 수 등).

이 두 계정으로 압축 NFT 발행을 시작하는 데 필요한 모든 것을 갖추게 됩니다. 관련 트리 구성 계정이 있는 Merkle 트리 계정을 **Bubblegum 트리**라고 부릅니다.

{% diagram height="h-64 md:h-[200px]" %}

{% node %}
{% node #merkle-tree label="Merkle 트리 계정" theme="blue" /%}
{% node label="소유자: 계정 압축 프로그램" theme="dimmed" /%}
{% /node %}

{% node #tree-config-pda parent="merkle-tree" x="300" label="PDA" theme="crimson" /%}

{% node parent="tree-config-pda" y="60" %}
{% node #tree-config label="트리 구성 계정" theme="crimson" /%}
{% node label="소유자: Bubblegum 프로그램" theme="dimmed" /%}
{% /node %}

{% edge from="merkle-tree" to="tree-config-pda" /%}
{% edge from="tree-config-pda" to="tree-config" /%}

{% /diagram %}

## Bubblegum 트리 생성

이제 Bubblegum 트리를 생성하기 위해 이 두 계정을 모두 생성하는 방법을 살펴보겠습니다. 다행히도 우리 라이브러리는 모든 것을 처리하는 **트리 생성** 작업을 제공하여 이 프로세스를 쉽게 만듭니다. 이 작업은 대부분 선택 사항인 다양한 매개변수를 허용하여 Bubblegum 트리를 필요에 맞게 사용자 정의할 수 있습니다. 가장 중요한 것은 다음과 같습니다:

- **Merkle 트리**: Merkle 트리 계정을 생성하는 데 사용할 새로 생성된 서명자입니다. Merkle 트리 계정은 이 주소에서 액세스할 수 있습니다.
- **트리 생성자**: Bubblegum 트리를 관리하고 압축 NFT를 발행할 수 있는 계정의 주소입니다.
- **최대 깊이** 및 **최대 버퍼 크기**: **최대 깊이** 매개변수는 리프의 최대 수, 따라서 Merkle 트리가 보유할 수 있는 압축 NFT를 계산하는 데 사용됩니다. 이 최대값은 `2^maxDepth`로 계산됩니다. **최대 버퍼 크기** 매개변수는 Merkle 트리의 최소 동시성 한계를 나타냅니다. 즉, 트리에서 병렬로 발생할 수 있는 변경 사항의 수를 정의합니다. 이 두 매개변수는 임의로 선택할 수 없으며 아래 표에 표시된 대로 미리 정의된 값 집합에서 선택해야 합니다.

다음은 Solana 생태계 내 호환성을 위한 권장 트리 설정입니다.

| cNFT 수량 | 트리 깊이 | 캐노피 깊이 | 동시성 버퍼 | 트리 비용 | cNFT당 비용 |
| --------------- | ---------- | ------------ | ------------------ | --------- | ------------- |
| 16,384          | 14         | 8            | 64                 | 0.3358    | 0.00002550    |
| 65,536          | 16         | 10           | 64                 | 0.7069    | 0.00001579    |
| 262,144         | 18         | 12           | 64                 | 2.1042    | 0.00001303    |
| 1,048,576       | 20         | 13           | 1024               | 8.5012    | 0.00001311    |
| 16,777,216      | 24         | 15           | 2048               | 26.1201   | 0.00000656    |
| 67,108,864      | 26         | 17           | 2048               | 70.8213   | 0.00000606    |
| 1,073,741,824   | 30         | 17           | 2048               | 72.6468   | 0.00000507    |

트리의 최대 깊이는 다음과 같습니다.

  {% totem %}
  {% totem-accordion title="최대 깊이 / 최대 버퍼 크기 표" %}

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

- **공개**: Bubblegum 트리를 공개할지 여부입니다. 공개인 경우 누구나 압축 NFT를 발행할 수 있습니다. 그렇지 않으면 트리 생성자 또는 트리 위임자([cNFT 위임](/bubblegum/delegate-cnfts)에서 논의됨)만 압축 NFT를 발행할 수 있습니다.

다음은 라이브러리를 사용하여 Bubblegum 트리를 생성하는 방법입니다:

{% dialect-switcher title="Bubblegum 트리 생성" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createTree } from '@metaplex-foundation/mpl-bubblegum'

const merkleTree = generateSigner(umi)
const builder = await createTree(umi, {
  merkleTree,
  maxDepth: 14,
  maxBufferSize: 64,
})
await builder.sendAndConfirm(umi)
```

기본적으로 트리 생성자는 Umi identity로 설정되고 공개 매개변수는 `false`로 설정됩니다. 그러나 아래 예제와 같이 이러한 매개변수를 사용자 정의할 수 있습니다.

```ts
const customTreeCreator = generateSigner(umi)
const builder = await createTree(umi, {
  // ...
  treeCreator: customTreeCreator,
  public: true,
})
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Bubblegum 트리 가져오기

**Bubblegum 트리**는 두 개의 온체인 계정으로 구성되므로 각각을 가져오는 방법을 살펴보겠습니다.

### Merkle 트리 가져오기

Merkle 트리 계정에는 다음과 같은 트리에 대한 다양한 정보가 포함되어 있습니다:

- **최대 깊이**, **최대 버퍼 크기**, 트리의 **권한** 및 트리가 생성된 **생성 슬롯**을 저장하는 **트리 헤더**.
- **변경 로그**(또는 루트), **시퀀스 번호** 등과 같은 트리에 대한 저수준 정보를 저장하는 **트리** 자체. 이 문서의 [전용 페이지](/bubblegum/concurrent-merkle-trees)에서 동시 Merkle 트리에 대해 더 자세히 다룹니다.
- [Merkle 트리 캐노피](/bubblegum/merkle-tree-canopy) 페이지에서 논의된 **캐노피**.

다음은 라이브러리를 사용하여 모든 데이터를 가져오는 방법입니다:

{% dialect-switcher title="Merkle 트리 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchMerkleTree } from '@metaplex-foundation/mpl-bubblegum'

const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree)
```

{% /dialect %}
{% /dialect-switcher %}

### 트리 구성 가져오기

트리 구성 계정에는 압축 NFT에 특정한 데이터가 포함되어 있습니다. 다음을 저장합니다:

- Bubblegum 트리의 **트리 생성자**.
- Bubblegum 트리의 **트리 위임자**(있는 경우). 그렇지 않으면 **트리 생성자**로 설정됩니다.
- 트리에서 발행할 수 있는 cNFT의 최대 수인 Bubblegum 트리의 **총 용량**.
- 트리에 발행된 cNFT 수를 추적하는 **발행된 수**. 이 값은 작업이 Merkle 트리 리프가 고유한지 확인하는 데 사용되는 **Nonce**("한 번 사용되는 숫자") 값으로 사용되기 때문에 중요합니다. 따라서 이 nonce는 트리 범위의 자산 고유 식별자 역할을 합니다.
- 누구나 트리에서 cNFT를 발행할 수 있는지 여부를 나타내는 **공개 여부** 매개변수.

다음은 라이브러리를 사용하여 모든 데이터를 가져오는 방법입니다:

{% dialect-switcher title="트리 구성 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchTreeConfigFromSeeds } from '@metaplex-foundation/mpl-bubblegum'

const treeConfig = await fetchTreeConfigFromSeeds(umi, { merkleTree })
```

{% /dialect %}
{% /dialect-switcher %}
