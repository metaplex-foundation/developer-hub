---
title: Rule Sets 생성 또는 업데이트
metaTitle: Create/Update | Token Auth Rules
description: Rule Sets를 생성하고 업데이트하는 방법
---

## 소개

Token Authorization Rules Rule Set은 Token Auth Rules 프로그램이 소유한 PDA에 저장된 **Composite Rules**와 **Primitive Rules**의 컬렉션입니다.

## Rule Set 생성 또는 업데이트

Rule Set은 동일한 명령인 **CreateOrUpdate**에 대한 호출을 통해 생성되고 업데이트됩니다. 전달된 PDA가 초기화되지 않은 경우 프로그램이 이를 생성하고, 그렇지 않으면 전달된 Rule Set 데이터를 새 개정으로 하여 Rule Set을 업데이트합니다. 다음 매개변수가 전달되어야 합니다:

- **payer** - Rule Set의 권한자이자 렌트 수수료 지불자입니다.
- **ruleSetPda** - Rule Set이 저장될 PDA입니다. PDA는 "rule_set_state", **payer**, **rule_set_name**을 파생 시드로 사용합니다. **rule_set_name**은 32자 미만의 임의 문자열이 될 수 있습니다.
- **systemProgram** - 시스템 프로그램입니다.
- **ruleSetRevision** - Rule Set에 대한 직렬화된 데이터입니다.

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

// 이 데이터를 사용하여 새 rule set 계정을 생성할 때.
const ruleSetPda = findRuleSetPda(umi, { owner: owner.publicKey, name });
await createOrUpdateWithBufferV1(umi, {
  payer: owner,
  ruleSetPda,
  ruleSetRevision: some(revision),
}).sendAndConfirm(umi);
```

## 리소스

- [Token Auth Rule GitHub repository](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [TypeScript references for the JS client](https://mpl-token-auth-rules.typedoc.metaplex.com/)