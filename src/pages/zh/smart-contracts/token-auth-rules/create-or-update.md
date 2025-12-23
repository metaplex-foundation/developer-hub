---
title: 创建或更新规则集
metaTitle: 创建/更新 | Token Auth Rules
description: 如何创建和更新规则集
---

## 介绍

Token Authorization Rules规则集是存储在Token Auth Rules程序拥有的PDA中的**组合规则**和**原始规则**的集合。

## 创建或更新规则集

规则集通过调用同一指令**CreateOrUpdate**来创建和更新。如果传入的PDA未初始化，程序将创建它，否则将使用传入的规则集数据作为新修订版本更新规则集。必须传入以下参数：

- **payer** - 规则集的权限和租金费用的支付者。
- **ruleSetPda** - 将存储规则集的PDA。PDA使用"rule_set_state"、**payer**和**rule_set_name**作为派生种子。**rule_set_name**可以是32个字符以下的任何字符串。
- **systemProgram** - 系统程序。
- **ruleSetRevision** - 规则集的序列化数据。

```ts
import {
  RuleSetRevisionV2,
  createOrUpdateV1,
  findRuleSetPda,
  programOwnedV2,
} from '@metaplex-foundation/mpl-token-auth-rules';

const owner = umi.identity;
const program = generateSigner(umi).publicKey;
const name = 'transfer_test';
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name,
  owner: owner.publicKey,
  operations: {
    Transfer: programOwnedV2('Destination', program),
  },
};

// 当我们使用此数据创建新的规则集账户时。
const ruleSetPda = findRuleSetPda(umi, { owner: owner.publicKey, name });
await createOrUpdateWithBufferV1(umi, {
  payer: owner,
  ruleSetPda,
  ruleSetRevision: some(revision),
}).sendAndConfirm(umi);
```

## 资源

- [Token Auth Rule GitHub仓库](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [JS客户端的TypeScript参考](https://mpl-token-auth-rules.typedoc.metaplex.com/)
