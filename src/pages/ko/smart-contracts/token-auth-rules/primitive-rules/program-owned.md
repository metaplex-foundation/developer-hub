---
title: Program Owned
metaTitle: Program Owned | Token Auth Rules
description: The Program Owned primitive rule
---

## Program Owned

지정된 프로그램이 해당 계정을 소유하고 있는지 확인합니다. 이는 일반적으로 파생된 프로그램이 항상 소유하는 PDA(예: 마켓플레이스 및 유틸리티 프로그램)에 유용합니다.

### 필드

- **program** - 필드에 지정된 계정을 소유해야 하는 프로그램
- **field** - 소유자를 확인할 페이로드의 필드

```js
// 이 Rule Set은 지정된 필드의 PDA가 표시된 프로그램에 의해 소유될 경우에만 true로 평가됩니다.
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

## Program Owned List

가능한 소유 프로그램 목록과 비교하는 [Program Owned](#program-owned)의 버전입니다.

### 필드

- **programs** - 필드에 지정된 계정을 소유해야 하는 프로그램 중 하나인 프로그램 벡터
- **field** - 소유자를 확인할 페이로드의 필드

```js
// 이 Rule Set은 지정된 필드의 PDA가 표시된 프로그램 중 하나에 의해 소유될 경우에만 true로 평가됩니다.
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

## Program Owned Tree

가능한 소유 프로그램의 머클 트리와 비교하는 [Program Owned](#program-owned)의 버전입니다.

### 필드

- **pubkey_field** - 소유자를 확인할 페이로드의 필드
- **proof_field** - 해시될 전체 머클 증명이 포함된 페이로드의 필드
- **root** - 머클 트리의 루트

```js
// 이 Rule Set은 PDA와 제공된 증명이 올바른 머클 루트로 해시될 경우에만 true로 평가됩니다.
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
