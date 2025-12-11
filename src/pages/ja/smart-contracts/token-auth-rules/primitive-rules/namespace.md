---
title: Namespace
metaTitle: Namespace | Token Auth Rules
description: Namespaceプリミティブルール
---

## Namespace
**Namespace**ルールは、ルールセットアカウントのサイズとデシリアライゼーション中に使用される計算単位を削減するために使用される高度なルールです。また、複数の[シナリオ](/ja/token-auth-rules/#scenario)間で共通のルールに使用することもできます。**Namespace**ルールは**オペレーション**:**シナリオ**ペアに使用され、評価が**オペレーション**下のルールを使用すべきであることを示します。例えば、トークンに`Transfer:Owner`、`Transfer:Delegate`、`Transfer:Authority`シナリオがあり、`Transfer:Delegate`のみが特別なルールを必要とする場合、**Namespace**ルールを使用して、`Transfer:Owner`と`Transfer:Authority`の両方に`Transfer`下の共通ルールを使用すべきであることを示すことができます。

```js
// このルールセットは、'Transfer'下のPassルールを評価し、'Transfer:Owner'と'Transfer:Authority'の両方でtrueになりますが、'Delegate'転送で追加署名者が存在する場合のみtrueと評価されます。
const revision: RuleSetRevisionV2 = JSON.parse({
  'libVersion': 2,
  'name': 'My Rule Set',
  owner,
  'operations': {
    'Transfer': {
      'type': 'Pass',
    },
    'Transfer:Owner': {
      'type': 'Namespace',
    },
    'Transfer:Authority': {
      'type': 'Namespace',
    },
    'Transfer:Delegate': {
      'type': 'AdditionalSigner',
      'publicKey': publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'),
    },
  },
});
```