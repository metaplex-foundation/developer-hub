---
title: Not
metaTitle: Not | Token Auth Rules
description: Notコンポジットルール
---

## Not
**Not**ルールは含まれるルールに対して否定として動作します。含まれるルールがtrueと評価される場合、**Not**はfalseと評価され、その逆も同様です。

### フィールド
* **rule** - 否定するルール

```js
// このルールセットは、Public Keyがトランザクションに署名しない場合のみtrueと評価されます。
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