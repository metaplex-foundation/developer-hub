---
title: Any
metaTitle: Any | Token Auth Rules
description: Any组合规则
---

## Any
此规则对**Any**规则包含的所有规则执行逻辑OR操作。只需一个包含的规则评估为true，**Any**规则就能评估为true。

### 字段
* **rules** - 包含的规则列表

```js
// 此规则集在其中一个公钥签署交易时评估为true。
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
