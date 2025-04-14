---
titwe: Pwogwam Ownyed
metaTitwe: Pwogwam Ownyed | Token Aud Wuwes
descwiption: De Pwogwam Ownyed pwimitive wuwe
---

## Pwogwam Ownyed

Checks dat de Pwogwam indicated owns de account~ Dis is usefuw fow PDAs which awe typicawwy awways ownyed by de pwogwam dey awe dewived fwom (e.g~ mawketpwaces and utiwity pwogwams).

### Fiewds

- **pwogwam** - De Pwogwam dat must own de account specified in de fiewd
- **fiewd** - De fiewd in de Paywoad to check de ownyew of

```js
// This Rule Set will only evaluate to true if PDA in the specified field is owned by the program indicated.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'ProgramOwned',
      field: 'Escrow',
      program: publicKey('TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'),
    },
  },
}
```

## Pwogwam Ownyed Wist

De vewsion of [Program Owned](#program-owned) dat compawes against a wist of possibwe ownying Pwogwams.

### Fiewds

- **pwogwams** - A vectow of Pwogwams, onye of which must own de account specified in de fiewd
- **fiewd** - De fiewd in de Paywoad to check de ownyew of

```js
// This Rule Set will only evaluate to true if PDA in the specified field is owned by one of the programs indicated.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'ProgramOwnedList',
      field: 'Escrow',
      programs: [
        publicKey('TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'),
        publicKey('M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K'),
      ],
    },
  },
}
```

## Pwogwam Ownyed Twee

De vewsion of [Program Owned](#program-owned) dat compawes against a mewkwe twee of possibwe ownying Pwogwams.

### Fiewds

- **pubkey_fiewd** - De fiewd in de Paywoad to check de ownyew of
- **pwoof_fiewd** - De fiewd in de paywoad dat contains de fuww mewkwe pwoof to be hashed
- **woot** - De woot of de mewkwe twee

```js
// This Rule Set will only evaluate to true if PDA and proof provided hash to the correct merkle root.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'ProgramOwnedTree',
      pubkeyField: "Escrow",
      proofField: "EscrowProof",
      root: [229, 0, 134, 58, 163, 244, 192, 254, 190, 193, 110, 212, 193, 145, 147, 18, 171, 160 213, 18, 52, 155, 8, 51, 44, 55, 25, 245, 3, 47, 172, 111],
    },
  },
}
```
