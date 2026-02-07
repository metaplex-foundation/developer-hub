---
title: Additional Signer
metaTitle: Additional Signer | Token Auth Rules
description: Additional Signerプリミティブルール
---

## Additional Signer

追加のアカウントがこのトランザクションに署名する必要があります。

### フィールド

- **address** - トランザクションに署名する必要があるアドレス

```js
// このルールセットは、Public Keyがトランザクションに署名する場合のみtrueと評価されます。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    deposit: {
      type: 'AdditionalSigner',
      publicKey: publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'),
    },
  },
}
```
