---
title: RPC 제공자
metaTitle: RPC 제공자 | Developer Hub
description: Solana에서 사용 가능한 RPC 목록.
---

## 소개

Solana는 Devnet, Testnet 또는 Mainnet Beta의 세 가지 Solana 클러스터 중 하나에서 프로그램과 프로그램의 출력을 확인하는 작업을 담당하는 독립적인 노드를 사용합니다. 클러스터는 트랜잭션을 확인하기 위해 작동하는 밸리데이터 세트로 구성됩니다. 이들은 개인이 소유하고 운영합니다. 이러한 노드는 또한 데이터와 트랜잭션 기록을 저장할 책임이 있으며 이는 노드 간에 공유됩니다. 노드가 유효한 블록에 투표하는 데 사용되고 SOL이 밸리데이터 ID에 위임되면 노드는 밸리데이터 노드가 될 수 있으며 리더 노드가 될 수 있습니다. 밸리데이터가 되는 방법에 대한 정보는 [이 링크](https://solana.com/validators)에 있습니다.

모든 노드가 리더 노드가 되거나 블록을 확인하기 위해 투표할 수 있는 것은 아닙니다. 그들은 여전히 밸리데이터 노드의 다른 기능을 제공하지만 투표할 수 없기 때문에 주로 블록체인의 요청에 응답하는 데 사용됩니다. 이것이 RPC 노드입니다. RPC는 원격 프로시저 호출을 의미하며, 이러한 RPC 노드는 블록체인을 통해 트랜잭션을 보내는 데 사용됩니다.

Solana는 Devnet, Mainnet Beta 및 Testnet의 각 클러스터에 대해 하나씩 세 개의 공용 API 노드를 유지 관리합니다. 이러한 API 노드는 사용자가 클러스터에 연결할 수 있도록 합니다. Devnet에 연결하기 위해 사용자는 다음을 확인할 수 있습니다:

```
https://api.devnet.solana.com
```

이것은 Devnet용 노드이며 속도 제한이 있습니다.

Mainnet Beta 클러스터에서 많은 개발자들은 Solana의 공용 API 노드에서 사용할 수 없는 더 높은 속도 제한을 활용하기 위해 자체 프라이빗 RPC 노드를 사용하기로 선택합니다.

![](https://i.imgur.com/1GmCbcu.png#radius")

[Solana Docs](https://docs.solana.com/cluster/rpc-endpoints)의 위 그림에서 Mainnet Beta의 경우 mainnet api 노드를 사용할 때의 속도 제한을 볼 수 있습니다. Mainnet Node는 현재 [Metaplex DAS API](#metaplex-das-api)를 지원하지 않습니다.

RPC 노드의 몇 가지 기능을 정의한 다음 여러 옵션을 제시하겠습니다. 프로젝트의 필요에 따라 하나를 선택하는 것을 권장합니다.

## Metaplex DAS API

RPC의 또 다른 구별되는 특징은 [Metaplex DAS API](/ko/dev-tools/das-api)를 지원하는지 여부입니다. Metaplex DAS(Digital Asset Standard) API는 Solana의 디지털 자산과 상호 작용하기 위한 통합 인터페이스를 나타내며 표준(Token Metadata) 및 압축(Bubblegum) 자산을 모두 지원합니다. API는 RPC가 자산 데이터를 제공하기 위해 구현하는 메서드 세트를 정의합니다.

개발자에게 DAS API는 cNFT와 상호 작용하는 데 필요하지만 TM Assets 작업을 더 쉽고 빠르게 만들 수도 있습니다. 따라서 체인에서 읽을 때 사용자 경험을 가능한 한 빠르게 만들기 위해 DAS 지원이 있는 RPC 노드를 사용하는 것을 강력히 권장합니다.

DAS API에 대한 자세한 내용은 [전용 섹션](/ko/dev-tools/das-api)에서 확인할 수 있습니다.

## Archive 및 Nonarchive 노드

노드를 두 가지 범주로 나눌 수 있습니다. 첫 번째로 살펴볼 것은 Archive 노드입니다. 이들은 이전 블록의 정보를 저장할 수 있습니다. 이러한 아카이브 노드의 경우 이전 모든 블록에 대한 액세스를 여러 가지 방법으로 활용할 수 있습니다. 일부 장점에는 주소의 잔액 기록을 볼 수 있고 기록의 모든 상태를 볼 수 있는 것이 포함됩니다. 전체 기록 노드를 실행하는 데 높은 시스템 요구 사항이 있기 때문에 이 기능을 갖춘 프라이빗 노드를 사용할 수 있다는 것은 매우 유익합니다.

아카이브 노드와 달리 비아카이브 노드 또는 일반 노드는 100블록 이상의 이전 블록 중 일부에만 액세스할 수 있습니다. 이전에 아카이브 노드를 실행하는 데는 집약적인 요구 사항이 있다고 언급했지만 비아카이브 노드도 관리하기 어려울 수 있습니다. 이러한 이유로 사용자는 종종 프라이빗 RPC 제공자를 선택합니다. Solana에서 프라이빗 RPC를 사용하는 대부분의 사용 사례는 일반적으로 실제 SOL 토큰과 관련되고 속도 제한이 있을 가능성이 더 높기 때문에 Mainnet-beta 사용과 관련이 있습니다.

## 사용 가능한 RPC

다음 섹션에는 여러 RPC 제공자가 포함되어 있습니다.

{% callout type="note" %}
이 목록은 알파벳 순서입니다. 프로젝트의 필요에 가장 적합한 RPC 제공자를 선택하십시오. 누락된 제공자가 있으면 디스코드에서 알려주거나 PR을 제출하십시오.
{% /callout %}

### DAS 지원 RPC

- [Extrnode](https://docs.extrnode.com/das_api/)
- [Helius](https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api)
- [Hello Moon](https://docs.hellomoon.io/reference/rpc-endpoint-for-digital-asset-standard)
- [QuickNode](https://quicknode.com/)
- [Shyft](https://docs.shyft.to/solana-rpcs-das-api/compression-das-api)
- [Triton](https://docs.triton.one/rpc-pool/metaplex-digital-assets-api)

### DAS 미지원 RPC

- [Alchemy](https://alchemy.com/?a=metaplex)
- [Ankr](https://www.ankr.com/protocol/public/solana/)
- [Blockdaemon](https://blockdaemon.com/marketplace/solana/)
- [Chainstack](https://chainstack.com/build-better-with-solana/)
- [Figment](https://figment.io/)
- [GetBlock](https://getblock.io/)
- [NOWNodes](https://nownodes.io/)
- [Syndica](https://syndica.io/)

### 추가 정보

질문이 있거나 이 주제에 대해 더 자세히 알고 싶으시면 [Metaplex Discord](https://discord.gg/metaplex) 서버에 참여하여 문의하실 수 있습니다.
