---
title: Pass
metaTitle: Pass | Token Auth Rules
description: Passプリミティブルール
---

## Pass

このルールは検証中に常にtrueと評価されます。

```js
// このルールセットは常にtrueと評価されます。
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
