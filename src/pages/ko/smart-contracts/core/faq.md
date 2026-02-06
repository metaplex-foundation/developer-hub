---
title: FAQ
metaTitle: FAQ | Core
description: Metaplex Core 프로토콜에 대한 자주 묻는 질문입니다.
updated: '01-31-2026'
keywords:
  - Core FAQ
  - Metaplex Core questions
  - NFT FAQ
  - mpl-core help
about:
  - Metaplex Core
  - NFT development
proficiencyLevel: Beginner
faqs:
  - q: Core에 온체인과 오프체인 데이터가 모두 있는 이유는 무엇인가요?
    a: 모든 것을 온체인에 저장하면 비용이 많이 들고(렌트 비용) 유연성이 떨어집니다. 데이터를 분할하면 온체인 보장과 오프체인 유연한 메타데이터를 모두 달성할 수 있습니다. 완전히 온체인 데이터가 필요하면 Inscriptions를 사용하세요.
  - q: Core 사용에 비용이 드나요?
    a: Core는 Asset 민팅당 0.0015 SOL의 수수료가 있습니다. 자세한 내용은 Protocol Fees 페이지를 참조하세요.
  - q: Soulbound Asset을 만들려면 어떻게 하나요?
    a: Permanent Freeze Delegate 플러그인 또는 Oracle 플러그인을 사용합니다. 구현 세부 사항은 Soulbound Assets 가이드를 참조하세요.
  - q: Asset을 불변으로 만들려면 어떻게 하나요?
    a: Core에는 여러 수준의 불변성이 있습니다. ImmutableMetadata 플러그인을 사용하거나 Update Authority를 제거합니다. 자세한 내용은 불변성 가이드를 참조하세요.
  - q: Token Metadata와 Core의 차이점은 무엇인가요?
    a: Core는 더 저렴하고(약 80% 비용 절감), 필요한 계정 수가 적고(1개 대 3개+), Compute Unit 사용량이 적으며, 분산된 위임자 대신 유연한 플러그인 시스템을 가지고 있습니다.
  - q: Core는 Editions를 지원하나요?
    a: 네, Edition과 Master Edition 플러그인을 사용합니다. 자세한 내용은 Print Editions 가이드를 참조하세요.
---
## Core Asset과 Collection 계정에 온체인과 오프체인 데이터가 모두 있는 이유는 무엇인가요?

Core Asset과 Collection 계정은 모두 온체인 데이터를 포함하지만, 추가 데이터를 제공하는 오프체인 JSON 파일을 가리키는 `URI` 속성도 포함합니다. 왜 그럴까요? 모든 것을 온체인에 저장할 수 없나요? 실제로 데이터를 온체인에 저장하는 데는 몇 가지 문제가 있습니다:

- 온체인 데이터 저장에는 렌트 지불이 필요합니다. Asset 설명과 같은 긴 텍스트를 포함할 수 있는 모든 데이터를 Asset 또는 Collection 계정 내에 저장해야 한다면 더 많은 바이트가 필요하고, 더 많은 바이트를 저장하면 더 많은 렌트를 지불해야 하므로 Asset 생성이 갑자기 훨씬 더 비싸집니다
- 온체인 데이터는 유연성이 떨어집니다. 특정 바이트 구조를 사용하여 계정 상태가 생성되면 역직렬화 문제를 일으킬 수 있으므로 쉽게 변경할 수 없습니다. 따라서 모든 것을 온체인에 저장해야 한다면 표준은 생태계의 요구에 맞게 발전하기가 훨씬 어려워집니다.
따라서 데이터를 온체인과 오프체인으로 분할하면 사용자는 두 가지 장점을 모두 얻을 수 있습니다. 온체인 데이터는 프로그램이 **사용자에 대한 보장과 기대를 생성**하는 데 사용할 수 있고, 오프체인 데이터는 **표준화되어 있지만 유연한 정보를 제공**하는 데 사용할 수 있습니다. 하지만 걱정하지 마세요. 완전히 온체인 데이터가 필요하다면 Metaplex는 이 목적을 위해 [Inscriptions](/inscription)도 제공합니다.

## Core 사용에 비용이 드나요?

Core는 현재 호출자에게 Asset 민팅당 0.0015 SOL이라는 매우 작은 수수료를 부과합니다. 자세한 내용은 [Protocol Fees](/protocol-fees) 페이지에서 확인할 수 있습니다.

## Soulbound Asset을 만들려면 어떻게 하나요?

Core Standard를 사용하면 Soulbound Asset을 만들 수 있습니다. 이를 달성하려면 [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) 플러그인 또는 [Oracle 플러그인](/ko/smart-contracts/core/external-plugins/oracle)을 사용할 수 있습니다.
자세한 내용은 [Soulbound Assets 가이드](/ko/smart-contracts/core/guides/create-soulbound-nft-asset)를 확인하세요!

## Asset을 불변으로 만들려면 어떻게 하나요?

Core에는 여러 수준의 "불변성"이 있습니다. 자세한 정보와 구현 방법은 [이 가이드](/ko/smart-contracts/core/guides/immutability)에서 확인할 수 있습니다.

## Metaplex Token Metadata와 Core의 차이점은 무엇인가요?

Core는 특히 NFT를 위해 설계된 완전히 새로운 표준이므로 몇 가지 주목할 만한 차이점이 있습니다. 예를 들어 Core는 더 저렴하고, 필요한 Compute Unit이 적으며, 개발자 관점에서 작업하기 더 쉬워야 합니다. 자세한 내용은 [차이점](/ko/smart-contracts/core/tm-differences) 페이지를 참조하세요.

## Core는 Editions를 지원하나요?

네! [Edition](/ko/smart-contracts/core/plugins/edition)과 [Master Edition](/ko/smart-contracts/core/plugins/master-edition) 플러그인을 사용합니다. 자세한 정보는 ["Editions 인쇄 방법" 가이드](/ko/smart-contracts/core/guides/print-editions)에서 확인할 수 있습니다.
