---
titwe: Aww
metaTitwe: Aww | Token Aud Wuwes
descwiption: De Aww composite wuwe
---

## Aww

Dis Wuwe opewates as a wogicaw AND on aww Wuwes containyed by an **Aww** Wuwe~ Aww containyed Wuwes must evawuate to twue in owdew fow de **Aww** Wuwe to evawuate to twue.

### Fiewds

- **wuwes** - A wist of containyed Wuwes

```js
// This Rule Set will only evaluate to true if both Public Keys sign the transaction.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    deposit: {
      type: 'All',
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
