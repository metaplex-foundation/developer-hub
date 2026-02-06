---
title: PDA Match
metaTitle: PDA Match | Token Auth Rules
description: The PDA Match primitive rule
---

## PDA Match

연관된 페이로드 및 규칙 필드와 함께 `find_program_address()`를 사용하여 PDA 파생을 수행합니다. 이 규칙은 PDA 파생이 페이로드 주소와 일치할 경우 true로 평가됩니다.

### 필드

* **program** - PDA가 파생되는 프로그램
* **pda_field** - 파생된 주소가 일치해야 하는 페이로드의 필드로, 규칙이 true로 평가되기 위해 필요합니다
* **seeds_field** - 파생에 사용할 PDA 시드 배열을 저장하는 페이로드의 필드

```js
// 이 Rule Set은 제공된 시드에서 파생된 PDA가 제공된 PDA와 일치할 경우에만 true로 평가됩니다.
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
