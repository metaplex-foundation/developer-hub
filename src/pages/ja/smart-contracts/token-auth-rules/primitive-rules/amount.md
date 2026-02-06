---
title: Amount
metaTitle: Amount | Token Auth Rules
description: Amountプリミティブルール
---

## Amount

転送されるトークンの量が、指定された量と比較（より大きい、より小さい、または等しい）されます。

### フィールド

* **amount** - 比較対象の量
* **operator** - 使用する比較演算：より大きい、より小さい、等しい
* **field** - 比較するペイロードフィールド

```js
// このルールセットは、5個以上のトークンが転送される場合のみtrueと評価されます。
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
