---
title: Public Key
metaTitle: Public Key | Token Auth Rules
description: The Public Key primitive rule
---

## Pubkey Match
지정된 Pubkey가 특정 Pubkey와 일치하는지 확인합니다. 예를 들어, 이 규칙은 특정 사람만 NFT에 대한 작업을 수행할 수 있는 액세스 권한을 부여받아야 할 때 사용할 수 있습니다.

### 필드
* **pubkey** - 비교할 공개 키
* **field** - 페이로드에서 확인할 Pubkey를 지정하는 필드

```js
// 이 Rule Set은 전송 대상이 Public Key와 일치할 경우에만 true로 평가됩니다.
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

## Pubkey List Match
Pubkey가 가능한 Pubkey 목록에 포함되어 있는지 확인하는 [PubkeyMatch](#pubkey-match)의 버전입니다. 예를 들어, 이 규칙은 토큰과 상호 작용할 수 있는 사용자의 허용 목록을 구축하는 데 사용할 수 있습니다.

### 필드
* **pubkeys** - 비교할 공개 키 목록
* **field** - 페이로드에서 확인할 Pubkey를 지정하는 필드

```js
// 이 Rule Set은 전송 대상이 Public Key 중 하나와 일치할 경우에만 true로 평가됩니다.
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

## Pubkey Tree Match
Pubkey가 가능한 Pubkey의 머클 트리에 포함되어 있는지 확인하는 [PubkeyMatch](#pubkey-match)의 버전입니다. 예를 들어, 이 규칙은 토큰과 상호 작용할 수 있는 사용자의 매우 큰 허용 목록을 구축하는 데 사용할 수 있습니다.

### 필드
* **pubkey_field** - 확인할 pubkey가 포함된 페이로드의 필드
* **proof_field** - 해시될 전체 머클 증명이 포함된 페이로드의 필드
* **root** - 머클 트리의 루트

```js
// 이 Rule Set은 전송 대상과 증명이 머클 루트로 해시될 경우에만 true로 평가됩니다.
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