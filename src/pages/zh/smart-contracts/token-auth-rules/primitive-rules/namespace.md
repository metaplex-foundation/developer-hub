---
title: 命名空间
metaTitle: 命名空间 | Token Auth Rules
description: 命名空间原始规则
---

## 命名空间
**命名空间**规则是一个高级规则，用于减少规则集账户的大小和反序列化期间使用的计算单元。它也可用于跨多个[场景](/zh/smart-contracts/token-auth-rules/#场景)的通用规则。**命名空间**规则用于**操作**:**场景**对，并将指示评估应使用**操作**下的规则。例如，如果代币有`Transfer:Owner`、`Transfer:Delegate`和`Transfer:Authority`场景，但只有`Transfer:Delegate`需要特殊规则，**命名空间**规则可用于指示`Transfer:Owner`和`Transfer:Authority`都应使用`Transfer`下的通用规则。

```js
// 此规则集将评估'Transfer'下的Pass规则，对于'Transfer:Owner'和'Transfer:Authority'都为true，但仅在'Delegate'转移时存在额外签名者时才评估为true。
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
