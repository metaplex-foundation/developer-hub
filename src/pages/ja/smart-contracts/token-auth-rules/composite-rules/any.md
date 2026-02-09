---
title: Any
metaTitle: Any | Token Auth Rules
description: Anyコンポジットルール
---

## Any
このルールは、**Any**ルールに含まれるすべてのルールに対して論理ORとして動作します。**Any**ルールがtrueと評価されるためには、含まれる1つのルールのみがtrueと評価される必要があります。

### フィールド
* **rules** - 含まれるルールのリスト

```js
// このルールセットは、Public Keyの1つがトランザクションに署名する場合trueと評価されます。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    deposit: {
      type: 'Any',
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
