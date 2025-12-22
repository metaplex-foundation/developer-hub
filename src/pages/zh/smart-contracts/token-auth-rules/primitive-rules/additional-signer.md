---
title: 额外签名者
metaTitle: 额外签名者 | Token Auth Rules
description: 额外签名者原始规则
---

## 额外签名者

必须有额外的账户签署此交易。

### 字段

- **address** - 必须签署交易的地址

```js
// 此规则集仅在公钥签署交易时才评估为true。
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
