---
title: All
metaTitle: All | Token Auth Rules
description: Allコンポジットルール
---

## All

このルールは、**All**ルールに含まれるすべてのルールに対して論理ANDとして動作します。**All**ルールがtrueと評価されるためには、含まれるすべてのルールがtrueと評価される必要があります。

### フィールド

- **rules** - 含まれるルールのリスト

```js
// このルールセットは、両方のPublic Keyがトランザクションに署名する場合のみtrueと評価されます。
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
