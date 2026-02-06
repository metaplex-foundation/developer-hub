---
title: 개요
metaTitle: 개요 | Token Auth Rules
description: NFT 권한에 대한 높은 수준의 개요를 제공합니다.
---
Token Authorization Rules (또는 Token Auth Rules)는 SPL Token에서 발생하는 명령의 권한을 평가하기 위한 고급 메타프로그래밍 도구입니다. 이 프로그램 자체는 특정 기준을 나타내는 Rules의 컬렉션인 Rule Sets를 생성하고 업데이트하는 데 사용될 수 있습니다.

## 소개

토큰 작업이 수행될 때, 프로그램은 명령 세부사항(예: 토큰 전송을 위한 대상 주소)과 함께 호출될 수 있으며, 이러한 세부사항은 Rule Set에 대해 검증됩니다. Rules가 유효하지 않은 것으로 평가되면 명령이 실패하고 전체 트랜잭션이 되돌려집니다. 이를 통해 토큰 작업을 Token Auth Rules 프로그램과 결합하는 전체 트랜잭션을 구축할 수 있으므로, 관련 Rule Set의 Rules가 위반되면 모든 트랜잭션과 포함된 토큰 작업이 되돌려집니다.

## 기능

[Create or Update Rule Sets](/ko/smart-contracts/token-auth-rules/create-or-update) - Rule Set 내용을 초기화하고 업데이트하는 데 사용되는 명령입니다.

[Rule Set Buffers](/ko/smart-contracts/token-auth-rules/buffers) - 큰 Rule Sets이 처리되는 방법입니다.

[Validate Rule Sets](/ko/smart-contracts/token-auth-rules/validate) - Rule Set이 검증되는 방법입니다.

## Rule 유형

인증 rules는 `validate()` 메서드를 구현하는 `Rule` 열거형의 변형입니다.

하나 이상의 원시 rules를 결합하여 생성되는 **Primitive Rules**와 **Composite Rules**가 있습니다.

**Primitive Rules**는 평가에 필요한 모든 계정이나 데이터를 저장하며, 런타임에 `validate()` 함수로 전달되는 계정과 잘 정의된 `Payload`를 기반으로 true 또는 false 출력을 생성합니다.

**Composite Rules**는 모든 원시 rules가 true를 반환하는지 또는 일부만 true를 반환하는지에 따라 true 또는 false를 반환합니다. Composite rules는 더 복잡한 부울 논리를 구현하는 상위 수준 composite rules로 결합될 수 있습니다. `Rule` 열거형의 재귀적 정의 때문에 최상위 composite rule에서 `validate()`를 호출하면 최상위에서 시작하여 구성 요소인 원시 rules까지 모든 수준에서 검증됩니다.

## Operation

Rule Set은 `HashMap` 데이터 구조를 기반으로 구축되며 토큰과 함께 사용될 수 있는 다양한 명령 유형(예: transfer, delegate, burn 등)에 대한 다양한 규칙 세트를 저장하기 위한 것입니다. Token Auth Rules는 이러한 다양한 명령에 대해 **Operation**이라는 용어를 사용하고 **Operations**는 `HashMap` 데이터 구조에서 키로 사용됩니다. 각 **Operation**은 서로 다른 관련 규칙 세트를 가질 수 있습니다.

### Scenario

**Scenarios**는 **Operations**에 대한 선택적 추가 사항이며 명령이 호출될 수 있는 더 구체적인 상황을 처리하는 데 사용됩니다. 데이터 형식 관점에서 **Operation**과 **Scenario** 조합은 콜론으로 구분된 두 개의 문자열 `<Operation>:<Scenario>`입니다. 예를 들어, Token Metadata는 Token Metadata에서 Token Auth Rules로의 호출에 대한 **Scenario**로 권한 유형을 사용합니다. Transfer **Operation**은 토큰의 소유자 또는 위임자에 의해 토큰에서 트리거될 수 있으며, Rule Set 관리자는 이러한 다른 시나리오가 다른 규칙에 의해 관리되기를 원할 수 있습니다. 이 특정 사용 사례를 처리하기 위해 **Scenario**를 사용하여 구분을 관리할 수 있습니다. 앞의 예에서 사용되는 두 `HashMap` 키는 `Transfer:Owner`와 `Transfer:Delegate`입니다.

여러 시나리오에서 동일한 규칙을 관리하는 방법에 대해서는 [Namespace](/ko/smart-contracts/token-auth-rules/primitive-rules/namespace)를 참조하십시오.

## Payload

Token Auth Rules 프로그램은 Rule Set에서 평가를 요청하는 프로그램으로부터 받은 페이로드 데이터에 의존합니다. `Payload`의 기본 데이터 구조는 `HashMap`이며, `Payload` 필드는 `HashMap` 키로 표현됩니다. 대부분의 Rules는 검증 시간에 조회를 수행할 수 있도록 미리 정의된 `Payload` 필드를 저장합니다.

`Payload`가 사용되는 방법에 대한 자세한 내용은 [Validate](/ko/smart-contracts/token-auth-rules/validate) 명령을 참조하십시오.

## 리소스

- [Token Auth Rule GitHub repository](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [TypeScript references for the JS client](https://mpl-token-auth-rules.typedoc.metaplex.com/)
