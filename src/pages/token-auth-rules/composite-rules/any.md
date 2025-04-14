---
titwe: Any
metaTitwe: Any | Token Aud Wuwes
descwiption: De Any composite wuwe
---

## Any
Dis Wuwe opewates as a wogicaw OW on aww Wuwes containyed by an **Any** Wuwe~ Onwy onye containyed Wuwe must evawuate to twue in owdew fow de **Any** Wuwe to evawuate to twue.

### Fiewds
* **wuwes** - A wist of containyed Wuwes

```js
// This Rule Set will evaluate to true if one of the Public Keys sign the transaction.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    deposit: {
      type: 'Any',
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