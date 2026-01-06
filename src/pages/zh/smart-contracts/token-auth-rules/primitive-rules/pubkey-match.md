---
title: 公钥
metaTitle: 公钥 | Token Auth Rules
description: 公钥原始规则
---

## 公钥匹配
检查指定的公钥是否与特定公钥匹配。例如，当只有特定人员应被授予对NFT执行操作的访问权限时，可以使用此规则。

### 字段
* **pubkey** - 要比较的公钥
* **field** - 指定负载中要检查哪个公钥的字段

```js
// 此规则集仅在转移目标与公钥匹配时才评估为true。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'PubkeyMatch',
      field: 'Destination',
      publicKey: publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'),
    },
  },
}
```

## 公钥列表匹配
[公钥匹配](#公钥匹配)的版本，检查公钥是否包含在可能公钥的列表中。例如，此规则可用于构建允许与代币交互的用户白名单。

### 字段
* **pubkeys** - 要比较的公钥列表
* **field** - 指定负载中要检查哪个公钥的字段

```js
// 此规则集仅在转移目标与公钥之一匹配时才评估为true。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'PubkeyListMatch',
      field: 'Destination',
      publicKeys: [publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'), publicKey('6twkdkDaF3xANuvpUQvENSLhtNmPxzYAEu8qUKcVkWwy')],
    },
  },
}
```

## 公钥树匹配
[公钥匹配](#公钥匹配)的版本，检查公钥是否包含在可能公钥的默克尔树中。例如，此规则可用于构建允许与代币交互的非常大的用户白名单。

### 字段
* **pubkey_field** - 负载中包含要检查的公钥的字段
* **proof_field** - 负载中包含要哈希的完整默克尔证明的字段
* **root** - 默克尔树的根

```js
// 此规则集仅在转移目标和证明哈希到默克尔根时才评估为true。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'PubkeyTreeMatch',
      pubkeyField: 'Destination',
      proofField: 'DestinationProof',
      root: [229, 0, 134, 58, 163, 244, 192, 254, 190, 193, 110, 212, 193, 145, 147, 18, 171, 160 213, 18, 52, 155, 8, 51, 44, 55, 25, 245, 3, 47, 172, 111],
    },
  },
}
```
