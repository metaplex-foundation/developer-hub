---
title: 검증된 크리에이터
metaTitle: 검증된 크리에이터 | Token Metadata
description: Token Metadata에서 자산의 크리에이터를 검증하는 방법을 알아보세요
---

[컬렉션](/ko/smart-contracts/token-metadata/collections)과 마찬가지로, 자산의 크리에이터는 자산의 진정성을 보장하기 위해 검증되어야 합니다. {% .lead %}

`verified` 플래그가 `false`인 크리에이터는 누구에 의해서든 추가될 수 있으므로 신뢰할 수 없습니다. 반면에 `verified` 플래그가 `true`인 크리에이터는 해당 자산의 크리에이터로서 자신을 검증하는 트랜잭션에 서명했음이 보장됩니다.

아래 섹션에서는 자산의 크리에이터를 검증하고 검증을 해제하는 방법을 알아보겠습니다. 크리에이터를 검증하기 전에, 해당 크리에이터는 이미 자산의 **Metadata** 계정의 **Creators** 배열의 일부여야 한다는 점에 주목하세요. 이는 [자산을 민팅할 때](/ko/smart-contracts/token-metadata/mint) 수행할 수 있지만 [자산을 업데이트할 때](/ko/smart-contracts/token-metadata/update)도 수행할 수 있습니다.

## 크리에이터 검증

**Verify** 명령어를 사용하여 자산의 크리에이터를 검증할 수 있습니다. 동일한 명령어가 명령어에 다른 인수를 전달하면 컬렉션을 검증하는 데도 사용될 수 있다는 점에 주목하세요. 일부 SDK는 더 나은 개발자 경험을 제공하기 위해 이러한 명령어를 `verifyCreatorV1`과 `verifyCollectionV1`과 같은 여러 헬퍼로 분할합니다.

크리에이터를 검증하는 맥락에서 **Verify** 명령어가 요구하는 주요 속성은 다음과 같습니다:

- **Metadata**: 자산의 **Metadata** 계정 주소.
- **Authority**: 서명자로서 검증하려는 크리에이터.

다음은 Token Metadata에서 크리에이터를 검증하기 위해 우리의 SDK를 사용하는 방법입니다.

{% code-tabs-imported from="token-metadata/verify-creator" frameworks="umi,kit" /%}

## 크리에이터 검증 해제

상호적으로, **Unverify** 명령어를 사용하여 크리에이터의 `verified` 플래그를 `false`로 바꿀 수 있습니다. 이는 **Verify** 명령어와 동일한 속성을 받으며 같은 방식으로 사용할 수 있습니다.

{% code-tabs-imported from="token-metadata/unverify-creator" frameworks="umi,kit" /%}
