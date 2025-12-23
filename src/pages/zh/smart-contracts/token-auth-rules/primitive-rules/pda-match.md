---
title: PDA匹配
metaTitle: PDA匹配 | Token Auth Rules
description: PDA匹配原始规则
---

## PDA匹配
使用`find_program_address()`和关联的负载和规则字段执行PDA派生。如果PDA派生与负载地址匹配，此规则评估为true。

### 字段
* **program** - 从中派生PDA的程序
* **pda_field** - 负载中的字段，派生地址必须与之匹配才能使规则评估为true
* **seeds_field** - 负载中存储用于派生的PDA种子数组的字段

```js
// 此规则集仅在从提供的种子派生的PDA与提供的PDA匹配时才评估为true。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'PdaMatch',
      pdaField: "Escrow",
      program: publicKey("TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN"),
      seedsField: "EscrowSeeds",
    },
  },
}
```
