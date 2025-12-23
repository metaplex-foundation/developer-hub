---
title: Pass
metaTitle: Pass | Token Auth Rules
description: Pass原始规则
---

## Pass
此规则在验证期间始终评估为true。

```js
// 此规则集始终评估为true。
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
