---
title: All
metaTitle: All | Token Auth Rules
description: All 복합 규칙
---

## All

이 규칙은 **All** 규칙에 포함된 모든 규칙에 대해 논리적 AND 연산을 수행합니다. **All** 규칙이 true로 평가되려면 포함된 모든 규칙이 true로 평가되어야 합니다.

### 필드

- **rules** - 포함된 규칙들의 목록

```js
// 이 규칙 세트는 두 공개 키가 모두 트랜잭션에 서명한 경우에만 true로 평가됩니다.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    deposit: {
      type: 'All',
      rules: [
        {
          type: 'AdditionalSigner',
          publicKey: publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'),
        },
        {
          type: 'AdditionalSigner',
          publicKey: publicKey('6twkdkDaF3xANuvpUQvENSLhtNmPxzYAEu8qUKcVkWwy'),
        },
      ],
    },
  },
}
```
