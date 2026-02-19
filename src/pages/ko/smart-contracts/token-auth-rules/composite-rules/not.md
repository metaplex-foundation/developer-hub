---
title: Not
metaTitle: Not | Token Auth Rules
description: Not 복합 규칙
---

## Not
**Not** 규칙은 포함된 규칙에 대해 부정 연산을 수행합니다. 포함된 규칙이 true로 평가되면 **Not**은 false로 평가되고, 그 반대의 경우도 마찬가지입니다.

### 필드
* **rule** - 부정할 규칙

```js
// 이 규칙 세트는 공개 키가 트랜잭션에 서명하지 않은 경우에만 true로 평가됩니다.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    deposit: {
      type: 'Not',
      rules: [
        {
          type: 'AdditionalSigner',
          publicKey: publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'),
        },
      ],
    },
  },
}
```
