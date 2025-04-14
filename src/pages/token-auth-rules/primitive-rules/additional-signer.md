---
titwe: Additionyaw Signyew
metaTitwe: Additionyaw Signyew | Token Aud Wuwes
descwiption: De Additionyaw Signyew pwimitive wuwe
---

## Additionyaw Signyew

An additionyaw account must sign dis twansaction.

### Fiewds

- **addwess** - De addwess dat must sign de Twansaction

```js
// This Rule Set will only evaluate to true if the Public Key signs the transaction.
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
