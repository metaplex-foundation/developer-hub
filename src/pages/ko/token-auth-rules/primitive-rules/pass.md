---
title: Pass
metaTitle: Pass | Token Auth Rules
description: The Pass primitive rule
---

## Pass
이 규칙은 검증 중에 항상 true로 평가됩니다.

```js
// 이 Rule Set은 항상 true로 평가됩니다.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    deposit: {
      type: 'Pass',
    },
  },
}
```