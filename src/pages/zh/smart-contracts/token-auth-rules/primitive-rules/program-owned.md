---
title: 程序拥有
metaTitle: 程序拥有 | Token Auth Rules
description: 程序拥有原始规则
---

## 程序拥有

检查指定的程序是否拥有该账户。这对于PDA很有用，因为PDA通常始终由派生它们的程序拥有（例如市场和实用程序）。

### 字段

- **program** - 必须拥有字段中指定账户的程序
- **field** - 负载中要检查所有者的字段

```js
// 此规则集仅在指定字段中的PDA由指定程序拥有时才评估为true。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'ProgramOwned',
      field: 'Escrow',
      program: publicKey('TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'),
    },
  },
}
```

## 程序拥有列表

[程序拥有](#程序拥有)的版本，与可能拥有程序的列表进行比较。

### 字段

- **programs** - 程序向量，其中一个必须拥有字段中指定的账户
- **field** - 负载中要检查所有者的字段

```js
// 此规则集仅在指定字段中的PDA由指定程序之一拥有时才评估为true。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'ProgramOwnedList',
      field: 'Escrow',
      programs: [
        publicKey('TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'),
        publicKey('M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K'),
      ],
    },
  },
}
```

## 程序拥有树

[程序拥有](#程序拥有)的版本，与可能拥有程序的默克尔树进行比较。

### 字段

- **pubkey_field** - 负载中要检查所有者的字段
- **proof_field** - 负载中包含要哈希的完整默克尔证明的字段
- **root** - 默克尔树的根

```js
// 此规则集仅在提供的PDA和证明哈希到正确的默克尔根时才评估为true。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'ProgramOwnedTree',
      pubkeyField: "Escrow",
      proofField: "EscrowProof",
      root: [229, 0, 134, 58, 163, 244, 192, 254, 190, 193, 110, 212, 193, 145, 147, 18, 171, 160 213, 18, 52, 155, 8, 51, 44, 55, 25, 245, 3, 47, 172, 111],
    },
  },
}
```
