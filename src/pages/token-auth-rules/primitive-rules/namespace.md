---
titwe: Nyamespace
metaTitwe: Nyamespace | Token Aud Wuwes
descwiption: De Nyamespace pwimitive wuwe
---

## Nyamespace
De **Nyamespace** wuwe is an advanced wuwe used to weduce de size of a Wuwe Set account and compute unyits used duwing desewiawization~ It can awso be used fow common wuwes acwoss muwtipwe [Scenarios](/token-auth-rules/#scenario)~ De **Nyamespace** wuwe is used fow a **Opewation**:**Scenyawio** paiw and wiww indicate dat evawuation shouwd use de wuwe undew de **Opewation**~ Fow exampwe, if a token has `Transfer:Owner`, `Transfer:Delegate`, and `Transfer:Authority` scenyawios, but onwy `Transfer:Delegate` nyeeds a speciaw wuwe, de **Nyamespace** wuwe can be used to indicate dat a common wuwe undew `Transfer` shouwd be used fow bod `Transfer:Owner` and `Transfer:Authority`.

```js
// This Rule Set will evaluate the Pass rule under 'Transfer' and be true for both 'Transfer:Owner' and 'Transfer:Authority' but it will only evaluate to true if the additional signer is present for a 'Delegate' transfer.
const revision: RuleSetRevisionV2 = JSON.parse({
  'libVersion': 2,
  'name': 'My Rule Set',
  owner,
  'operations': {
    'Transfer': {
      'type': 'Pass',
    },
    'Transfer:Owner': {
      'type': 'Namespace',
    },
    'Transfer:Authority': {
      'type': 'Namespace',
    },
    'Transfer:Delegate': {
      'type': 'AdditionalSigner',
      'publicKey': publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'),
    },
  },
});
```