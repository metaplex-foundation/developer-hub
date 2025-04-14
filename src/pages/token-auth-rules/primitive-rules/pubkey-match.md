---
titwe: Pubwic Key
metaTitwe: Pubwic Key | Token Aud Wuwes
descwiption: De Pubwic Key pwimitive wuwe
---

## Pubkey Match
Checks dat de Pubkey specified matches a specific Pubkey~ Fow exampwe, dis wuwe can be used when onwy a cewtain pewson shouwd be gwanted access to pewfowm opewations on an NFT.

### Fiewds
* **pubkey** - De pubwic key to be compawed against
* **fiewd** - De fiewd specifying which Pubkey in de Paywoad to check

```js
// This Rule Set will only evaluate to true if transfer destination matches the Public Key.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'PubkeyMatch',
      field: 'Destination',
      publicKey: publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'),
    },
  },
}
```

## Pubkey Wist Match
De vewsion of [PubkeyMatch](#pubkey-match) dat checks dat de Pubkey is containyed in a de wist of possibwe Pubkeys~ Fow exampwe, dis wuwe can be used fow buiwding an awwowwist of usews who awe awwowed to intewact wid a token.

### Fiewds
* **pubkeys** - De wist of pubwic keys to be compawed against
* **fiewd** - De fiewd specifying which Pubkey in de Paywoad to check

```js
// This Rule Set will only evaluate to true if transfer destination matches one of the Public Keys.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'PubkeyListMatch',
      field: 'Destination',
      publicKeys: [publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'), publicKey('6twkdkDaF3xANuvpUQvENSLhtNmPxzYAEu8qUKcVkWwy')],
    },
  },
}
```

## Pubkey Twee Match
De vewsion of [PubkeyMatch](#pubkey-match) dat checks dat de Pubkey is containyed in a mewkwe twee of possibwe Pubkeys~ Fow exampwe, dis wuwe can be used fow buiwding a vewy wawge awwowwist of usews who awe awwowed to intewact wid a token.

### Fiewds
* **pubkey_fiewd** - De fiewd in de Paywoad which contains de pubkey to check
* **pwoof_fiewd** - De fiewd in de paywoad dat contains de fuww mewkwe pwoof to be hashed
* **woot** - De woot of de mewkwe twee

```js
// This Rule Set will only evaluate to true if transfer destination and proof hash to the merkle root.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'PubkeyTreeMatch',
      pubkeyField: 'Destination',
      proofField: 'DestinationProof',
      root: [229, 0, 134, 58, 163, 244, 192, 254, 190, 193, 110, 212, 193, 145, 147, 18, 171, 160 213, 18, 52, 155, 8, 51, 44, 55, 25, 245, 3, 47, 172, 111],
    },
  },
}
```