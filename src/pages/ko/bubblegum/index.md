---
title: 개요
metaTitle: 개요 | Bubblegum
description: 압축 NFT에 대한 개략적인 개요를 제공합니다.
---

{% callout type="note" title="새로운 Bubblegum 버전" %}

더 많은 유연성과 기능을 위해 [Bubblegum v2](/bubblegum-v2) 사용을 권장합니다.

{% /callout %}

Bubblegum은 Solana에서 압축 NFT(cNFT)를 생성하고 상호작용하기 위한 Metaplex Protocol 프로그램입니다. 압축 NFT는 온체인 데이터 저장 방식을 재고함으로써 NFT 생성을 새로운 차원으로 확장할 수 있게 합니다. {% .lead %}

{% quick-links %}

{% quick-link title="시작하기" icon="InboxArrowDown" href="/bubblegum/getting-started" description="원하는 언어나 라이브러리를 찾아 압축 NFT를 시작하세요." /%}

{% quick-link title="API 레퍼런스" icon="CodeBracketSquare" href="https://mpl-bubblegum.typedoc.metaplex.com/" target="_blank" description="특정한 것을 찾고 계신가요? API 레퍼런스를 확인하고 답을 찾으세요." /%}

{% /quick-links %}

## 소개

Solana 블록체인에서 NFT가 번성함에 따라, NFT가 인터넷의 디지털 자산만큼 보편화되어야 할 필요성이 증가하고 있습니다: 게임 인벤토리의 모든 아이템, 좋아하는 소비자 앱의 참여 증명, 또는 심지어 지구상의 모든 사람을 위한 프로필 등입니다.

그러나 지금까지 이러한 유형의 제품들은 Solana의 NFT 렌트 비용으로 인해 제한되어 왔습니다. 비용은 상대적으로 저렴하지만 선형적으로 증가합니다. NFT의 압축은 NFT의 온체인 저장 비용을 대폭 줄여 창작자들이 원하는 만큼 기술을 표현할 수 있게 합니다.

Merkle 트리를 사용하여 Solana에서 cNFT 프로젝트를 출시하는 것은 매우 비용 효율적이며, 비용은 다음과 같이 시작됩니다:

| cNFT 수량 | 저장 비용 | 트랜잭션 비용 | 총 비용 | cNFT당 비용 |
| --------------- | ------------ | ---------------- | ---------- | ------------- |
| 10,000          | 0.2222       | 0.05             | 0.2722     | 0.000027222   |
| 100,000         | 0.2656       | 0.5              | 0.7656     | 0.000007656   |
| 1,000,000       | 0.3122       | 5                | 5.3122     | 0.000005312   |
| 10,000,000      | 0.4236       | 50               | 50.4236    | 0.000005042   |
| 100,000,000     | 7.2205       | 500              | 507.2205   | 0.000005072   |
| 1,000,000,000   | 7.2205       | 5,000            | 5007.2205  | 0.000005007   |

이러한 압축 NFT는 전송, 위임될 수 있으며, 기존 스마트 컨트랙트와의 상호 운용성을 위해 일반 NFT로 압축 해제할 수도 있습니다.

## Merkle 트리, 리프 및 증명

압축 NFT는 **Merkle 트리**의 맥락에서만 존재합니다. Merkle 트리가 무엇인지 [전용 고급 가이드](/bubblegum/concurrent-merkle-trees)에서 설명하지만, 이 개요에서는 Merkle 트리를 **리프**라고 부르는 해시 모음으로 생각할 수 있습니다. 각 리프는 [압축 NFT의 데이터를 해싱](/bubblegum/hashed-nft-data)하여 얻습니다.

Merkle 트리의 각 리프에 대해, 주어진 리프가 해당 트리의 일부인지 확인할 수 있는 해시 목록(이를 **증명**이라고 함)을 제공할 수 있습니다. 압축 NFT가 업데이트되거나 전송될 때마다, 관련된 리프와 그 증명이 변경됩니다.

{% diagram %}

{% node #root label="루트 노드" theme="slate" /%}
{% node #root-hash label="해시" parent="root" x="56" y="40" theme="transparent" /%}
{% node #node-1 label="노드 1" parent="root" y="100" x="-200" theme="blue" /%}
{% node #node-1-hash label="해시" parent="node-1" x="42" y="40" theme="transparent" /%}
{% node #node-2 label="노드 2" parent="root" y="100" x="200" theme="mint" /%}

{% node #node-3 label="노드 3" parent="node-1" y="100" x="-100" theme="mint" /%}
{% node #node-4 label="노드 4" parent="node-1" y="100" x="100" theme="blue" /%}
{% node #node-4-hash label="해시" parent="node-4" x="42" y="40" theme="transparent" /%}
{% node #node-5 label="노드 5" parent="node-2" y="100" x="-100" /%}
{% node #node-6 label="노드 6" parent="node-2" y="100" x="100" /%}

{% node #leaf-1 label="리프 1" parent="node-3" y="100" x="-45" /%}
{% node #leaf-2 label="리프 2" parent="node-3" y="100" x="55" /%}
{% node #leaf-3 label="리프 3" parent="node-4" y="100" x="-45" theme="blue" /%}
{% node #leaf-4 label="리프 4" parent="node-4" y="100" x="55" theme="mint" /%}
{% node #leaf-5 label="리프 5" parent="node-5" y="100" x="-45" /%}
{% node #leaf-6 label="리프 6" parent="node-5" y="100" x="55" /%}
{% node #leaf-7 label="리프 7" parent="node-6" y="100" x="-45" /%}
{% node #leaf-8 label="리프 8" parent="node-6" y="100" x="55" /%}
{% node #nft label="NFT 데이터" parent="leaf-3" y="100" x="-12" theme="blue" /%}

{% node #proof-1 label="리프 4" parent="nft" x="200" theme="mint" /%}
{% node #proof-2 label="노드 3" parent="proof-1" x="90" theme="mint" /%}
{% node #proof-3 label="노드 2" parent="proof-2" x="97" theme="mint" /%}
{% node #proof-legend label="증명" parent="proof-1" x="-6" y="-20" theme="transparent" /%}

{% edge from="node-1" to="root" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-2" to="root" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}

{% edge from="node-3" to="node-1" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="node-4" to="node-1" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-6" to="node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="node-5" to="node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="node-4" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="leaf-3" to="node-4" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="leaf-5" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="nft" to="leaf-3" fromPosition="top" toPosition="bottom" theme="blue" animated=true label="해시" /%}

{% /diagram %}

따라서 Merkle 트리는 주어진 압축 NFT가 존재하는지 누구나 확인할 수 있는 온체인 구조 역할을 합니다. NFT 데이터를 저장하지 않기 때문에 매우 확장 가능합니다.

이는 중요한 질문으로 이어집니다: NFT 데이터는 어디에 저장되나요?

## Metaplex DAS API

새로운 압축 NFT를 발행할 때, 그 데이터는 해싱되어 Merkle 트리에 새로운 리프로 추가됩니다. 하지만 그게 전부가 아닙니다. 또한 전체 NFT 데이터는 압축 NFT를 생성한 트랜잭션에 저장됩니다. 마찬가지로, 압축 NFT가 업데이트되면 업데이트된 데이터가 다시 트랜잭션에 변경 로그로 저장됩니다. 따라서 데이터를 추적하는 계정은 없지만, 원장의 모든 이전 트랜잭션을 살펴보고 해당 정보를 찾을 수 있습니다.

{% diagram %}

{% node #tx-1 label="트랜잭션 1" /%}
{% node #tx-2 label="트랜잭션 2" parent="tx-1" y="50" /%}
{% node #tx-3 label="트랜잭션 3" parent="tx-2" y="50" /%}
{% node #tx-4 label="트랜잭션 4" parent="tx-3" y="50" /%}
{% node #tx-5 label="트랜잭션 5" parent="tx-4" y="50" /%}
{% node #tx-rest label="..." parent="tx-5" y="50" /%}

{% node #nft-1 label="초기 NFT 데이터" parent="tx-2" x="300" theme="blue" /%}
{% node #nft-2 label="NFT 데이터 변경 로그" parent="tx-3" x="300" theme="blue" /%}
{% node #nft-3 label="NFT 데이터 변경 로그" parent="tx-5" x="300" theme="blue" /%}

{% edge from="nft-1" to="tx-2" label="저장됨" /%}
{% edge from="nft-2" to="tx-3" label="저장됨" /%}
{% edge from="nft-3" to="tx-5" label="저장됨" /%}

{% /diagram %}

하나의 NFT 데이터를 가져오기 위해 매번 수백만 개의 트랜잭션을 탐색하는 것은 최상의 사용자 경험이 아닙니다. 따라서 압축 NFT는 최종 사용자로부터 이를 추상화하기 위해 실시간으로 해당 정보를 인덱싱하는 일부 RPC에 의존합니다. 압축 NFT를 가져올 수 있게 하는 결과 RPC API를 **Metaplex DAS API**라고 부릅니다.

모든 RPC가 DAS API를 지원하는 것은 아닙니다. 따라서 애플리케이션에서 압축 NFT를 사용할 때 적절한 RPC를 선택하기 위해 ["Metaplex DAS API RPCs"](/rpc-providers) 페이지를 참조하는 것이 좋습니다.

이에 대해서는 고급 ["NFT 데이터 저장 및 인덱싱"](/bubblegum/stored-nft-data) 가이드에서 더 자세히 다룹니다.

## 기능

NFT 데이터가 계정 내부에 존재하지 않더라도 압축 NFT에 대해 다양한 작업을 수행할 수 있습니다. 이는 현재 NFT 데이터를 요청하고 해싱된 리프가 Merkle 트리에서 유효한지 확인함으로써 가능합니다. 따라서 압축 NFT에서 다음 작업을 수행할 수 있습니다:

- 관련 컬렉션이 있거나 없는 [cNFT 발행](/bubblegum/mint-cnfts).
- [cNFT 전송](/bubblegum/transfer-cnfts).
- [cNFT 데이터 업데이트](/bubblegum/update-cnfts).
- [cNFT 소각](/bubblegum/burn-cnfts).
- [cNFT를 일반 NFT로 압축 해제](/bubblegum/decompress-cnfts). 이는 기존 스마트 컨트랙트와의 상호 운용성을 가능하게 하지만 렌트 수수료가 있는 온체인 계정을 생성합니다.
- [cNFT 위임](/bubblegum/delegate-cnfts).
- [cNFT 컬렉션 검증 및 검증 취소](/bubblegum/verify-collections).
- [cNFT 크리에이터 검증 및 검증 취소](/bubblegum/verify-creators).

## 다음 단계

이제 압축 NFT가 어떻게 작동하는지 높은 수준에서 알게 되었으므로, 압축 NFT와 상호작용하는 데 사용할 수 있는 다양한 언어/프레임워크를 열거하는 [시작하기](/bubblegum/getting-started) 페이지를 확인하는 것이 좋습니다. 그 후, 다양한 [기능 페이지](/bubblegum/create-trees)를 사용하여 cNFT에서 수행할 수 있는 특정 작업에 대해 자세히 알아볼 수 있습니다. 마지막으로, [고급 가이드](/bubblegum/concurrent-merkle-trees)도 cNFT와 Merkle 트리에 대한 지식을 심화시킬 수 있습니다.
