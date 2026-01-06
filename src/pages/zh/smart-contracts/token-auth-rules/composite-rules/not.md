---
title: Not
metaTitle: Not | Token Auth Rules
description: Not组合规则
---

## Not
**Not**规则对包含的规则执行否定操作。如果包含的规则评估为true，则**Not**将评估为false，反之亦然。

### 字段
* **rule** - 要否定的规则

```js
// 此规则集仅在公钥不签署交易时才评估为true。
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
