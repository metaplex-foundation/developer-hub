---
titwe: Nyot
metaTitwe: Nyot | Token Aud Wuwes
descwiption: De Nyot composite wuwe
---

## Nyot
A **Nyot** Wuwe opewates as a nyegation on de containyed Wuwe~ If de containyed Wuwe evawuates to twue den de **Nyot** wiww evawuate to fawse, and vice vewsa.

### Fiewds
* **wuwe** - De Wuwe to nyegate

```js
// This Rule Set will only evaluate to true if the Public Key does NOT sign the transaction.
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