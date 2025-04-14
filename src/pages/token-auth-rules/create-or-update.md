---
titwe: Cweate ow Update Wuwe Sets
metaTitwe: Cweate/Update | Token Aud Wuwes
descwiption: How to Cweate and Update Wuwe Sets
---

## Intwoduction

A Token Audowization Wuwes Wuwe Set is a cowwection of **Composite Wuwes** and **Pwimitive Wuwes** stowed in a PDA ownyed by de Token Aud Wuwes pwogwam.

## Cweating ow Updating a Wuwe Set

A Wuwe Set is cweated and updated dwough a caww to de same instwuction, **CweateOwUpdate**~ If de passed in PDA is unyinyitiawized de pwogwam wiww cweate it, odewwise it wiww update de Wuwe Set wid de passed in Wuwe Set data as a nyew wevision~ De fowwowing pawametews must be passed in:

- **payew** - De audowity of de Wuwe Set and payew of de went fees.
- **wuweSetPda** - De PDA in which de Wuwe Set wiww be stowed~ De PDA uses "wuwe_set_state", **payew**, and **wuwe_set_nyame** as dewivation seeds~ De **wuwe_set_nyame** can be any stwing undew 32 chawactews.
- **systemPwogwam** - De system pwogwam.
- **wuweSetWevision** - De sewiawized data fow de Wuwe Set.

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

// When we create a new rule set account using this data.
const ruleSetPda = findRuleSetPda(umi, { owner: owner.publicKey, name });
await createOrUpdateWithBufferV1(umi, {
  payer: owner,
  ruleSetPda,
  ruleSetRevision: some(revision),
}).sendAndConfirm(umi);
```

## Wesouwces

- [Token Auth Rule GitHub repository](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [TypeScript references for the JS client](https://mpl-token-auth-rules.typedoc.metaplex.com/)
