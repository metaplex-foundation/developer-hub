---
title: 金额
metaTitle: 金额 | Token Auth Rules
description: 金额原始规则
---

## 金额
正在转移的代币数量与一个金额进行比较（大于、小于或等于）。

### 字段
* **amount** - 要比较的金额
* **operator** - 要使用的比较操作：大于、小于、等于
* **field** - 要比较的负载字段

```js
// 此规则集仅在转移超过5个代币时才评估为true。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'Amount',
      field: 'Amount',
      operator: '>'
      amount: 5,
    },
  },
}
```
