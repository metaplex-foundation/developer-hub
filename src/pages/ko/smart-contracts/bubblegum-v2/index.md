---
title: 개요
metaTitle: 개요 | Bubblegum V2
description: Bubblegum V2와 압축된 NFT에 대한 고수준 개요를 제공합니다.
---

Bubblegum V2는 Solana에서 압축된 NFT(cNFT)를 생성하고 상호 작용하기 위한 Metaplex Protocol 프로그램의 최신 반복입니다. 대규모 운영을 위해 구축된 Bubblegum V2는 원본 Bubblegum의 모든 장점을 유지하면서 강력한 새 기능을 도입합니다. 압축된 NFT는 온체인에서 데이터를 저장하는 방식을 재고함으로써 NFT 생성을 새로운 규모로 확장할 수 있게 합니다. {% .lead %}

{% callout %}
Please note that certain Bubblegum V2 instructions will require protocol fees. Please review the [Protocol Fees](/protocol-fees) page for up-to-date information.
{% /callout %}

{% protocol-fees program="bubblegum-v2" /%}

{% quick-links %}

{% quick-link title="시작하기" icon="InboxArrowDown" href="/ko/bubblegum-v2/sdk" description="원하는 언어나 라이브러리를 찾아 압축된 NFT를 시작하세요." /%}

{% quick-link title="API 참조" icon="CodeBracketSquare" href="https://mpl-bubblegum.typedoc.metaplex.com/" target="_blank" description="특정한 것을 찾고 계신가요? API 참조를 살펴보고 답을 찾아보세요." /%}

{% /quick-links %}

## Bubblegum V2의 새로운 기능

Bubblegum V2는 원본 Bubblegum 프로그램의 기반 위에 구축되면서 여러 강력한 새 기능을 도입합니다:

- **동결 및 해동 기능**: 두 가지 유형의 동결/해동이 가능합니다: 1) cNFT 소유자는 자산 수준 제어를 위해 리프 위임자에게 동결 권한을 위임할 수 있어 특정 이벤트 중 전송을 방지하거나 베스팅 메커니즘을 구현하는 등 다양한 사용 사례에 유연성을 제공합니다. 2) 컬렉션 생성 시 `PermanentFreezeDelegate` 플러그인이 활성화된 경우, 프로젝트 제작자는 컬렉션 전체 제어를 위해 영구 동결 위임자를 통해 cNFT를 동결하고 해동할 수 있습니다
- **MPL-Core 컬렉션 통합**: Bubblegum V2 NFT는 이제 토큰 메타데이터 컬렉션에 제한되지 않고 MPL-Core 컬렉션에 추가될 수 있어 더 넓은 Metaplex 생태계와의 유연성과 통합을 제공합니다.
- **로열티 강제**: Bubblegum V2는 [MPL-Core](/smart-contracts/core) 컬렉션을 사용하므로 `ProgramDenyList`를 사용하여 cNFT에 로열티를 강제할 수 있습니다.
- **소울바운드 NFT**: cNFT는 이제 소울바운드(양도 불가능)로 만들 수 있어 소유자의 지갑에 영구적으로 바인딩됩니다. 이는 자격증명, 참석 증명, 신원 확인 등에 완벽합니다. 컬렉션 생성 시 `PermanentFreezeDelegate` 플러그인이 활성화되어야 합니다.
- **영구 전송 허용**: 컬렉션에서 `PermanentTransferDelegate` 플러그인이 활성화된 경우 영구 전송 위임자는 리프 소유자의 상호 작용 없이 cNFT를 새 소유자에게 전송할 수 있습니다.
- **권한에 의한 소각**: 컬렉션에 `PermanentBurnDelegate` 플러그인이 활성화된 경우, 위임자는 리프 소유자의 서명 없이 NFT를 소각할 수 있습니다.
- **속성**: MPL-Core `attributes` 플러그인을 사용하여 컬렉션 수준에서 속성 데이터를 추가할 수 있습니다.

위 기능들이 작동하도록 하기 위해 Bubblegum V2는 새로운 리프 스키마(`LeafSchemaV2`)를 도입합니다. Bubblegum V2에서 사용되는 리프에 대해 더 자세히 알아보려면 다음 섹션을 확인하세요.

## LeafSchemaV2

Bubblegum V2는 추가 기능을 지원하면서 이전 버전과의 호환성을 유지하는 새로운 리프 스키마(LeafSchemaV2)를 도입합니다. 이 새로운 스키마는 다음을 가능하게 합니다:

- 기존 토큰 메타데이터 대신 MPL-Core 컬렉션과의 통합
- 동결/해동 기능 지원
- 소울바운드 기능 활성화

프로젝트는 요구 사항에 따라 레거시 Bubblegum을 사용한 원본 리프 스키마나 Bubblegum V2를 사용한 새 v2 스키마를 선택할 수 있습니다.

새로운 `LeafSchemaV2`를 사용하려면 [`createTreeV2` 명령](/ko/smart-contracts/bubblegum-v2/create-trees)을 사용하여 생성해야 하는 V2 머클 트리를 사용해야 합니다. V1 머클 트리는 새로운 리프 스키마를 지원하지 않으며 V2 머클 트리는 V1 리프와 호환되지 않습니다.

## 머클 트리, 리프 및 증명

압축된 NFT는 **머클 트리**의 맥락에서만 존재합니다. 머클 트리가 무엇인지는 [전용 고급 가이드](/ko/smart-contracts/bubblegum-v2/concurrent-merkle-trees)에서 설명하지만, 이 개요에서는 머클 트리를 **리프**라고 부르는 해시의 컬렉션으로 생각할 수 있습니다. 각 리프는 [압축된 NFT의 데이터를 해싱](/ko/smart-contracts/bubblegum-v2/hashed-nft-data)하여 얻어집니다.

머클 트리의 각 리프에 대해 **증명**이라고 하는 해시 목록을 제공할 수 있습니다. 이를 통해 누구든지 주어진 리프가 해당 트리의 일부임을 확인할 수 있습니다. 압축된 NFT가 업데이트되거나 전송될 때마다 연관된 리프가 변경되고 증명도 마찬가지입니다.

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

따라서 머클 트리는 주어진 압축된 NFT가 존재함을 누구든지 확인할 수 있는 온체인 구조 역할을 합니다. NFT 데이터를 저장하지 않고도 이를 수행하여 확장성을 제공합니다.

이는 중요한 질문으로 이어집니다: NFT 데이터는 어디에 저장되나요?

## Metaplex DAS API

새로운 압축된 NFT를 민팅할 때 해당 데이터가 해싱되어 머클 트리에 새로운 리프로 추가됩니다. 하지만 더 있습니다. 추가로 전체 NFT 데이터가 압축된 NFT를 생성한 트랜잭션에 저장됩니다. 마찬가지로 압축된 NFT가 업데이트되면 업데이트된 데이터가 다시 한 번 변경 로그로 트랜잭션에 저장됩니다. 따라서 해당 데이터를 추적하는 계정은 없지만 원장의 모든 이전 트랜잭션을 살펴보고 해당 정보를 찾을 수 있습니다.

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

하나의 NFT 데이터를 가져오기 위해 수백만 개의 트랜잭션을 매번 크롤링하는 것은 최고의 사용자 경험이 아닙니다. 따라서 압축된 NFT는 일부 RPC가 실시간으로 해당 정보를 인덱싱하여 최종 사용자로부터 이를 추상화하는 것에 의존합니다. 압축된 NFT를 가져올 수 있게 하는 결과 RPC API를 **Metaplex DAS API**라고 합니다.

모든 RPC가 DAS API를 지원하는 것은 아닙니다. 따라서 애플리케이션에서 압축된 NFT를 사용할 때 적절한 RPC를 선택하려면 ["Metaplex DAS API RPC"](/ko/rpc-providers) 페이지에 관심이 있을 수 있습니다.

이에 대해 더 자세히 설명하는 고급 ["NFT 데이터 저장 및 인덱싱"](/ko/smart-contracts/bubblegum-v2/stored-nft-data) 가이드에서 다룹니다.

## 기능

NFT 데이터가 계정 내에 있지 않더라도 압축된 NFT에서 다양한 작업을 수행할 수 있습니다. 이는 현재 NFT 데이터를 요청하고 해싱된 리프가 머클 트리에서 유효한지 확인함으로써 가능합니다. 따라서 압축된 NFT에서 다음 작업을 수행할 수 있습니다:

- 연관된 컬렉션이 있거나 없이 [cNFT를 민팅](/ko/smart-contracts/bubblegum-v2/mint-cnfts)합니다.
- [cNFT를 전송](/ko/smart-contracts/bubblegum-v2/transfer-cnfts)합니다.
- [cNFT의 데이터나 컬렉션을 업데이트](/ko/smart-contracts/bubblegum-v2/update-cnfts)합니다.
- [cNFT를 소각](/ko/smart-contracts/bubblegum-v2/burn-cnfts)합니다.
- [cNFT를 위임](/ko/smart-contracts/bubblegum-v2/delegate-cnfts)합니다.
- [cNFT 컬렉션을 확인하고 확인 해제](/ko/smart-contracts/bubblegum-v2/verify-collections)합니다.
- [cNFT의 제작자를 확인하고 확인 해제](/ko/smart-contracts/bubblegum-v2/verify-creators)합니다.
- [cNFT를 동결하고 해동](/ko/smart-contracts/bubblegum-v2/freeze-cnfts)합니다.
- [cNFT를 소울바운드로 만듭니다](/ko/smart-contracts/bubblegum-v2/freeze-cnfts#create-a-soulbound-c-nft).

## 다음 단계

압축된 NFT가 높은 수준에서 어떻게 작동하는지와 Bubblegum V2의 새로운 기능을 알았으니 압축된 NFT와 상호 작용하는 데 사용할 수 있는 다양한 언어/프레임워크를 열거하는 [시작하기](/ko/smart-contracts/bubblegum-v2/sdk) 페이지를 확인하는 것을 권장합니다. 그 후 다양한 [기능 페이지](/ko/smart-contracts/bubblegum-v2/create-trees)를 사용하여 cNFT에서 수행할 수 있는 특정 작업에 대해 더 자세히 알아볼 수 있습니다. 마지막으로 cNFT와 머클 트리에 대한 지식을 깊게 하기 위해 [고급 가이드](/ko/smart-contracts/bubblegum-v2/concurrent-merkle-trees)도 사용할 수 있습니다.