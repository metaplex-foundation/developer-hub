---
title: FAQ
metaTitle: FAQ | Core
description: Metaplex Core 프로토콜에 대한 자주 묻는 질문.
---

## Core Asset과 Collection 계정이 온체인 데이터와 오프체인 데이터를 모두 가지는 이유는 무엇인가요?

Core Asset과 Collection 계정은 모두 온체인 데이터를 포함하면서도, 동시에 추가 데이터를 제공하는 오프체인 JSON 파일을 가리키는 `URI` 속성도 포함합니다. 그 이유는 무엇일까요? 모든 것을 온체인에만 저장할 수는 없는 걸까요? 데이터를 온체인에 저장하는 것에는 몇 가지 문제가 있습니다:

- 온체인에 데이터를 저장하려면 렌트를 지불해야 합니다. Asset이나 Collection 계정 내에 모든 것을 저장해야 한다면, 여기에는 자산 설명과 같은 긴 텍스트가 포함될 수 있으며, 이는 훨씬 많은 바이트를 필요로 하고 Asset 생성 비용이 갑자기 많이 증가하게 됩니다. 더 많은 바이트를 저장한다는 것은 더 많은 렌트를 지불해야 한다는 의미이기 때문입니다.
- 온체인 데이터는 유연성이 떨어집니다. 특정 바이트 구조를 사용하여 계정 상태가 생성되면, 잠재적인 역직렬화 문제를 일으키지 않고는 쉽게 변경할 수 없습니다. 따라서 모든 것을 온체인에 저장해야 한다면, 생태계의 요구에 따라 표준을 발전시키기가 훨씬 어려워집니다.

따라서 데이터를 온체인 데이터와 오프체인 데이터로 분할하면 사용자가 두 세계의 장점을 모두 누릴 수 있습니다. 온체인 데이터는 프로그램이 **사용자를 위한 보증과 기대치를 생성하는 데** 사용될 수 있고, 오프체인 데이터는 **표준화되면서도 유연한 정보를 제공하는 데** 사용될 수 있습니다. 하지만 걱정하지 마세요. 데이터를 완전히 온체인에 저장하고 싶다면, Metaplex는 이러한 목적을 위해 [Inscriptions](/inscription)도 제공합니다.

## Core 사용에 비용이 있나요?

Core는 현재 호출자에게 Asset 민팅당 0.0015 SOL의 매우 적은 수수료를 부과합니다. 자세한 내용은 [Protocol Fees](/protocol-fees) 페이지에서 확인할 수 있습니다.

## Soulbound Asset을 어떻게 만드나요?

Core 표준을 사용하면 Soulbound Asset을 만들 수 있습니다. 이를 달성하려면 [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) 플러그인이나 [Oracle Plugin](/ko/smart-contracts/core/external-plugins/oracle)을 사용할 수 있습니다.

자세한 내용은 [Soulbound Assets 가이드](/ko/smart-contracts/core/guides/create-soulbound-nft-asset)를 확인하세요!

## Asset을 불변으로 설정하는 방법은?

Core에는 여러 수준의 "불변성"이 있습니다. 자세한 정보와 구현 방법은 [이 가이드](/ko/smart-contracts/core/guides/immutability)에서 확인할 수 있습니다.

## Metaplex Token Metadata와 Core의 차이점은 무엇인가요?

Core는 NFT를 위해 특별히 설계된 완전히 새로운 표준이므로 몇 가지 주목할 만한 차이점이 있습니다. 예를 들어 Core는 더 저렴하고 더 적은 Compute Units를 필요로 하며 개발자 관점에서 더 쉽게 작업할 수 있어야 합니다. 자세한 내용은 [차이점](/ko/smart-contracts/core/tm-differences) 페이지를 참조하세요.

## Core가 Editions를 지원하나요?

네! [Edition](/ko/smart-contracts/core/plugins/edition)과 [Master Edition](/ko/smart-contracts/core/plugins/master-edition) 플러그인을 사용하면 됩니다. ["Editions 인쇄 방법" 가이드](/ko/smart-contracts/core/guides/print-editions)에서 자세한 정보를 확인할 수 있습니다.