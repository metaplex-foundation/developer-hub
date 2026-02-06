---
title: PDA Match
metaTitle: PDA Match | Token Auth Rules
description: PDA Matchプリミティブルール
---

## PDA Match

`find_program_address()`と関連するペイロードおよびルールフィールドを使用してPDA導出を実行します。このルールは、PDA導出がペイロードアドレスと一致する場合にtrueと評価されます。

### フィールド

* **program** - PDAが導出されるプログラム
* **pda_field** - ルールがtrueと評価されるために導出されたアドレスが一致しなければならないペイロード内のフィールド
* **seeds_field** - 導出に使用するPDAシードの配列を格納するペイロード内のフィールド

```js
// このルールセットは、提供されたシードから導出されたPDAが提供されたPDAと一致する場合のみtrueと評価されます。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'PdaMatch',
      pdaField: "Escrow",
      program: publicKey("TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN"),
      seedsField: "EscrowSeeds",
    },
  },
}
```
