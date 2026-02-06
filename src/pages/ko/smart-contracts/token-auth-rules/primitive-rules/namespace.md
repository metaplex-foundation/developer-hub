---
title: Namespace
metaTitle: Namespace | Token Auth Rules
description: The Namespace primitive rule
---

## Namespace

**Namespace** 규칙은 Rule Set 계정의 크기와 역직렬화 중에 사용되는 컴퓨트 단위를 줄이는 데 사용되는 고급 규칙입니다. 또한 여러 [시나리오](/ko/smart-contracts/token-auth-rules/#scenario)에 걸친 공통 규칙에도 사용할 수 있습니다. **Namespace** 규칙은 **Operation**:**Scenario** 쌍에 사용되며 평가가 **Operation** 하위의 규칙을 사용해야 함을 나타냅니다. 예를 들어, 토큰에 `Transfer:Owner`, `Transfer:Delegate`, `Transfer:Authority` 시나리오가 있지만 `Transfer:Delegate`만 특별한 규칙이 필요한 경우, **Namespace** 규칙을 사용하여 `Transfer` 하위의 공통 규칙이 `Transfer:Owner`와 `Transfer:Authority` 모두에 사용되어야 함을 나타낼 수 있습니다.

```js
// 이 Rule Set은 'Transfer' 하위의 Pass 규칙을 평가하고 'Transfer:Owner'와 'Transfer:Authority' 모두에 대해 true가 되지만, 'Delegate' 전송에 대해서는 추가 서명자가 있을 경우에만 true로 평가됩니다.
const revision: RuleSetRevisionV2 = JSON.parse({
  'libVersion': 2,
  'name': 'My Rule Set',
  owner,
  'operations': {
    'Transfer': {
      'type': 'Pass',
    },
    'Transfer:Owner': {
      'type': 'Namespace',
    },
    'Transfer:Authority': {
      'type': 'Namespace',
    },
    'Transfer:Delegate': {
      'type': 'AdditionalSigner',
      'publicKey': publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'),
    },
  },
});
```
