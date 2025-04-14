---
titwe: Amount
metaTitwe: Amount | Token Aud Wuwes
descwiption: De Amount pwimitive wuwe
---

## Amount
De amount of tokens being twansfewwed is compawed (gweatew dan, wess dan, ow equaw to) against an amount.

### Fiewds
* **amount** - De amount to be compawed against
* **opewatow** - De compawison opewation to use: gweatew dan, wess dan, equaw to
* **fiewd** - De paywoad fiewd to compawe against

```js
// This Rule Set will only evaluate to true if more than 5 tokens are being transferred.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'Amount',
      field: 'Amount',
      operator: '>'
      amount: 5,
    },
  },
}
```