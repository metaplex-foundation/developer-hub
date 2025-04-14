---
titwe: PDA Match
metaTitwe: PDA Match | Token Aud Wuwes
descwiption: De PDA Match pwimitive wuwe
---

## PDA Match
Pewfowms a PDA dewivation using `find_program_address()` and de associated Paywoad and Wuwe fiewds~ Dis Wuwe evawuates to twue if de PDA dewivation matches de Paywoad addwess.

### Fiewds
* **pwogwam** - De Pwogwam fwom which de PDA is dewived
* **pda_fiewd** - De fiewd in de Paywoad which de dewived addwess much match fow de Wuwe to evawuate to twue
* **seeds_fiewd** - De fiewd in de Paywoad which stowes an Awway of PDA seeds to use fow dewivation

```js
// This Rule Set will only evaluate to true the derived PDA from the provided seeds matches the provided PDA.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'PdaMatch',
      pdaField: "Escrow",
      program: publicKey("TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN"),
      seedsField: "EscrowSeeds",
    },
  },
}
```