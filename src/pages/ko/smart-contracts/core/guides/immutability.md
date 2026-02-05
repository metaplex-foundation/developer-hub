---
title: MPL Core의 불변성
metaTitle: MPL Core의 불변성 | Core 가이드
description: 이 가이드에서는 MPL Core의 다양한 불변성 레이어에 대해 설명합니다
updated: '01-31-2026'
keywords:
  - immutable NFT
  - immutability
  - lock metadata
  - permanent NFT
about:
  - Immutability options
  - Metadata protection
  - Plugin immutability
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---
## 불변성이란?
디지털 에셋의 일반적인 맥락에서 불변성은 종종 토큰이나 NFT의 메타데이터를 지칭하는 데 사용됩니다. 과거에는 구매한 에셋이 미래에 변경되지 않도록 보장하기 위해 커뮤니티에서 이를 요청했습니다. MPL Core가 제공하는 추가 기능으로 인해 추가적인 불변성 기능을 더하는 것이 의미 있을 수 있습니다. 이 가이드는 이러한 다양한 옵션과 프로젝트의 요구에 맞게 디지털 에셋의 불변성을 조정하는 방법에 대한 정보를 제공하는 것을 목표로 합니다.
아래의 차이점을 이해하려면 일반적인 MPL Core [플러그인 기능](/smart-contracts/core/plugins)에 익숙해지는 것이 도움이 될 수 있습니다.
## MPL Core의 불변성 옵션
- **불변 메타데이터**: [immutableMetadata](/smart-contracts/core/plugins/immutableMetadata) 플러그인은 Asset 또는 전체 컬렉션의 이름과 URI를 변경 불가능하게 만들 수 있습니다.
- **새 플러그인 추가 금지**: Core는 [addBlocker](/smart-contracts/core/plugins/addBlocker) 플러그인을 사용하여 크리에이터가 에셋에 추가 플러그인을 추가하는 것을 금지할 수 있습니다. 이 플러그인이 없으면 update authority는 로열티 플러그인과 같은 Authority Managed 플러그인을 추가할 수 있습니다.
- **플러그인 수준 불변성**: 일부 플러그인은 소유자나 update authority와 다른 authority를 설정할 수 있습니다. 이 authority를 제거하면 해당 특정 플러그인은 변경할 수 없게 됩니다. 이는 예를 들어 크리에이터가 에셋 소유자에게 로열티가 미래에 변경되지 않을 것임을 보장하고 싶을 때 유용합니다. authority 제거는 플러그인 생성 시 또는 업데이트 시 수행할 수 있습니다.
- **완전한 불변성**: Asset 또는 컬렉션의 update authority를 제거하면 authority 기반 작업을 더 이상 트리거할 수 없습니다. 여기에는 메타데이터 변경과 authority 기반 플러그인 추가가 포함됩니다. 완전한 불변성을 목표로 하는 경우 [일반 authority](/smart-contracts/core/update#making-a-core-asset-data-immutable) 외에도 플러그인의 authority도 제거되었는지 확인해야 합니다.
