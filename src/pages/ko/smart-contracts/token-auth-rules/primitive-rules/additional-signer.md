---
title: Additional Signer
metaTitle: Additional Signer | Token Auth Rules
description: The Additional Signer primitive rule
---

## Additional Signer

추가 계정이 이 트랜잭션에 서명해야 합니다.

### 필드

- **address** - 트랜잭션에 서명해야 하는 주소

```js
// 이 Rule Set은 Public Key가 트랜잭션에 서명할 경우에만 true로 평가됩니다.
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
