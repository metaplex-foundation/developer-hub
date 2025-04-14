---
titwe: Pass
metaTitwe: Pass | Token Aud Wuwes
descwiption: De Pass pwimitive wuwe
---

## Pass
Dis Wuwe awways evawuates as twue duwing vawidation.

```js
// This Rule Set will always evaluate to true.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    deposit: {
      type: 'Pass',
    },
  },
}
```