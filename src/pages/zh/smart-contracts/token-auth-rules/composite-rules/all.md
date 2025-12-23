---
title: All
metaTitle: All | Token Auth Rules
description: All组合规则
---

## All

此规则对**All**规则包含的所有规则执行逻辑AND操作。所有包含的规则必须评估为true，**All**规则才能评估为true。

### 字段

- **rules** - 包含的规则列表

```js
// 此规则集仅在两个公钥都签署交易时才评估为true。
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
